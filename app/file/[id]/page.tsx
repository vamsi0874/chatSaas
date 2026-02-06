"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/Navbar";
import { Chat } from "@/components/Chat";
import { FileMetadata } from "@/types";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/PdfViewer").then((mod) => mod.default), {
  ssr: false,
});

export default function FilePage() {
  const params = useParams();
  const { user, isLoaded, isSignedIn } = useUser();
  const [file, setFile] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchFile = async () => {
      try {
        if (!params?.id || !user?.id) {
          setError("Missing user or file ID.");
          setLoading(false);
          return;
        }

        const fileRef = doc(db, "users", user.id, "files", params.id as string);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
          setError("File not found.");
          setLoading(false);
          return;
        }

        const data = fileSnap.data();
        setFile({
          id: fileSnap.id,
          ...data,
          uploadDate: data.uploadDate?.toDate ? data.uploadDate.toDate() : null,
        } as FileMetadata);
      } catch (err: any) {
        console.error("Error fetching file:", err);
        setError("Failed to fetch file. Please check your internet or Firebase setup.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [isLoaded, isSignedIn, user, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">{error || "File not found"}</p>
        </div>
      </div>
    );
  }

  //  Main layout with independent scrolls
  return (
    <div className="h-screen flex flex-col overflow-hidden">
  <Navbar />

  <div className="flex-1 w-full flex border-r border-gray-200 overflow-hidden">
    {/* Left: PDF viewer (scrollable) */}
    <div className="w-1/2 overflow-y-auto">
      <PdfViewer url={file.url} />
    </div>

    {/* Right: Chat (scrollable independently) */}
    <div className="flex-1 overflow-y-auto">
      <Chat fileId={file.id} />
    </div>
  </div>
</div>

  );
}

