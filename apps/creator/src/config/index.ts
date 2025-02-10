import idl from "@repo/patreonix_program/idl";
import { PublicKey } from "@solana/web3.js";

export const config = {
  rpcEndpoint:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8899"
      : process.env.RPC_URL || "https://api.devnet.solana.com",

  programId: new PublicKey(idl.address),
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "next-auth-secret",
  nextAuthJwtSecret: process.env.NEXTAUTH_JWT_SECRET || "next-auth",
  pinataApiKey: process.env.PINATA_API_KEY || "pinata-api-key",
  pinataApiSecret: process.env.PINATA_API_SECRET || "pinata",
  pinataJwt: process.env.PINATA_JWT || "",
};

export default config;
