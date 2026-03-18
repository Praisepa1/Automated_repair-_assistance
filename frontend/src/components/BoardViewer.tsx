"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ZoomIn, ZoomOut, MousePointer2, Move, Maximize, RefreshCw } from "lucide-react";

interface Component {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  net?: string;
}

export function BoardViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [traceProblem, setTraceProblem] = useState<string | null>(null);
  const boardNumber = searchParams.get("board");

  useEffect(() => {
    if (boardNumber) {
      fetch(`http://localhost:8000/api/diagnostics/boardview/${boardNumber}`)
        .then(res => res.json())
        .then(data => {
            setComponents(data.components || [])
            setTraceProblem(data.trace_problem || null)
        })
        .catch(console.error);
    } else {
      // Mock data if no board is selected
      setComponents([
        { id: "1", name: "PU1", x: 100, y: 100, width: 40, height: 40, type: "IC", net: "VIN" },
        { id: "2", name: "PQ1", x: 200, y: 150, width: 20, height: 15, type: "MOSFET", net: "VCORE" },
      ]);
    }
  }, [boardNumber]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
      ctx.scale(zoom, zoom);

      // Draw Grid
      ctx.strokeStyle = "#1f1f23";
      ctx.lineWidth = 1 / zoom;
      const gridSize = 50;
      for (let x = -1000; x < 1000; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -1000);
        ctx.lineTo(x, 1000);
        ctx.stroke();
      }
      for (let y = -1000; y < 1000; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-1000, y);
        ctx.lineTo(1000, y);
        ctx.stroke();
      }

      // Draw trace pathway if a problem exists
      if (traceProblem && components.length >= 2) {
        ctx.beginPath();
        // Trace line from first component to last
        const p1 = components[0];
        const p2 = components[components.length - 1];
        ctx.moveTo(p1.x + p1.width / 2, p1.y + p1.height / 2);
        
        if (components.length > 2) {
           const mid = components[Math.floor(components.length / 2)];
           ctx.lineTo(mid.x + mid.width / 2, mid.y + mid.height / 2);
        }
        
        ctx.lineTo(p2.x + p2.width / 2, p2.y + p2.height / 2);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)"; // glowing red trace
        ctx.lineWidth = 3 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(239, 68, 68, 0.8)";
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      }

      // Draw Components
      components.forEach((comp) => {
        const isHovered = hoveredComp === comp.name;
        
        ctx.fillStyle = isHovered ? "#3b82f6" : "#27272a";
        ctx.strokeStyle = isHovered ? "#60a5fa" : "#3f3f46";
        ctx.lineWidth = 2 / zoom;

        // Shadow/Glow if hovered
        if (isHovered) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(59, 130, 246, 0.5)";
        }

        // Main body
        ctx.beginPath();
        ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 2 / zoom);
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = isHovered ? "white" : "#94a3b8";
        ctx.font = `${Math.max(10 / zoom, 8)}px Inter`;
        ctx.fillText(comp.name, comp.x, comp.y - 5);
      });

      ctx.restore();
    };

    draw();
  }, [zoom, offset, hoveredComp, traceProblem, components]);

  return (
    <div className="relative w-full h-[600px] bg-[#0e0e11] rounded-3xl border border-[#27272a] overflow-hidden group">
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-crosshair"
        onMouseMove={(e) => {
          // Simplified hit testing
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          const mouseX = (e.clientX - rect.left - rect.width / 2 - offset.x) / zoom;
          const mouseY = (e.clientY - rect.top - rect.height / 2 - offset.y) / zoom;
          
          const found = components.find(c => 
            mouseX >= c.x && mouseX <= c.x + c.width &&
            mouseY >= c.y && mouseY <= c.y + c.height
          );
          setHoveredComp(found ? found.name : null);
        }}
      />

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <div className="flex bg-[#141417]/80 backdrop-blur-md border border-[#27272a] rounded-xl p-1 shadow-2xl">
          <button onClick={() => setZoom(z => z * 1.2)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white"><ZoomIn size={18} /></button>
          <button onClick={() => setZoom(z => z / 1.2)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white border-l border-[#27272a]"><ZoomOut size={18} /></button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white border-l border-[#27272a]"><Maximize size={18} /></button>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex flex-col gap-2 max-w-xs">
        <div className="bg-[#141417]/80 backdrop-blur-md border border-[#27272a] rounded-xl p-4 shadow-2xl">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-3">Viewer Stats</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs mb-4">
              <span className="text-muted-foreground">Components:</span>
              <span className="font-mono text-blue-500">{components.length}</span>
            </div>
            {traceProblem && (
               <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                 <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Trace Solution</p>
                 <p className="text-xs text-red-200">{traceProblem}</p>
                 <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1 group">
                    <RefreshCw size={10} className="animate-spin" />
                    Tracing Pathway...
                 </p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Component Detail Popup */}
      {hoveredComp && (
        <div className="absolute top-6 left-6 pointer-events-none">
          <div className="bg-blue-600 p-4 rounded-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-left-4 duration-200">
            <h4 className="text-white font-bold flex items-center gap-2">
              <MousePointer2 size={16} /> {hoveredComp}
            </h4>
            <p className="text-xs text-blue-100 mt-1">Status: Operational</p>
            <div className="mt-2 text-[10px] text-blue-200/70">
              Pins: 1, 2, 3, 4<br/>
              Net: +19V_VIN
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
