"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, MousePointer2, Move, Maximize, RefreshCw } from "lucide-react";

interface Component {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

export function BoardViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);

  // Mock data for initial render
  const components: Component[] = [
    { id: "1", name: "PU1", x: 100, y: 100, width: 40, height: 40, type: "IC" },
    { id: "2", name: "PQ1", x: 200, y: 150, width: 20, height: 15, type: "MOSFET" },
    { id: "3", name: "PR1", x: 230, y: 150, width: 10, height: 20, type: "RESISTOR" },
    { id: "4", name: "PC1", x: 200, y: 200, width: 15, height: 25, type: "CAPACITOR" },
    { id: "5", name: "PQ2", x: 300, y: 100, width: 20, height: 15, type: "MOSFET" },
  ];

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
  }, [zoom, offset, hoveredComp]);

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

      <div className="absolute top-6 right-6 flex flex-col gap-2">
        <div className="bg-[#141417]/80 backdrop-blur-md border border-[#27272a] rounded-xl p-4 shadow-2xl min-w-[150px]">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-3">Viewer Stats</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Components:</span>
              <span className="font-mono text-blue-500">{components.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active Net:</span>
              <span className="font-mono text-green-500">VIN</span>
            </div>
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
