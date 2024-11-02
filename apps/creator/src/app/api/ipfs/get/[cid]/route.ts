import { getFile } from "@/lib/ipfs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { cid: string } }
) {
  const cid = params.cid;

  if (!cid) {
    return NextResponse.json({ error: "Invalid CID" }, { status: 400 });
  }

  try {
    const fileContent = await getFile(cid);
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${cid}"`,
      },
    });
  } catch (error) {
    console.error("Error getting file:", error);
    return NextResponse.json({ error: "Error getting file" }, { status: 500 });
  }
}
