"use client";

import { useState, useRef } from "react";
import { Upload, X, File, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      onUpload([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFileChange({ target: { files: e.dataTransfer.files } } as any); }}
        className={clsx(
          "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-500/5" : "border-[#27272a] hover:border-blue-500/30 bg-[#0e0e11]"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4">
          <Upload size={24} />
        </div>
        <h3 className="font-semibold mb-1">Upload Schematic or BoardView</h3>
        <p className="text-sm text-muted-foreground mb-4">Support for .pdf, .brd, .cad, .zip, .rar</p>
        <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
          Select Files
        </button>
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept=".pdf,.brd,.cad,.bdv,.zip,.rar"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#141417] border border-[#27272a]">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <File size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div className="pt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Finish Upload & Parse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
