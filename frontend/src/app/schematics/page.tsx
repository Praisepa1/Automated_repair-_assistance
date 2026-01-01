"use client";

import { FileText, Search, Database, HardDrive, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function SchematicsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Schematic Sync</h2>
        <p className="text-muted-foreground">Manage and synchronize schematic PDF database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a]">
          <HardDrive className="text-blue-500 mb-4" size={24} />
          <h3 className="font-semibold mb-1">Local Storage</h3>
          <p className="text-2xl font-bold">1.2 GB <span className="text-sm font-normal text-muted-foreground">/ 10GB</span></p>
        </div>
        <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a]">
          <FileText className="text-green-500 mb-4" size={24} />
          <h3 className="font-semibold mb-1">Total Schematics</h3>
          <p className="text-2xl font-bold">154</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a]">
          <RefreshCw className="text-purple-500 mb-4" size={24} />
          <h3 className="font-semibold mb-1">Cloud Sync</h3>
          <p className="text-sm text-green-500 font-medium">Up to date</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-[#141417] border border-[#27272a]">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search schematics by model or board #..." 
              className="w-full bg-[#0a0a0c] border border-[#27272a] rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Upload New
          </button>
        </div>

        <div className="border border-[#27272a] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1c1c21] border-b border-[#27272a]">
              <tr>
                <th className="px-6 py-4 font-semibold">Model / Board Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {[
                { name: "iPhone 13 Pro Max", board: "820-00165", size: "4.2 MB" },
                { name: "MacBook Air A1466", board: "820-00165", size: "8.1 MB" },
                { name: "Lenovo ThinkPad X1", board: "NM-A311", size: "12.5 MB" },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.name} <span className="text-xs text-muted-foreground ml-2">({item.board})</span></td>
                  <td className="px-6 py-4 text-muted-foreground">Schematic PDF</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-500 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
