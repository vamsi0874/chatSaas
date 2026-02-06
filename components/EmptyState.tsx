import { FileText, Upload } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="p-6 bg-muted rounded-full mb-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No PDFs uploaded yet</h3>
      <p className="text-muted-foreground mb-6">
        Upload your first PDF to start chatting with AI
      </p>
      <Upload className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}
