from typing import List, Dict, Optional
from app.engine.graph_builder import GraphBuilder

class DiagnosticLogic:
    def __init__(self, graph_builder: GraphBuilder):
        self.gb = graph_builder

    def analyze_short_to_ground(self, net_name: str) -> Dict:
        """
        Analyzes a net for potential components causing a short to ground.
        Usually high-capacity ceramic capacitors (PC) or MOSFETs (PQ).
        """
        components = self.gb.get_net_components(net_name)
        
        # Categorize by likelihood
        high_risk = [c for c in components if c.startswith('PC') or (c.startswith('PQ') and 'GND' in self.gb.get_neighbors(c))]
        medium_risk = [c for c in components if c.startswith('PU') or c.startswith('PD')]
        
        return {
            "fault": "Short to Ground",
            "net": net_name,
            "likely_faulty": high_risk,
            "secondary_check": medium_risk,
            "steps": [
                f"Inject 1V (max 2A) into {net_name} and check for thermal hotspots using IPA or thermal camera.",
                f"Check resistance to ground on {net_name}. Expected: >100k Ohms (varies by rail).",
                f"Isolate components: {', '.join(high_risk[:3])}..."
            ],
            "warnings": [
                "DO NOT exceed the nominal rail voltage during injection.",
                "Ensure battery and charger are disconnected before measuring resistance."
            ]
        }

    def analyze_no_power(self) -> Dict:
        """
        Basic VIN/Power-in sequence analysis.
        """
        return {
            "fault": "No Power / No LED",
            "diagnostic_path": ["VIN", "+B / VCC_MAIN", "3.3V LDO", "5V LDO"],
            "steps": [
                {"measure": "DC Jack / USB-C Fuse", "expected": "19V - 20V"},
                {"measure": "First MOSFET (PQ) Drain", "expected": "19V"},
                {"measure": "Current Sense Resistor (PR)", "expected": "19V"},
                {"measure": "3.3V Always-on Coil", "expected": "3.3V"}
            ],
            "logic": "If VIN is present but +B is missing, check the charging IC (PU) and input MOSFETs."
        }

    def get_repair_solution(self, symptom: str, data: Optional[Dict] = None) -> Dict:
        if "short" in symptom.lower():
            net = data.get("net", "VIN") if data else "VIN"
            return self.analyze_short_to_ground(net)
        elif "no power" in symptom.lower():
            return self.analyze_no_power()
        else:
            return {
                "error": "Symptom not yet supported by auto-trace.",
                "suggestion": "Measure all main coils and check for shorts to ground manually."
            }
