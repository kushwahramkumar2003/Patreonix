import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import idl from "@repo/patreonix_program/idl";
import { PatreonixProgram } from "@repo/patreonix_program/types";
import { Connection, PublicKey } from "@solana/web3.js";

export class PatreonixError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "PatreonixError";
  }
}

const toLEBytes = (num: number) => {
  const buffer = Buffer.alloc(8); // U64 takes 8 bytes
  buffer.writeBigUInt64LE(BigInt(num));
  return buffer;
};

const contentTypeMap = {
  text: { text: {} },
  image: { image: {} },
  video: { video: {} },
  audio: { audio: {} },
};

export class Patreonix {
  private program: Program<PatreonixProgram>;
  private connection: Connection;

  private logger: (message: string, ...args: any[]) => void;

  constructor(
    provider: anchor.AnchorProvider,
    debug: boolean = false,
    // eslint-disable-next-line
    customLogger?: (message: string, ...args: any[]) => void
  ) {
    if (!provider.publicKey) {
      throw new PatreonixError(
        "Provider wallet not connected",
        "WALLET_NOT_CONNECTED"
      );
    }

    this.program = new Program(idl as PatreonixProgram, provider);
    this.connection = provider.connection;
    this.logger = customLogger || (debug ? console.log : () => {});
  }

