"use client";

import { History, Calendar, CheckCircle2, XCircle, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const historyItems = [
    { id: "REP-001", model: "MacBook Air A1466", fault: "No Power / Short to Ground", status: "Success", date: "2025-12-28" },
    { id: "REP-002", model: "iPhone 13", fault: "No Charging", status: "Success", date: "2025-12-29" },
    { id: "REP-003", model: "Lenovo G50-45", fault: "No Display", status: "In Progress", date: "2025-12-30" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Repair History</h2>
        <p className="text-muted-foreground">Track your previous diagnostics and solutions.</p>
      </div>

      <div className="p-8 rounded-3xl bg-[#141417] border border-[#27272a]">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Filter by ticket ID or device..." 
              className="w-full bg-[#0a0a0c] border border-[#27272a] rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <button className="p-2 rounded-xl border border-[#27272a] bg-[#1c1c21]">
            <Calendar size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          {historyItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-[#0a0a0c]/50 border border-[#27272a] hover:border-blue-500/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <History size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                    <h4 className="font-semibold">{item.model}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.fault}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium">{item.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {item.status}
                  </span>
                </div>
                <button className="text-blue-500 text-sm hover:underline">Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
