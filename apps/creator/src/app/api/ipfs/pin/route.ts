import { pinFile } from "@/lib/ipfs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { cid } = await request.json();

  if (!cid || typeof cid !== "string") {
    return NextResponse.json({ error: "Invalid CID" }, { status: 400 });
  }

  try {
    await pinFile(cid);
    return NextResponse.json(
      { message: "File pinned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error pinning file:", error);
    return NextResponse.json({ error: "Error pinning file" }, { status: 500 });
  }
}