  private getCreatorPda(creatorPublicKey: PublicKey) {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("creator"), creatorPublicKey.toBuffer()],
      this.program.programId
    );
    return pda;
  }
  private getContentPda(publicKey: PublicKey) {
    const [contentPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("content"), publicKey.toBuffer()],
      this.program.programId
    );
    return contentPda;
  }

  async getCreatorAccount(creatorPublicKey: PublicKey) {
    this.logger("Getting creator account");
    try {
      const creatorPda = this.getCreatorPda(creatorPublicKey);
      const creatorAccount =
        await this.program.account.creator.fetch(creatorPda);
      this.logger("Creator account fetched");
      return creatorAccount;
    } catch (error) {
      this.logger("Error getting creator account", error);
      throw new PatreonixError(
        "Error getting creator account",
        "GET_CREATOR_ACCOUNT_ERROR"
      );
    }
  }
  async getTotalContentCount(creatorPublicKey: PublicKey): Promise<number> {
    try {
      const creatorPda = this.getCreatorPda(creatorPublicKey);
      const creatorAccount =
        await this.program.account.creator.fetch(creatorPda);
      return creatorAccount.totalContent.toNumber(); // Use .toNumber() if stored as BN
    } catch (error) {
      this.logger("Error getting content count", error);
      throw new PatreonixError(
        "Error getting content count",
        "CONTENT_COUNT_ERROR"
      );
    }
  }

  // async getContentByIndex(
  //   creatorPublicKey: PublicKey,
  //   index: number
  // ): Promise<any> {
  //   try {
  //     const [contentPda] = PublicKey.findProgramAddressSync(
  //       [
  //         Buffer.from("content"),
  //         creatorPublicKey.toBuffer(),
  //         new anchor.BN(index).toArrayLike(Buffer, "le", 8),
  //       ],
  //       this.program.programId
  //     );

  //     return await this.program.account.content.fetch(contentPda);
  //   } catch (error) {
  //     this.logger("Error fetching content by index", error);
  //     throw new PatreonixError("Content not found", "CONTENT_NOT_FOUND");
  //   }
  // }

  async getAllContentPDAs(creatorPublicKey: PublicKey): Promise<PublicKey[]> {
    try {
      return (
        await this.connection.getProgramAccounts(this.program.programId, {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: anchor.utils.bytes.bs58.encode(Buffer.from("content")),
              },
            },
            { memcmp: { offset: 32, bytes: creatorPublicKey.toBase58() } }, // Adjust offset based on actual layout
          ],
        })
      ).map((acc) => acc.pubkey);
    } catch (error) {
      this.logger("Error fetching content PDAs", error);
      throw new PatreonixError("Error fetching content", "FETCH_CONTENT_ERROR");
    }
  }

  async createPost({
    creatorPublicKey,
    title,
    description,
    contentUrl,
    contentType,
  }: {
    creatorPublicKey: anchor.web3.PublicKey;
    title: string;
    description: string;
    contentUrl: string;
    contentType: "image" | "video" | "audio" | "text";
  }): Promise<string> {
    this.logger("Creating post");
    try {
      const creatorPda = this.getCreatorPda(creatorPublicKey);
      this.logger("Creator PDA", creatorPda.toBase58());
      this.logger("fetching creatorAccount");
      const creatorAccount =
        await this.program.account.creator.fetch(creatorPda);
      this.logger("Creator account fetched");
      const contentIndex = creatorAccount.totalContent.toNumber(); // Convert BN to number

      const [contentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("content"),
          creatorPda.toBuffer(),
          toLEBytes(contentIndex),
        ],
        this.program.programId
      );

      this.logger("Creating content");
      this.logger("Content PDA", contentPda.toBase58());
      this.logger("Creator PDA", creatorPda.toBase58());
      this.logger("Creator public key", creatorPublicKey.toBase58());

      const tx = await this.program.methods
        .createContent(
          title,
          description,
          contentUrl,
          contentTypeMap[contentType],
          new anchor.BN(contentIndex) // Add as last parameter
        )
        .accounts({
          content: contentPda,
          creator: creatorPda,
          authority: creatorPublicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      this.logger("Post created");
      return tx;
    } catch (error) {
      this.logger("Error creating post", error);
      throw new PatreonixError("Error creating post", "CREATE_POST_ERROR");
    }
  }

  /**
   * Fetches all content items for a specific creator
   * @param creatorPublicKey The public key of the creator
   * @returns An array of content items
   */
  async getAllContent(creatorPublicKey: PublicKey) {
    this.logger("Fetching all content");
    try {
      // First get the total content count
      const totalContent = await this.getTotalContentCount(creatorPublicKey);

      // Create an array of indices from 0 to totalContent - 1
      const indices = Array.from({ length: totalContent }, (_, i) => i);

      // Fetch all content items in parallel
      const contentPromises = indices.map((index) =>
        this.getContentByIndex(creatorPublicKey, index)
      );

      const contents = await Promise.all(contentPromises);

      // Filter out any null values (in case some content was deleted)
      const validContents = contents.filter((content) => content !== null);

      this.logger(`Successfully fetched ${validContents.length} content items`);
      return validContents;
    } catch (error) {
      this.logger("Error fetching all content", error);
      throw new PatreonixError(
        "Failed to fetch all content",
        "FETCH_ALL_CONTENT_ERROR"
      );
    }
  }

  /**
   * Fetches a specific content item by its index
   * @param creatorPublicKey The public key of the creator
   * @param index The index of the content to fetch
   * @returns The content item or null if not found
   */
  async getContentByIndex(creatorPublicKey: PublicKey, index: number) {
    this.logger(`Fetching content at index ${index}`);
    try {
      const creatorPDA = this.getCreatorPda(creatorPublicKey);

      // Calculate the PDA for this specific content index
      const [contentPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("content"), creatorPDA.toBuffer(), toLEBytes(index)],
        this.program.programId
      );

      const contentAccount = await this.program.methods
        .fetchContentByIndex(new anchor.BN(index))
        .accounts({
          content: contentPda,
          creator: creatorPDA,
        })
        .view();

      this.logger("tempContent", contentAccount);

      // Fetch the content account
      this.logger("contentAccount", contentAccount);

      // Transform the account data into a more usable format
      return {
        index,
        pda: contentPda,
        creator: contentAccount.creator,
        title: contentAccount.title,
        description: contentAccount.description,
        contentUrl: contentAccount.content,
        contentType: Object.keys(contentAccount.contentType)[0],
        createdAt: contentAccount.createdAt.toString(),
        updatedAt: contentAccount?.updatedAt?.toString() || "",
        likes: contentAccount.totalLikes,
        views: contentAccount.totalViews,
        isActive: contentAccount.isActive,
      };
    } catch (error) {
      // If the error is due to the account not existing, return null
      if (
        error instanceof Error &&
        error.toString().includes("Account does not exist")
      ) {
        this.logger(`No content found at index ${index}`);
        return null;
      }

      this.logger(`Error fetching content at index ${index}`, error);
      throw new PatreonixError(
        `Failed to fetch content at index ${index}`,
        "FETCH_CONTENT_ERROR"
      );
    }
  }

  /**
   * Fetches a paginated list of content items
   * @param creatorPublicKey The public key of the creator
   * @param page The page number (0-based)
   * @param pageSize The number of items per page
   * @returns A paginated result of content items
   */
  async getPaginatedContent(
    creatorPublicKey: PublicKey,
    page: number = 0,
    pageSize: number = 10
  ) {
    this.logger(`Fetching paginated content: page ${page}, size ${pageSize}`);
    try {
      const totalContent = await this.getTotalContentCount(creatorPublicKey);
      this.logger(`Total content items: ${totalContent}`);
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalContent);

      if (startIndex >= totalContent) {
        return {
          items: [],
          total: totalContent,
          page,
          pageSize,
          hasMore: false,
        };
      }

      const indices = Array.from(
        { length: endIndex - startIndex },
        (_, i) => startIndex + i
      );

      const contentPromises = indices.map((index) =>
        this.getContentByIndex(creatorPublicKey, index)
      );

      const contents = await Promise.all(contentPromises);
      const validContents = contents.filter((content) => content !== null);

      this.logger(
        `Successfully fetched ${validContents.length} content items for page ${page}`
      );

      this.logger("Valid contents", validContents);

      return {
        items: validContents,
        total: totalContent,
        page,
        pageSize,
        hasMore: endIndex < totalContent,
      };
    } catch (error) {
      this.logger("Error fetching paginated content", error);
      throw new PatreonixError(
        "Failed to fetch paginated content",
        "FETCH_PAGINATED_CONTENT_ERROR"
      );
    }
  }
}
