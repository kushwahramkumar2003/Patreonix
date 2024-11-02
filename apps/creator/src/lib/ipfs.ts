import axios, { AxiosInstance } from "axios";

// Define the structure for IPFS provider configurations
interface IPFSProviderConfig {
  url: string;
  headers?: Record<string, string>;
  addPath?: string;
  catPath?: string;
  pinAddPath?: string;
  pinRmPath?: string;
  pinLsPath?: string;
}

// Define available IPFS providers
type IPFSProvider = "self-hosted" | "infura" | "pinata";

// Configuration for different IPFS providers
const IPFS_PROVIDERS: Record<IPFSProvider, IPFSProviderConfig> = {
  "self-hosted": {
    url: "http://ec2-54-234-90-68.compute-1.amazonaws.com:5001",
    addPath: "/api/v0/add",
    catPath: "/api/v0/cat",
    pinAddPath: "/api/v0/pin/add",
    pinRmPath: "/api/v0/pin/rm",
    pinLsPath: "/api/v0/pin/ls",
  },
  infura: {
    url: "https://ipfs.infura.io:5001",
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.INFURA_PROJECT_ID + ":" + process.env.INFURA_PROJECT_SECRET).toString("base64")}`,
    },
    addPath: "/api/v0/add",
    catPath: "/api/v0/cat",
    pinAddPath: "/api/v0/pin/add",
    pinRmPath: "/api/v0/pin/rm",
    pinLsPath: "/api/v0/pin/ls",
  },
  pinata: {
    url: "https://api.pinata.cloud",
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY || "",
      pinata_secret_api_key: process.env.PINATA_API_SECRET || "",
    },
    addPath: "/pinning/pinFileToIPFS",
    catPath: "/pinning/pinJSONToIPFS", // Note: Pinata doesn't have a direct 'cat' equivalent
    pinAddPath: "/pinning/addHashToPinQueue",
    pinRmPath: "/pinning/unpin",
    pinLsPath: "/data/pinList",
  },
};

// Create IPFS client based on the selected provider
function createIPFSClient(provider: IPFSProvider): AxiosInstance {
  const config = IPFS_PROVIDERS[provider];
  return axios.create({
    baseURL: config.url,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
  });
}

// Select the IPFS provider (you can change this based on your needs)
const SELECTED_PROVIDER: IPFSProvider = "self-hosted";

// Create the IPFS client
const ipfsClient = createIPFSClient(SELECTED_PROVIDER);

export async function addFile(file: Buffer): Promise<string> {
  const config = IPFS_PROVIDERS[SELECTED_PROVIDER];
  const formData = new FormData();
  formData.append("file", new Blob([file]));

  const response = await ipfsClient.post(
    config.addPath || "/api/v0/add",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.Hash || response.data.IpfsHash; // Handle different response formats
}

export async function getFile(cid: string): Promise<Buffer> {
  const config = IPFS_PROVIDERS[SELECTED_PROVIDER];
  const response = await ipfsClient.get(`${config.catPath}?arg=${cid}`, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data);
}

export async function pinFile(cid: string): Promise<void> {
  const config = IPFS_PROVIDERS[SELECTED_PROVIDER];
  await ipfsClient.post(`${config.pinAddPath}?arg=${cid}`);
}

export async function unpinFile(cid: string): Promise<void> {
  const config = IPFS_PROVIDERS[SELECTED_PROVIDER];
  await ipfsClient.post(`${config.pinRmPath}?arg=${cid}`);
}

export async function listPinnedFiles(): Promise<string[]> {
  const config = IPFS_PROVIDERS[SELECTED_PROVIDER];
  const response = await ipfsClient.post(config.pinLsPath || "/api/v0/pin/ls");

  // Handle different response formats
  if (SELECTED_PROVIDER === "pinata") {
    return response.data.rows.map((row: any) => row.ipfs_pin_hash);
  }
  return Object.keys(response.data.Keys);
}

// Export the IPFS client for advanced usage
export { ipfsClient };
