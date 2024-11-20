import { useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "@repo/patreonix_programms/idl";
import { PatreonixProgramms } from "@repo/patreonix_programms/types";

interface ProgramHookState {
  program: Program<PatreonixProgramms> | null;
  provider: AnchorProvider | null;
  error: Error | null;
  loading: boolean;
  connected: boolean;
  PROGRAM_ID: PublicKey;
}

const PROGRAM_ID = new PublicKey(idl.address);

export function useCounterProgram(): ProgramHookState {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo((): ProgramHookState => {
    if (!wallet) {
      return {
        program: null,
        provider: null,
        error: null,
        loading: false,
        connected: false,
        PROGRAM_ID,
      };
    }

    try {
      const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });
      setProvider(provider);

      const program = new Program(idl as PatreonixProgramms, provider);

      return {
        program,
        provider,
        error: null,
        loading: false,
        connected: true,
        PROGRAM_ID,
      };
    } catch (error) {
      return {
        program: null,
        provider: null,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to initialize program"),
        loading: false,
        connected: false,
        PROGRAM_ID,
      };
    }
  }, [connection, wallet]);
}
