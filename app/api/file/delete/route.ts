import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromVercel, deleteFileFromFirebase } from "@/lib/actions";

export async function POST(req: NextRequest) {
  const { fileId } = await req.json();
const blobUrl = `https://3Z0TqyWQtsXPt9AU.blob.vercel-storage.com/${fileId}`
  try {
    await deleteFileFromVercel(blobUrl);

    await deleteFileFromFirebase(fileId);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
