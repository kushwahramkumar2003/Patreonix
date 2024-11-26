"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "@repo/patreonix_programms/idl";
import { PatreonixProgramms } from "@repo/patreonix_programms/types";
import { Connection } from "@solana/web3.js";
import config from "../config/index";

const connection = new Connection(config.rpcEndpoint);

export const getClientAnchorProgramm = async () => {
  const wallet = useAnchorWallet();
  if (!wallet) {
    console.log("wallet not connected!!");
    return;
  }
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "processed",
  });
  return new anchor.Program(idl as PatreonixProgramms, provider);

};
