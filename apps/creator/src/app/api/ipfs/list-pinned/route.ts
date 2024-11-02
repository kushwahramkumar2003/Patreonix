import { listPinnedFiles } from "@/lib/ipfs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pinnedFiles = await listPinnedFiles();
    return NextResponse.json({ pinnedFiles }, { status: 200 });
  } catch (error) {
    console.error("Error listing pinned files:", error);
    return NextResponse.json(
      { error: "Error listing pinned files" },
      { status: 500 }
    );
  }
}
