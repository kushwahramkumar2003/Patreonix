import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PatreonixProgramms } from "@repo/patreonix_programms/types";
import idl from "@repo/patreonix_programms/idl";
import config from "@/config";

const connection = new Connection(config.rpcEndpoint);

export const getServerAnchorProgramm = async () => {
  const provider = new anchor.AnchorProvider(connection, {} as any, {
    commitment: "processed",
  });
  return new Program(idl as PatreonixProgramms, provider);
};

export const getCreatorPda = async (creatorPublicKey: PublicKey) => {
  const program = await getServerAnchorProgramm();
  const [pda] = await PublicKey.findProgramAddressSync(
    [Buffer.from("creator"), creatorPublicKey.toBuffer()],
    program.programId
  );
  return pda;
};
