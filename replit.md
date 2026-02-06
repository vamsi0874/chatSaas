# PDF Chat SaaS

## Overview

A SaaS application that allows users to upload PDF documents and interact with them through an AI-powered chat interface. Users can ask questions about their PDFs and receive context-aware answers extracted from the document content. The application combines document storage, vector embeddings, and conversational AI to create an intelligent document Q&A experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router and TypeScript
- Server and client components separation for optimal rendering
- File-based routing with dynamic routes for individual file pages (`/file/[id]`)
- Protected routes using middleware pattern for authenticated pages

**UI Component System**: 
- Tailwind CSS for utility-first styling with custom theme configuration
- Shadcn UI components for consistent design system (Button, Card, Input)
- Framer Motion for entrance animations and transitions
- React PDF for client-side PDF rendering and pagination
- React Dropzone for drag-and-drop file upload interface

**State Management**:
- React hooks (useState, useEffect) for local component state
- Real-time subscriptions using Firebase Firestore's onSnapshot
- Clerk hooks (useUser) for authentication state

### Backend Architecture

**API Routes**: Next.js API routes in `/api` directory
- `/api/upload` - Handles PDF upload, blob storage, text extraction, and embedding generation
- `/api/chat` - Processes user questions and retrieves context-aware answers

**Authentication & Authorization**:
- Clerk for complete auth solution (sign-in, sign-up, session management)
- Server-side auth checks using Clerk's auth() helper
- Middleware-based route protection for `/dashboard`, `/file/*`, and API routes
- User-scoped data access enforced at database query level

**File Storage Strategy**:
- Vercel Blob for PDF file storage with public access URLs
- 10MB file size limit enforced at API level
- PDF-only file type validation

**AI/ML Pipeline**:
- LangChain framework for orchestrating AI workflows
- Flexible embedding provider: Google Generative AI (Gemini) or OpenAI
- Flexible chat model: Gemini Pro or GPT-3.5 Turbo
- PDF text extraction using pdf-parse library
- Document chunking and vectorization for semantic search
- Pinecone vector database for storing and querying embeddings
- Context retrieval using similarity search
- Prompt engineering with ChatPromptTemplate for context-aware responses

**Data Flow**:
1. User uploads PDF → Stored in Vercel Blob
2. PDF text extracted → Chunked into documents
3. Documents converted to embeddings → Stored in Pinecone with fileId namespace
4. User asks question → Query converted to embedding → Similar chunks retrieved
5. Retrieved context + question → LLM generates answer → Stored in Firestore chat history

### Database Architecture

**Firebase Firestore** (NoSQL document database):

**Schema Structure**:
```
users/{userId}/
  files/{fileId}
    - id: string
    - name: string
    - blobUrl: string
    - uploadDate: timestamp
    - size: number
    - status: "processing" | "ready" | "error"
    - userId: string
    
    chats/{chatId}
      - id: string
      - role: "human" | "ai"
      - message: string
      - createdAt: timestamp
```

**Design Decisions**:
- User-scoped collections for data isolation and security
- Subcollections for chat history to maintain document hierarchy
- Real-time listeners for instant UI updates
- Server timestamps for consistent time tracking

### External Dependencies

**Authentication**: 
- Clerk - Complete authentication and user management
- Provides UserButton component, sign-in/sign-up flows, and session handling

**Cloud Services**:
- Vercel Blob - PDF file storage with CDN delivery
- Firebase Firestore - Real-time NoSQL database for metadata and chat history
- Pinecone - Vector database for semantic search and embeddings storage

**AI Services** (configurable):
- Google Generative AI (Gemini) - Embeddings (embedding-001) and chat (gemini-pro)
- OpenAI - Alternative for embeddings and chat (GPT-3.5 Turbo)

**Document Processing**:
- pdf-parse - Server-side PDF text extraction
- react-pdf (pdfjs) - Client-side PDF rendering

**Environment Variables Required**:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob access
- `FIREBASE_*` - Firebase project configuration
- `PINECONE_API_KEY` - Vector database access
- `GOOGLE_API_KEY` or `OPENAI_API_KEY` - AI model access
- Clerk keys auto-managed in development (keyless mode)