"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Cpu, 
  FileText, 
  History, 
  Settings, 
  ShieldAlert,
  Search,
  Zap
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

  return (
    <div className="w-64 h-full bg-[#0e0e11] border-r border-[#1f1f23] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Cpu size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Antigravity<span className="text-blue-500">Fix</span></span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search board #..." 
            className="w-full bg-[#18181b] border border-[#27272a] rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
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
