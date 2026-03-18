"use client";

import { Bell, User, Clock, Menu } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="h-auto min-h-16 py-3 border-b border-[#1f1f23] bg-[#0a0a0c]/80 backdrop-blur-md flex flex-wrap items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start mb-2 md:mb-0">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-muted-foreground hover:text-white rounded-md hover:bg-white/5">
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-white truncate max-w-[150px] md:max-w-none">Diagnostic Workspace</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-green-500 font-bold hidden sm:inline">Engine Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 justify-between w-full md:w-auto border-t md:border-t-0 border-[#1f1f23] pt-2 md:pt-0">
        <div className="flex items-center gap-2 text-muted-foreground hidden sm:flex">
          <Clock size={16} />
          <span className="text-xs md:text-sm">Just now</span>
        </div>
        
        <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0c]" />
        </button>

        <Link href="/profile" className="flex items-center gap-3 pl-4 md:pl-6 border-l border-[#1f1f23] hover:opacity-80 transition-opacity cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Repair Tech</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Gold Level</p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-white/10 shrink-0">
            <User size={18} className="text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
