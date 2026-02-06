// "use client";

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { Navbar } from "@/components/Navbar";
// import { FileUpload } from "@/components/FileUpload";
// import { FileCard } from "@/components/FileCard";
// import { EmptyState } from "@/components/EmptyState";
// import { FileMetadata } from "@/types";

// export default function DashboardPage() {
//   const { user } = useUser();
//   const router = useRouter();
//   const [files, setFiles] = useState<FileMetadata[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;

//     const filesRef = collection(db, "users", user.id, "files");
//     const q = query(filesRef, where("userId", "==", user.id));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const filesData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         uploadDate: doc.data().uploadDate?.toDate(),
//       })) as FileMetadata[];

//       setFiles(filesData);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user]);

//   const handleUpload = async (file: File) => {
//     if (!user) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Upload failed");
//     }

//     const data = await response.json();
//     router.push(`/file/${data.fileId}`);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Your PDFs</h1>
//           <p className="text-muted-foreground">
//             Upload and manage your PDF documents
//           </p>
//         </div>

//         <div className="mb-12">
//           <FileUpload onUpload={handleUpload} />
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">Loading your files...</p>
//           </div>
//         ) : files.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {files.map((file) => (
//               <FileCard key={file.id} file={file} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/Navbar";
import { FileUpload } from "@/components/FileUpload";
import { FileCard } from "@/components/FileCard";
import { EmptyState } from "@/components/EmptyState";
import { FileMetadata } from "@/types";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const filesRef = collection(db, "users", user.id, "files");
    const q = query(filesRef, where("userId", "==", user.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate(),
      })) as FileMetadata[];

      setFiles(filesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpload = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("file", file);

    

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    router.push(`/file/${data.fileId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your PDFs</h1>
          <p className="text-muted-foreground">
            Upload and manage your PDF documents
          </p>
        </div>

        <div className="mb-12">
          <FileUpload onUpload={handleUpload} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your files...</p>
          </div>
        ) : files.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
