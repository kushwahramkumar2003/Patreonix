import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Patreonix } from "@/lib/solana";

export function useProgram() {
  const { connection } = useConnection();

  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet.publicKey) return null;

    const provider = new anchor.AnchorProvider(
      connection,
      wallet as AnchorWallet,
      {
        commitment: "confirmed",
      }
    ); //provider

    return new Patreonix(provider,true); //instance
  }, [connection, wallet]);

  return { program };
}
