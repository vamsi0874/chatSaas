
import { FileMetadata } from "@/types";
import { Trash2 } from "lucide-react"; // icon for delete
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import Link from "next/link";

type FileCardProps = {
  file: FileMetadata;
};

export function FileCard({ file }: FileCardProps) {
  const formattedDate = new Date(file.uploadDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch("/api/file/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.id }),
      });

      if (response.ok) {
        alert("File deleted successfully!");
        // Optionally refresh the file list or remove the card from UI
      } else {
        alert("Failed to delete the file.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the file.");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 truncate">{file.name}</h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{(file.size / 1024).toFixed(0)} KB</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/file/${file.id}`} className="flex-1">
                <Button className="w-full">Open Chat</Button>
              </Link>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleRemove}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Trash2, FileText, Calendar } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { useToast } from "@/components/ui/use-toast";
// import type { FileMetadata } from "@/types";

// type FileCardProps = {
//   file: FileMetadata;
// };

// export function FileCard({ file }: FileCardProps) {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const { toast } = useToast();

//   const formattedDate = new Date(file.uploadDate).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

//   const handleRemove = async () => {
//     try {
//       setIsDeleting(true);

//       const response = await fetch("/api/file/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fileId: file.id }),
//       });

//       if (response.ok) {
//         toast({
//           title: "File deleted",
//           description: `"${file.name}" has been removed successfully.`,
//         });

//         // Optionally refresh file list or remove from state
//       } else {
//         toast({
//           title: "Delete failed",
//           description: "Something went wrong while deleting the file.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred while deleting the file.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-start gap-4">
//           <div className="p-3 bg-primary/10 rounded-lg">
//             <FileText className="h-6 w-6 text-primary" />
//           </div>

//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-lg mb-2 truncate">{file.name}</h3>

//             <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
//               <Calendar className="h-4 w-4" />
//               <span>{formattedDate}</span>
//               <span>•</span>
//               <span>{(file.size / 1024).toFixed(0)} KB</span>
//             </div>

//             <div className="flex gap-2">
//               <Link href={`/file/${file.id}`} className="flex-1">
//                 <Button className="w-full">Open Chat</Button>
//               </Link>

//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     variant="destructive"
//                     className="flex-1"
//                     disabled={isDeleting}
//                   >
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     {isDeleting ? "Removing..." : "Remove"}
//                   </Button>
//                 </AlertDialogTrigger>

//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Are you sure you want to delete this file?
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This action cannot be undone. It will remove the file from
//                       both Vercel Blob and Firebase.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleRemove}>
//                       Delete
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

