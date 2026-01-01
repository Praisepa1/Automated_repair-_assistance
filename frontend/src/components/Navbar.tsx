"use client";

import { Bell, User, Clock } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-[#1f1f23] bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">Diagnostic Workspace</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-green-500 font-bold">Engine Online</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          <span className="text-sm">Last Sync: Just now</span>
        </div>
        
        <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0c]" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-[#1f1f23]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Repair Tech</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Gold Level</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-white/10">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
