
"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { ChatMessage } from "@/types";
import { askQuestion } from "@/lib/actions";
import { useCollection } from "react-firebase-hooks/firestore";
interface ChatProps {
  fileId: string;
}

export function Chat({ fileId }: ChatProps) {

  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!user) return;

  //   const chatsRef = collection(db, "users", user.id, "files", fileId, "chats");
  //   const q = query(chatsRef, orderBy("createdAt", "asc"));

  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const chatsData = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       createdAt: doc.data().createdAt?.toDate(),
  //     })) as ChatMessage[];

  //     setMessages(chatsData);
  //   });

  //   return () => unsubscribe();
  // }, [user, fileId]);
  const [snapshot, error] = useCollection(
  user && fileId
    ? query(
        collection(db, "users", user.id, "files", fileId, "chats"),
        orderBy("createdAt", "asc")
      )
    : undefined
);

  useEffect(()=>{
    if(!snapshot) return
    const lastMessage = messages.pop()

    if(lastMessage?.role ==="ai" && lastMessage.message==="thinking..."){
      return
    }

    const newMessages = snapshot.docs.map(doc =>{
     const {role,message,createdAt} = doc.data()
     return {
      id:doc.id,
      role,
      message,
      createdAt
    }
    })
    setMessages(newMessages)
  },[snapshot])
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // const handleSend = async () => {
  //   if (!input.trim() || !user || loading) return;

  //   const question = input.trim();
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const chatsRef = collection(db, "users", user.id, "files", fileId, "chats");
  //     await addDoc(chatsRef, {
  //       role: "human",
  //       message: question,
  //       createdAt: serverTimestamp(),
  //     });
      
  //     setMessages((prev)=>{
  //     return [...prev,{role:"human",message:question,createdAt:new Date()},{role:"ai",message:"thinking...",createdAt:new Date()}]
  //   })

     
  //     startTransition(async()=>{

  //     const {success, message} = await askQuestion(fileId,question);

  //     if(!success){

  //       setMessages((prev)=>
  //         prev.slice(0,prev.length-1).concat([
  //           {role:"ai",
  //             message:"oops, something went wrong",createdAt:new Date()
  //           }
  //         ])
  //       )
  //     }
  //   })  

  //   } catch (error) {
  //     console.error("Chat error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSend = async () => {
  if (!input.trim() || !user || loading) return;

  const question = input.trim();
  setInput("");
  setLoading(true);

  try {

     setMessages((prev)=>{
      return [...prev,{role:"human",message:question,createdAt:new Date()},{role:"ai",message:"thinking...",createdAt:new Date()}]
    })


    startTransition(async () => {
      const { success, message } = await askQuestion(fileId, question);

      if (!success) {
   
        setMessages((prev)=>
          prev.slice(0,prev.length-1).concat([
            {role:"ai",
              message:"oops, something went wrong",createdAt:new Date()
            }
          ])
        )
      }
    });
  } catch (error) {
    console.error("Chat error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" >
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Ask a question about your PDF to get started</p>
          </div>
        ) : (
          messages.map((msg,idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  msg.role === "human"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </Card>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-muted">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </Card>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question about your PDF..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
