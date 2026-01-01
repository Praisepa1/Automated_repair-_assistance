"use client";

import { BoardViewer } from "@/components/BoardViewer";
import { 
  Search, 
  Layers, 
  Info, 
  Cpu, 
  Settings2,
  Terminal,
  Activity
} from "lucide-react";

export default function ViewerPage() {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advanced Board Viewer</h2>
          <p className="text-sm text-muted-foreground">Interactive 2.5D board layout visualization.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#141417] border border-[#27272a] rounded-xl p-1">
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
               Top Layer
             </button>
             <button className="px-4 py-2 hover:bg-white/5 text-muted-foreground rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
               Bottom Layer
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 min-h-[500px]">
          <BoardViewer />
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
           <section className="p-5 rounded-2xl bg-[#141417] border border-[#27272a]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Settings2 size={16} className="text-blue-500" />
                View Layers
              </h3>
              <div className="space-y-3">
                 {[
                   { name: "Silk Screen", checked: true },
                   { name: "Copper Trace", checked: true },
                   { name: "Components", checked: true },
                   { name: "Via Holes", checked: false },
                   { name: "Net Labels", checked: true },
                 ].map((layer) => (
                   <label key={layer.name} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm group-hover:text-white transition-colors">{layer.name}</span>
                      <input type="checkbox" defaultChecked={layer.checked} className="w-4 h-4 rounded border-[#27272a] bg-[#0a0a0c] text-blue-600 focus:ring-blue-500/50" />
                   </label>
                 ))}
              </div>
           </section>

           <section className="p-5 rounded-2xl bg-[#141417] border border-[#27272a]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Terminal size={16} className="text-green-500" />
                Component Registry
              </h3>
              <div className="space-y-4">
                 <div className="p-3 rounded-xl bg-[#0a0a0c] border border-[#27272a] hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-blue-500">PU1</span>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-[10px] text-blue-500 rounded uppercase">IC</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">ChargerController_ISL95833</p>
                 </div>
                 <div className="p-3 rounded-xl bg-[#0a0a0c] border border-[#27272a] hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-blue-500">PQ1</span>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-[10px] text-blue-500 rounded uppercase">FET</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">High_Side_MOSFET</p>
                 </div>
              </div>
           </section>

           <section className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-blue-500" />
                <h3 className="text-sm font-bold">Trace Status</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Click any pin or net in the viewer to trace its path across the PCB layers.
              </p>
           </section>
        </div>
      </div>
    </div>
  );
}
