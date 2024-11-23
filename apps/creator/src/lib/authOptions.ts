import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import z from "zod";
import { AUTH_TOKEN_EXPIRATION_TIME } from "./config";
import nacl from "tweetnacl";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PatreonixProgramms } from "@repo/patreonix_programms/types";
import idl from "@repo/patreonix_programms/idl";
import config from "@/config";

const SigninSchema = z.object({
  publicKey: z.string(),
  signature: z.any(),
});

// Create connection to Solana network
const createConnection = () => {
  const endpoint = config.rpcEndpoint;
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_SOLANA_RPC_URL is not defined");
  }
  return new Connection(endpoint);
};

// Initialize Anchor program
const createProgram = (connection: Connection) => {
  // Create a read-only provider
  const provider = new anchor.AnchorProvider(
    connection,
    {} as any, // Wallet not needed for read-only operations
    { commitment: "processed" }
  );

  // Create program instance
  return new Program(idl as PatreonixProgramms, provider);
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "signin",
      id: "signin",
      credentials: {
        publicKey: { label: "PublicKey", type: "string" },
        signature: { label: "Signature", type: "string" },
      },
      async authorize(credentials) {
        try {
          const parsedData = SigninSchema.safeParse(credentials);

          if (!parsedData.success) {
            console.error("Invalid input fields:", parsedData.error);
            return null;
          }

          const { publicKey, signature } = parsedData.data;

          // Message that was signed
          const message = new TextEncoder().encode(
            "Sign into Patreonix as a creator"
          );

          // Verify signature
          const signatureUint8 = bs58.decode(signature);
          const publicKeyBytes = new PublicKey(publicKey).toBytes();

          const verified = nacl.sign.detached.verify(
            message,
            signatureUint8,
            publicKeyBytes
          );

          if (!verified) {
            console.error("Invalid signature");
            return null;
          }

          try {
            const connection = createConnection();
            const program = createProgram(connection);

            console.log("Connection and program initialized");

            const [creatorPDA] = PublicKey.findProgramAddressSync(
              [Buffer.from("creator"), new PublicKey(publicKey).toBuffer()],
              program.programId
            );
            console.log("programm id", program.programId.toBase58());
            console.log("Creator PDA:", creatorPDA.toBase58());

            // Fetch creator account
            const creatorAccount =
              await program.account.creator.fetch(creatorPDA);

            console.log("Creator account fetched:", creatorAccount);

            return {
              id: publicKey,
              name: creatorAccount.name,
              email: creatorAccount.email || `${publicKey}@patreonix.com`,
              bio: creatorAccount.bio,
              isActive: creatorAccount.isActive,
              publicKey: publicKey,
              avatar: creatorAccount?.avatar || null,
            };
          } catch (error) {
            console.error("User not found in Solana program:", error);
            return null;
          }
        } catch (error) {
          console.error("Failed to sign in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.publicKey = user.publicKey;
        token.avatar = user?.avatar;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.publicKey = token.publicKey;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
