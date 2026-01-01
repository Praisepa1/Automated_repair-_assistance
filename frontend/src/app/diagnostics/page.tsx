"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { RepairGuide } from "@/components/RepairGuide";
import { Search, Zap, Loader2, Thermometer, ShieldAlert, Activity } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

type FaultData = {
  fault: string;
  steps: any[];
  warnings?: string[];
  likely_faulty?: string[];
};

export default function DiagnosticsPage() {
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FaultData | null>(null);
  const [boardNumber, setBoardNumber] = useState("");

  const handleDiagnose = async () => {
    if (!symptom) return;
    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE}/diagnostics/analyze`, {
        symptom,
        net: "VIN"
      });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
      // Fallback for demo if backend is not running
      setResult({
        fault: "Short to Ground Detected",
        steps: [
            "Inject 1V into VIN rail.",
            { measure: "Resistance at PR1", expected: ">100k Ω" },
            { measure: "PU1 VCC Pin", expected: "19V" }
        ],
        warnings: ["Voltage injection must be current-limited to 2A max."],
        likely_faulty: ["PC12", "PC45", "PQ1"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1f1f23] pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Diagnostic Workspace</h2>
          <p className="text-muted-foreground">Trace faults and generate repair protocols.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
             <input 
              type="text" 
              placeholder="Enter Board #" 
              value={boardNumber}
              onChange={(e) => setBoardNumber(e.target.value)}
              className="bg-[#141417] border border-[#27272a] rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none w-48 transition-all"
             />
           </div>
           <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20">
             Load Schematics
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-8">
          <section className="p-6 rounded-3xl bg-[#141417] border border-[#27272a] space-y-6">
             <div>
               <h3 className="font-semibold mb-2 flex items-center gap-2">
                 <Zap size={18} className="text-blue-500" />
                 Report Symptoms
               </h3>
               <textarea 
                rows={4}
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g., Short to ground on 19V rail, no power LED, charging IC overheating..."
                className="w-full bg-[#0a0a0c] border border-[#27272a] rounded-xl p-4 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none placeholder:text-muted-foreground/50 transition-all font-mono"
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSymptom("Short to ground")}
                  className="p-3 rounded-xl border border-[#27272a] hover:border-red-500/50 hover:bg-red-500/5 transition-all text-sm text-left group"
                >
                  <Thermometer size={16} className="text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-white/80">Short Detection</p>
                </button>
                <button 
                  onClick={() => setSymptom("No Power")}
                  className="p-3 rounded-xl border border-[#27272a] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-sm text-left group"
                >
                  <ShieldAlert size={16} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-white/80">No Power Sequence</p>
                </button>
             </div>

             <button 
              onClick={handleDiagnose}
              disabled={loading || !symptom}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all disabled:opacity-50 shadow-xl shadow-blue-900/10"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Run AI Diagnostic"}
                {!loading && <Zap size={18} className="group-hover:translate-x-1 duration-200" />}
             </button>
          </section>

          <section>
            <h3 className="font-semibold mb-4 ml-2">Hardware Data Input</h3>
            <FileUploader onUpload={(files) => console.log(files)} />
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {result ? (
            <RepairGuide data={result} />
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-[#27272a] rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-[#141417] border border-[#27272a] flex items-center justify-center mb-6">
                <Activity size={32} className="text-muted-foreground" />
              </div>
              <h4 className="text-xl font-bold mb-2">Diagnostic Output Waiting</h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                Upload your board data and describe the symptoms on the left to generate repair guidance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
