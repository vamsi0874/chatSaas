

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
// import { Document } from "@langchain/core/documents";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
// import pdf from "pdf-parse";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }
    const fileId = uuidv4();

    const path = `users/${userId}/files/${fileId}`

    const blob = await put(path, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

  

   
    const fileRef = doc(db, "users", userId, "files", fileId);

    await setDoc(fileRef, {
      name: file.name,
      url: blob.url,
      uploadDate: serverTimestamp(),
      size: file.size,
      status: "processing",
      userId: userId,
      ref: path,
    });
    
    await generateEmbeddingsInPineconeVectorStore(fileId)

    return NextResponse.json({
      fileId,
      blobUrl: blob.url,
      status: "ready",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
