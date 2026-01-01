"use client";

import { AlertTriangle, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  measure: string;
  expected: string;
}

interface RepairGuideProps {
  data: {
    fault: string;
    steps: (string | Step)[];
    warnings?: string[];
    likely_faulty?: string[];
  };
}

export function RepairGuide({ data }: RepairGuideProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">{data.fault}</h3>
            <p className="text-sm text-blue-400">Diagnosis Sequence Generated</p>
          </div>
        </div>

        {data.likely_faulty && data.likely_faulty.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-[#0a0a0c]/50 border border-white/5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">Likely Faulty Components</p>
            <div className="flex flex-wrap gap-2">
              {data.likely_faulty.map((comp) => (
                <span key={comp} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-mono rounded-lg">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Info size={18} className="text-blue-500" />
          Step-by-Step Guidance
        </h4>
        <div className="space-y-3">
          {data.steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#141417] border border-[#27272a] hover:border-blue-500/30 transition-all group">
              <div className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                {typeof step === 'string' ? (
                  <p className="text-sm text-white/90 leading-relaxed">{step}</p>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Action</p>
                      <p className="text-sm font-medium">{step.measure}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Expected</p>
                      <p className="text-sm font-mono text-green-500">{step.expected}</p>
                    </div>
                  </div>
                )}
              </div>
              <ArrowRight size={14} className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {data.warnings && (
        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <AlertTriangle size={18} />
            <h4 className="text-sm font-bold uppercase tracking-tight">Safety Protocol</h4>
          </div>
          <ul className="space-y-2">
            {data.warnings.map((warning, i) => (
              <li key={i} className="text-xs text-orange-200/70 leading-relaxed flex gap-2">
                <span className="text-orange-500">•</span> {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
