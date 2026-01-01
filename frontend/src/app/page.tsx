"use client";

import { motion } from "framer-motion";
import { 
  FileUp, 
  Activity, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Files Analyzed", value: "0", icon: FileUp, trend: "+12%" },
  { label: "Successful Repairs", value: "0", icon: ShieldCheck, trend: "+5%" },
  { label: "Active Diagnostics", value: "0", icon: Activity, trend: "0%" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5"
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Ready to <span className="gradient-text">Diagnose?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Upload your schematics and boardview files to get started. Our AI-powered engine will trace connections and suggest repair paths in seconds.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/diagnostics"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20"
              >
                Start New Diagnostic <ArrowRight size={18} />
              </Link>
              <button className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-white/10 transition-all font-medium">
                View Documentation
              </button>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 pointer-events-none">
            <Cpu size={300} strokeWidth={1} className="text-blue-500" />
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[#141417] border border-[#27272a] group hover:border-blue-500/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-xs font-mono">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </section>

      {/* Features Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-[#141417] border border-[#27272a] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Automated Tracing</h3>
            <p className="text-muted-foreground mb-6">Trace VIN, VCORE, and +BATT rails automatically across complex motherboards. Identify shorts in milliseconds.</p>
          </div>
          <div className="w-full h-48 rounded-xl bg-blue-950/20 border border-blue-500/10 flex items-center justify-center p-4">
            {/* Simple Graphic Placeholder */}
            <div className="relative w-full h-full">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
               <div className="flex flex-col gap-2 relative z-10">
                 <div className="h-2 w-3/4 bg-blue-500/20 rounded animate-pulse" />
                 <div className="h-2 w-1/2 bg-blue-500/30 rounded animate-pulse delay-75" />
                 <div className="h-2 w-2/3 bg-blue-500/10 rounded animate-pulse delay-150" />
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-6 rounded-2xl border border-[#27272a] bg-[#141417] flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
                <HelpCircle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Need Help?</h4>
                <p className="text-xs text-muted-foreground">Check out our repair guides and safety procedures.</p>
              </div>
              <button className="text-xs text-blue-500 hover:underline">View All</button>
           </div>
           
           <div className="p-6 rounded-2xl border border-[#27272a] bg-[#141417] flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <Activity size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Recent Activity</h4>
                <p className="text-xs text-muted-foreground">No recent diagnostics found. Start one now!</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
