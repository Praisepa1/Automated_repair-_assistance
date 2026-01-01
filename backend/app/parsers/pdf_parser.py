from pypdf import PdfReader
import re
from typing import List, Dict

class PDFParser:
    @staticmethod
    def extract_text(pdf_path: str) -> str:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    @staticmethod
    def find_components(text: str) -> List[str]:
        # PQ = Transistor/MOSFET, PR = Resistor, PC = Capacitor, PD = Diode, PU = IC
        component_pattern = r'\b(P[QRCDU]\d+)\b'
        return list(set(re.findall(component_pattern, text)))

    @staticmethod
    def find_nets(text: str) -> List[str]:
        # Common net patterns: VIN, +5V, +3V, GND, VCORE, etc.
        net_pattern = r'\b([A-Z0-9_+]{3,})\b'
        # Filter for likely net names
        potential_nets = re.findall(net_pattern, text)
        return list(set([n for n in potential_nets if any(c.isdigit() or '+' in n or 'V' in n for c in n)]))

    def parse_schematic(self, pdf_path: str) -> Dict:
        text = self.extract_text(pdf_path)
        return {
            "components": self.find_components(text),
            "nets": self.find_nets(text),
            "metadata": {"source": pdf_path}
        }
