"use client";

import { FileText, Search, HardDrive, RefreshCw, UploadCloud } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SchematicsPage() {
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("http://localhost:8000/api/files/sync", { method: "POST" });
      if (res.ok) alert("Synchronized local schematics with cloud database successfully!");
    } catch (e) {
      alert("Sync failed.");
    }
    setSyncing(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'brd', 'cad', 'zip', 'rar'].includes(ext || '')) {
      alert("Unsupported file type. Please upload .pdf, .brd, .cad, .zip, or .rar");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Upload success! Saved to Cloud DB: ${data.cloud_url}`);
      } else {
        alert("Upload failed: " + data.detail);
      }
    } catch (err) {
      alert("Upload error.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Schematic Sync</h2>
        <p className="text-muted-foreground">Manage and synchronize schematic PDF database with the cloud.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Local Storage</CardTitle>
            <HardDrive className="text-blue-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 GB</div>
            <p className="text-xs text-muted-foreground">/ 10GB limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Schematics</CardTitle>
            <FileText className="text-green-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">154</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cloud Sync</CardTitle>
            <RefreshCw className={`text-purple-500 ${syncing ? 'animate-spin' : ''}`} size={20} />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSync}
              disabled={syncing}
              variant="secondary"
              className="w-full mt-2"
            >
              {syncing ? "Syncing..." : "Sync to Cloud DB"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              type="text" 
              placeholder="Search schematics by model or board #..." 
              className="pl-10"
            />
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              accept=".pdf,.brd,.cad,.zip,.rar"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <UploadCloud size={16} />
              {uploading ? "Uploading..." : "Upload Schematic"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model / Board Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "iPhone 13 Pro Max", board: "820-00165", type: ".pdf" },
                { name: "Lenovo ThinkPad X1", board: "NM-A311", type: ".brd" },
              ].map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.name} <span className="text-xs text-muted-foreground ml-2">({item.board})</span></TableCell>
                  <TableCell className="text-muted-foreground">{item.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" className="text-blue-500 p-0 h-auto">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
