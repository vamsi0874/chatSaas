export interface FileMetadata {
  id: string;
  name: string;
  url: string;
  uploadDate: Date;
  size: number;
  status: "processing" | "ready" | "error";
  userId: string;
}

export interface ChatMessage {
  // id: string;
  role: "human" | "ai";
  message: string;
  createdAt: Date;
}

export interface UploadResponse {
  fileId: string;
  url: string;
  status: string;
}

export interface ChatRequest {
  fileId: string;
  question: string;
  userId: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}
