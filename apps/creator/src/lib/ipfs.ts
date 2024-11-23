"use server";

import axios from "axios";
import { getSession } from "next-auth/react";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Types
interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

interface IPFSResponse {
  IpfsHash?: string;
  Hash?: string;
}

// Axios client configuration
const axiosClient = axios.create({
  baseURL: "https://api.pinata.cloud",
  headers: {
    Authorization: `Bearer ${process.env.PINATA_JWT || ""}`,
  },
});

// Add and Pin File to IPFS
export async function addAndPinFile(
  formData: FormData,
  filename?: string,
  metadata?: PinataMetadata
): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.publicKey) {
      return redirect("/login");
    }

    // Convert FormData to Blob
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error("No file found in FormData");
    }

    // Create new FormData for Pinata upload
    const pinataFormData = new FormData();
    pinataFormData.append("file", file, filename || file.name);

    // Add optional metadata
    if (metadata) {
      pinataFormData.append("pinataMetadata", JSON.stringify(metadata));
    }

    // Upload to Pinata
    const response = await axiosClient.post<IPFSResponse>(
      "/pinning/pinFileToIPFS",
      pinataFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.IpfsHash || response.data.Hash || "";
  } catch (error) {
    console.error("Failed to add and pin file:", error);
    throw new Error(
      `Failed to add and pin file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Retrieve File from IPFS
export async function getFile(cid: string): Promise<Buffer> {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      { responseType: "arraybuffer" }
    );
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to get file:", error);
    throw new Error(
      `Failed to get file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Pin an existing file hash
export async function pinFile(cid: string): Promise<void> {
  try {
    await axiosClient.post("/pinning/addHashToPinQueue", {
      hashToPin: cid,
    });
  } catch (error) {
    console.error("Failed to pin file:", error);
    throw new Error(
      `Failed to pin file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Unpin a file from IPFS
export async function unpinFile(cid: string): Promise<void> {
  try {
    await axiosClient.delete(`/pinning/unpin/${cid}`);
  } catch (error) {
    console.error("Failed to unpin file:", error);
    throw new Error(
      `Failed to unpin file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// List all pinned files
export async function listPinnedFiles(): Promise<string[]> {
  try {
    const response = await axiosClient.get("/data/pinList");
    return response.data.rows.map((row: any) => row.ipfs_pin_hash);
  } catch (error) {
    console.error("Failed to list pinned files:", error);
    throw new Error(
      `Failed to list pinned files: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Upload JSON data to IPFS
export async function uploadJSON(
  jsonData: Record<string, any>,
  metadata?: PinataMetadata
): Promise<string> {
  try {
    const response = await axiosClient.post("/pinning/pinJSONToIPFS", {
      pinataContent: jsonData,
      pinataMetadata: metadata,
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Failed to upload JSON:", error);
    throw new Error(
      `Failed to upload JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Update metadata for a pinned file
export async function updateMetadata(
  cid: string,
  metadata: Record<string, string>
): Promise<void> {
  try {
    await axiosClient.put("/pinning/hashMetadata", {
      ipfsPinHash: cid,
      keyvalues: metadata,
    });
  } catch (error) {
    console.error("Failed to update metadata:", error);
    throw new Error(
      `Failed to update metadata: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
