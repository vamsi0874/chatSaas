
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { pc } from "./pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "./firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import { generateAiContext, generateEmbedding } from "@/lib/gemini";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);





export const indexName = "chatpdf";
const index = pc.index("chatpdf");
//  Utility delay function

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
const langChainModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

// const embeddings = new GoogleGenerativeAIEmbeddings({
//   model: "models/embedding-001", // or "text-embedding-004"
//   apiKey: process.env.GOOGLE_API_KEY, // your Gemini API key
// });

const embeddings = genAI.getGenerativeModel({ model: "text-embedding-004" });

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



export async function generateEmbedding(doc:{pageContent:string}) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  // Extract the text correctly
  const text =
    typeof doc === "object" && doc.pageContent
      ? doc.pageContent
      : String(doc || "");

  // Ensure it's not empty (Gemini throws an error on empty strings)
  if (!text.trim()) {
    console.warn("⚠️ Skipping empty document");
    return null;
  }

  const result = await model.embedContent(text);
  const embedding = result.embedding.values;
  return embedding;
}

export async function fetchMessagesFromDB(docId:string){
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const chats = await adminDb
    .collection("users")
    .doc("user_33YOXPK1eZg2RdICusNLRB7XrEi")
    .collection("files")
    .doc(docId)
    .collection("chats")
    .orderBy("createdAt", "desc")
    .limit(6)
    .get();

    const chatHistory = chats.docs.map((doc)=>
      doc.data().role === 'human' ?
      new HumanMessage(doc.data().message):
      new AIMessage(doc.data().message)
    );

    return chatHistory;


}
//  Load and split PDF into text chunks
export async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadURL = firebaseRef.data()?.url;
  if (!downloadURL) throw new Error("File not found");

  const response = await fetch(downloadURL);

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer]);

  const loader = new PDFLoader(blob);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  return splitDocs;
}

// Check if namespace already exists
const namespaceExists = async (index: Index<RecordMetadata>, namespace: string) => {
  try {
    if (!namespace) throw new Error("Namespace is null");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
  } catch (error) {
    if (error instanceof PineconeConflictError) return false;
    throw error;
  }
};

// Generate embeddings for each doc chunk using Gemini
const generateEmbeddings = async (docs: {pageContent:string}[]) => {
  return await Promise.all(
    docs.slice(0, 10).map(async (doc: any, i: number) => {
      await delay(4000);
      const embedding = await generateEmbedding(doc.pageContent);
      return { doc, embedding };
    })
  );
};

// Generate embeddings & store them in Pinecone
export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");


  const index = pc.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log("Namespace already exists in Pinecone. Skipping upload.");
    return
    
  }

  // console.log(" Loading and splitting PDF...");
  const splitDocs = await generateDocs(docId);
  // console.log(` Split into ${splitDocs.length} chunks.`);

  // console.log(" Generating embeddings for all chunks...");
  const allEmbeddings = await generateEmbeddings(splitDocs);

  // Prepare data for Pinecone

  // type Item = {
  //   doc:{pageContent:string},
  //   embedding:number[]
  
  // };
  const vectors = allEmbeddings.map((item: any, idx: number) => ({
    id: `doc-${docId}-${idx}`,
    values: item.embedding,
    metadata: {
      text: item.doc.pageContent.slice(0, 1000),
      source: "pdf",
      docId,
      userId,
    },
  }));

  await index.namespace(docId).upsert(vectors);

  // console.log("Successfully stored embeddings in Pinecone!");
}

export async function generateLangchainCompletion(docId:string,question:string){


  const {userId} = await auth()
    if(!userId){
      throw new Error("User not authenticated")
    }
    const result = await embeddings.embedContent(question);
  const queryResponse = await index.namespace(docId).query({
    topK: 5,
    vector: result.embedding.values,
    includeMetadata: true,
  });

  const res = queryResponse.matches
  let text = ''
  // for(let i=0;i<res.length;i++){
  //   // console.log(res[i].metadata.text)
  //   if (res[i]) {
  //     text += res[i].metadata.text + ' ';
  //   }
  // }
  for (let i = 0; i < res.length; i++) {
  const textPart = res[i]?.metadata?.text;
  if (textPart) {
    text += textPart + " ";
  }
}

  const prompt = `Answer the question based on the context below.\n\nContext: ${text}\n\nQuestion: ${question}\n\nAnswer:`
  // model.
  try {
   const resp = await model.generateContent(prompt);

     
    const rawText = resp.response.text();
  
  
  
  
      return rawText
  } catch (error) {
    console.error("Error generating completion:", error);
    throw new Error("Failed to generate completion");
  }
  

   
}
