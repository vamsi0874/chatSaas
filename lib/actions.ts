'use server'
import {  generateLangchainCompletion } from "./langchain"
// import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { adminDb } from "./firebaseAdmin"
import { del } from "@vercel/blob";

export type Message = {
   role: "human" | "ai";
   message: string;
   createdAt: Date;
};


 export async function askQuestion(id:string, question:string)  {
   const { userId } = await auth()

   const chatRef = adminDb.collection("users").doc(userId!).collection("files").doc(id).collection("chats")

   const chatSnapshot = await chatRef.get();
 

   // const userMessages = chatSnapshot.docs.map(doc => doc.data()).filter(msg => msg.role === 'human');

   const userMessage: Message = {
      role: "human",
      message: question,
      createdAt: new Date(),
   };

   chatRef.add(userMessage);

   const reply = await generateLangchainCompletion(id,question)
   const aiMesssage: Message = {
      role: "ai",
      message: reply,
      createdAt: new Date(),
   };

   chatRef.add(aiMesssage);
   return {success:true,message:null}

}



export async function deleteFileFromVercel(blobUrl: string) {



  try {
    await del(blobUrl); // Or pass an array for multiple: await del([url1, url2]);
  } catch (error) {
    console.error('Delete failed:', error);
    throw new Error("Failed to delete file from Vercel Blob");
  }
}


export async function deleteFileFromFirebase(fileId: string) {
  
     const { userId } = await auth()

   const fileRef = adminDb.collection("users").doc(userId!).collection("files").doc(fileId);

   await fileRef.delete();
}
