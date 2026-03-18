"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Cpu,
  FileText,
  History,
  Settings,
  ShieldAlert,
  Search,
  Zap,
  X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Diagnostic Engine", href: "/diagnostics", icon: Zap },
  { name: "Board Viewer", href: "/viewer", icon: Cpu },
  { name: "Schematic Sync", href: "/schematics", icon: FileText },
  { name: "Repair History", href: "/history", icon: History },
  { name: "Safety Guides", href: "/safety", icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (search.trim() !== '') {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/files/download/${search}`);
        if (res.ok) {
          router.push(`/viewer?board=${search}`);
        } else {
          alert("Board not found on the web.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') performSearch();
  };

  return (
    <div className="w-64 h-full bg-[#0e0e11] border-r border-[#1f1f23] flex flex-col fixed left-0 top-0 z-50 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Antigravity<span className="text-blue-500">Fix</span></span>
          </Link>
          <button className="md:hidden text-muted-foreground hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 space-y-3"> {/* Added mb-6 and space-y-3 for spacing */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={16} />
            <Input
              type="text"
              placeholder="Search Board Number (e.g., 820-00165)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown} // Added onKeyDown back for convenience
              disabled={loading}
              className="w-full py-6 pl-10 pr-4"
            />
          </div>

          <Button
            type="submit"
            onClick={performSearch} // Trigger search on button click
            disabled={loading}
            className="w-full h-12 rounded-xl text-sm font-medium"
          >
            {loading ? "Initializing Diagnostic Web Search..." : "Load Schematic / Boardview"}
          </Button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                  isActive
                    ? "bg-blue-600/10 text-blue-500 font-medium"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-blue-500" : "group-hover:text-white")} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#1f1f23]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </div>
  );
}
