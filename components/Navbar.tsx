// "use client";

// import Link from "next/link";
// import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import { FileText } from "lucide-react";

// export function Navbar() {
//   return (
//     <nav className="border-b bg-background">
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         <Link href="/" className="flex items-center gap-2">
//           <FileText className="h-6 w-6 text-primary" />
//           <span className="text-xl font-bold">PDF Chat</span>
//         </Link>
        
//         <div className="flex items-center gap-4">
//           <SignedIn>
//             <Link href="/dashboard">
//               <Button variant="ghost">Dashboard</Button>
//             </Link>
//             <UserButton afterSignOutUrl="/" />
//           </SignedIn>
          
//           <SignedOut>
//             <Link href="/sign-in">
//               <Button variant="ghost">Sign In</Button>
//             </Link>
//             <Link href="/sign-up">
//               <Button>Get Started</Button>
//             </Link>
//           </SignedOut>
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 left-0 w-full z-50 h-16">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">PDF Chat</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
