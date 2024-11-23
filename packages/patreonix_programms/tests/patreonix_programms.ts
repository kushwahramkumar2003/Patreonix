import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PatreonixProgramms } from "../target/types/patreonix_programms";
import { expect } from "chai";

describe("patreonix_programms", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .PatreonixProgramms as Program<PatreonixProgramms>;
  let creatorPDA: anchor.web3.PublicKey;

  before(async () => {
    [creatorPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("creator"), provider.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Initialization signature:", tx);
  });

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
});
