"use client";

import { ShieldAlert, AlertTriangle, Lightbulb, Thermometer, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SafetyPage() {
  const safetyRules = [
    { 
      title: "Voltage Injection Precaution", 
      icon: Zap, 
      color: "text-blue-500", 
      content: "Never exceed 1.0V when injecting into CPU/VCORE rails. Use a current-limited DC power supply set to 2A maximum initially." 
    },
    { 
      title: "Thermal Runaway", 
      icon: Thermometer, 
      color: "text-red-500", 
      content: "Stop power immediately if a component reaches >80°C unless performing a thermal camera check. Excessive heat can delaminate PCB layers." 
    },
    { 
      title: "ESD Awareness", 
      icon: ShieldAlert, 
      color: "text-purple-500", 
      content: "Always use an anti-static wrist strap when handling exposed motherboards. MOSFETs and ICs are highly sensitive to static discharge." 
    },
    { 
      title: "Protection Bypass", 
      icon: AlertTriangle, 
      color: "text-orange-500", 
      content: "When bypassing a fuse (F) or protection MOSFET for diagnosis, ensure no short remains on the sub-rail. Bypassing a short can cause fire hazard." 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-orange-600/10 text-orange-500 border border-orange-500/20 mb-2">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight">Safety & Protocols</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Electrical repair is dangerous. Follow these industry-standard protocols to protect yourself and the hardware.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        {safetyRules.map((rule, i) => (
          <motion.div 
            key={rule.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-[#141417] border border-[#27272a] hover:border-blue-500/30 transition-all flex flex-col gap-4"
          >
            <div className={`p-4 rounded-2xl bg-[#0a0a0c] w-fit border border-white/5 ${rule.color}`}>
              <rule.icon size={28} />
            </div>
            <h3 className="text-xl font-bold">{rule.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {rule.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20 shrink-0">
             <Lightbulb size={24} />
           </div>
           <div>
             <h4 className="text-lg font-bold mb-2 text-white">Pro Tip: Component Isolation</h4>
             <p className="text-sm text-blue-200/70 leading-relaxed">
               If a short is suspected on a main power rail, remove the series inductors (coils) to isolate which side of the circuit (source vs consumer) is faulted. This prevents unnecessary component replacement.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
