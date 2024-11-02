import { unpinFile } from "@/lib/ipfs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { cid } = await request.json();

  if (!cid || typeof cid !== "string") {
    return NextResponse.json({ error: "Invalid CID" }, { status: 400 });
  }

  try {
    await unpinFile(cid);
    return NextResponse.json(
      { message: "File unpinned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unpinning file:", error);
    return NextResponse.json(
      { error: "Error unpinning file" },
      { status: 500 }
    );
  }
}
