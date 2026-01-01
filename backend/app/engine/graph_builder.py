import networkx as nx
from typing import List, Dict

class GraphBuilder:
    def __init__(self):
        self.graph = nx.Graph()

    def build_from_data(self, components: List[str], nets: List[str], connections: List[Dict]):
        """
        connections: [{"component": "PQ1", "pin": 1, "net": "VIN"}]
        """
        # Nodes can be components or nets
        for comp in components:
            self.graph.add_node(comp, type="component")
            
        for net in nets:
            self.graph.add_node(net, type="net")
            
        for conn in connections:
            self.graph.add_edge(conn["component"], conn["net"], pin=conn.get("pin"))

    def find_path(self, start_node: str, end_node: str):
        try:
            return nx.shortest_path(self.graph, start_node, end_node)
        except nx.NetworkXNoPath:
            return None

    def get_neighbors(self, node: str):
        if node in self.graph:
            return list(self.graph.neighbors(node))
        return []

    def get_net_components(self, net_name: str):
        """Returns all components connected to a specific net"""
        if net_name in self.graph:
            return [n for n in self.graph.neighbors(net_name) if self.graph.nodes[n].get("type") == "component"]
        return []
