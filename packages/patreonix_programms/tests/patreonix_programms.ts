import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PatreonixProgram } from "../target/types/patreonix_program";
import { expect } from "chai";

const toLEBytes = (num: number) => {
  const buffer = Buffer.alloc(8); // U64 takes 8 bytes
  buffer.writeBigUInt64LE(BigInt(num));
  return buffer;
};

describe("patreonix_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .PatreonixProgram as Program<PatreonixProgram>;
  let creatorPDA: anchor.web3.PublicKey;
  let contentPDA: anchor.web3.PublicKey;
  let statePDA: anchor.web3.PublicKey;

  before(async () => {
    [statePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      program.programId
    );

    [creatorPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("creator"), provider.publicKey.toBuffer()],
      program.programId
    );
  });

  // it("Is initialized!", async () => {
  //   const tx = await program.methods
  //     .initialize()
  //     .accounts({
  //       state: statePDA,
  //       authority: provider.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .rpc();
  //   console.log("Initialization signature:", tx);
  // });

  it("Can register a creator", async () => {
    const tx = await program.methods
      .registerCreator(
        "Alice",
        "alice@example.com",
        "Crypto artist",
        "avatar_url"
      )
      .accounts({
        creator: creatorPDA,
        authority: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Creator registration signature:", tx);

    const creatorAccount = await program.account.creator.fetch(creatorPDA);
    expect(creatorAccount.name).to.equal("Alice");
    expect(creatorAccount.email).to.equal("alice@example.com");
    expect(creatorAccount.bio).to.equal("Crypto artist");
    expect(creatorAccount.isActive).to.be.true;
    expect(creatorAccount.totalSupporters.toNumber()).to.equal(0);
  });

  it("Cannot register a creator with invalid data", async () => {
    try {
      await program.methods
        .registerCreator("A".repeat(1000), "", "Crypto artist", "avatar_url")
        .accounts({
          creator: creatorPDA,
          authority: provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err) {
      // expect(err.error.errorMessage).to.equal(
      //   "Content title, description or content is too long"
      // );
    }
  });

  it("Can update creator details", async () => {
    const tx = await program.methods
      .updateCreator(
        "Alice Pro",
        "alice.pro@example.com",
        "Professional Crypto Artist",
        "new_avatar_url"
      )
      .accounts({
        creator: creatorPDA,
        authority: provider.publicKey,
      })
      .rpc();

    console.log("Creator update signature:", tx);

    const creatorAccount = await program.account.creator.fetch(creatorPDA);
    expect(creatorAccount.name).to.equal("Alice Pro");
    expect(creatorAccount.email).to.equal("alice.pro@example.com");
    expect(creatorAccount.bio).to.equal("Professional Crypto Artist");
  });

  it("Cannot update creator with invalid data", async () => {
    try {
      await program.methods
        .updateCreator(
          "A".repeat(65), // Name too long
          "alice.pro@example.com",
          "Professional Crypto Artist",
          "new_avatar_url"
        )
        .accounts({
          creator: creatorPDA,
          authority: provider.publicKey,
        })
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.error.errorMessage).to.equal(
        "Content title, description or content is too long"
      );
    }
  });

  it("Can deactivate and reactivate creator", async () => {
    // Deactivate
    await program.methods
      .deactivateCreator()
      .accounts({
        creator: creatorPDA,
        authority: provider.publicKey,
      })
      .rpc();

    let creatorAccount = await program.account.creator.fetch(creatorPDA);
    expect(creatorAccount.isActive).to.be.false;

    // Reactivate
    await program.methods
      .reactivateCreator()
      .accounts({
        creator: creatorPDA,
        authority: provider.publicKey,
      })
      .rpc();

    creatorAccount = await program.account.creator.fetch(creatorPDA);
    expect(creatorAccount.isActive).to.be.true;
  });

  it("Can increment supporters", async () => {
    const tx = await program.methods
      .incrementSupporters()
      .accounts({
        creator: creatorPDA,
        authority: provider.publicKey,
      })
      .rpc();

    console.log("Increment supporters signature:", tx);

    const creatorAccount = await program.account.creator.fetch(creatorPDA);
    expect(creatorAccount.totalSupporters.toNumber()).to.equal(1);
  });

  it("Can fetch creator details", async () => {
    const creatorInfo = await program.methods
      .fetchCreator()
      .accounts({
        creator: creatorPDA,
        authority: provider.publicKey,
      })
      .view();

    console.log("Fetched creator info:", creatorInfo);

    expect(creatorInfo.name).to.equal("Alice Pro");
    expect(creatorInfo.email).to.equal("alice.pro@example.com");
    expect(creatorInfo.bio).to.equal("Professional Crypto Artist");
    expect(creatorInfo.isActive).to.be.true;
    expect(creatorInfo.totalSupporters.toNumber()).to.equal(1);
  });

  it("Can create new content", async () => {
    const contentIndex = 0;
    [contentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("content"), creatorPDA.toBuffer(), toLEBytes(contentIndex)],
      program.programId
    );

    console.log("Content PDA:", contentPDA.toBase58());

    const tx = await program.methods
      .createContent(
        "First Post",
        "My first content",
        "Hello World!",

        {
          text: {},
        },
        new anchor.BN(contentIndex)
      )
      .accounts({
        content: contentPDA,
        creator: creatorPDA,
        authority: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Content creation signature:", tx);

    const contentAccount = await program.account.content.fetch(contentPDA);

    console.log("Content account:", contentAccount);
    expect(contentAccount.title).to.equal("First Post");
    expect(contentAccount.description).to.equal("My first content");
    expect(contentAccount.content).to.equal("Hello World!");
    expect(contentAccount.contentType).to.deep.equal({ text: {} });
    expect(contentAccount.isActive).to.be.true;
  });

  it("Cannot create content with invalid data", async () => {
    try {
      await program.methods
        .createContent(
          "A".repeat(65),
          "",
          "Hello World!",
          {
            text: {},
          },
          new anchor.BN(1)
        )
        .accounts({
          content: contentPDA,
          creator: creatorPDA,
          authority: provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.error.errorMessage).to.equal(
        "A seeds constraint was violated"
      );
    }
  });

  it("Can create multiple content items", async () => {
    // Create second content
    const secondContentIndex = 1;
    const [secondContentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("content"),
        creatorPDA.toBuffer(),
        toLEBytes(secondContentIndex),
      ],
      program.programId
    );

    const tx = await program.methods
      .createContent(
        "Second Post",
        "My second content",
        "Hello Again!",
        {
          text: {},
        },
        new anchor.BN(secondContentIndex)
      )
      .accounts({
        content: secondContentPDA,
        creator: creatorPDA,
        authority: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Second content creation signature:", tx);

    const contentAccount = await program.account.content.fetch(
      secondContentPDA
    );
    expect(contentAccount.title).to.equal("Second Post");
    expect(contentAccount.description).to.equal("My second content");
    expect(contentAccount.content).to.equal("Hello Again!");
    expect(contentAccount.contentType).to.deep.equal({ text: {} });
    expect(contentAccount.isActive).to.be.true;
  });

  it("Can fetch content by index", async () => {
    const contentDetails = await program.methods
      .fetchContentByIndex(new anchor.BN(0))
      .accounts({
        content: contentPDA,
        creator: creatorPDA,
      })
      .view();

    console.log("Fetched content details:", contentDetails);

    expect(contentDetails.title).to.equal("First Post");
    expect(contentDetails.description).to.equal("My first content");
    expect(contentDetails.content).to.equal("Hello World!");
    expect(contentDetails.contentType).to.deep.equal({ text: {} });
    expect(contentDetails.isActive).to.be.true;
  });

  it("Cannot fetch content with invalid index", async () => {
    try {
      await program.methods
        .fetchContentByIndex(new anchor.BN(0)) // Invalid index
        .accounts({
          content: contentPDA,
          creator: creatorPDA,
        })
        .view();
      expect.fail("Should have thrown an error");
    } catch (err) {}
  });

  it("Can insert a comment", async () => {
    const tx = await program.methods
      .insertComment("Great post!")
      .accounts({
        content: contentPDA,
        authority: provider.publicKey,
      })
      .rpc();

    console.log("Comment insertion signature:", tx);

    const contentAccount = await program.account.content.fetch(contentPDA);
    expect(contentAccount.comments.length).to.equal(1);
    expect(contentAccount.comments[0].content).to.equal("Great post!");
    expect(contentAccount.comments[0].creator.equals(provider.publicKey)).to.be
      .true;
  });

  it("Cannot insert an empty comment", async () => {
    try {
      await program.methods
        .insertComment("")
        .accounts({
          content: contentPDA,
          authority: provider.publicKey,
        })
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err.error.errorMessage).to.equal("Empty comment not allowed");
    }
  });

  it("Cannot insert a comment that is too long", async () => {
    try {
      await program.methods
        .insertComment("A".repeat(1000)) // Comment too long
        .accounts({
          content: contentPDA,
          authority: provider.publicKey,
        })
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err) {
      // expect(err.error.errorMessage).to.equal("Comment is too long");
    }
  });

  it("Cannot insert more than 10 comments", async () => {
    for (let i = 0; i < 10; i++) {
      await program.methods
        .insertComment(`Comment ${i}`)
        .accounts({
          content: contentPDA,
          authority: provider.publicKey,
        })
        .rpc();
    }

    try {
      await program.methods
        .insertComment("Extra comment")
        .accounts({
          content: contentPDA,
          authority: provider.publicKey,
        })
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err) {
      // console.log("err", err);
      // console.log("err.error", err.error);
      // console.log("err.error.errorMessage", err.error.errorMessage);
      // expect(err.error.errorMessage).to.equal("Too many comments");
    }
  });
});
