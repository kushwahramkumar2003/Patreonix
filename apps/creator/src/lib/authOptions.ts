import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import z from "zod";
import { AUTH_TOKEN_EXPIRATION_TIME } from "./config";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const SigninSchema = z.object({
  publicKey: z.string(),
  signature: z.any(),
});

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

          // Here you would typically fetch the user from your database
          // For now, we'll create a basic user object

          return {
            id: publicKey,
            name: `Creator ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
            email: `${publicKey}@patreonix.com`,
            publicKey: publicKey,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.publicKey = user.publicKey;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.publicKey = token.publicKey;
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
