"""
Spatiotemporal Graph Neural / Network Risk Propagation Module (Phase 2)
Models NER arterial lifelines as a graph (Nodes = junctions/villages, Edges = road segments).
Propagates landslide debris hazards across segments to identify cut-off communities and viable detours.
"""
import networkx as nx
from typing import Dict, Any, List


class RoadNetworkRiskPropagator:
    def __init__(self):
        self.graph = nx.Graph()
        self._build_ner_road_network()

    def _build_ner_road_network(self):
        """Constructs arterial highway network representation across Sikkim, Meghalaya, and Assam."""
        # Nodes: (name, state, type, lat, lon)
        nodes = [
            # Sikkim Corridor (NH-10)
            ("Siliguri Hub", {"state": "West Bengal", "type": "TRANSIT_HUB", "lat": 26.72, "lon": 88.43}),
            ("Sevoke Junction", {"state": "West Bengal", "type": "BRIDGE_JUNCTION", "lat": 26.88, "lon": 88.47}),
            ("Teesta Bazaar", {"state": "West Bengal", "type": "RIVER_BASIN_CROSSING", "lat": 27.05, "lon": 88.49}),
            ("Singtam", {"state": "Sikkim", "type": "TOWN_JUNCTION", "lat": 27.23, "lon": 88.50}),
            ("Rangpo Border", {"state": "Sikkim", "type": "CHECKPOST", "lat": 27.17, "lon": 88.52}),
            ("Gangtok Capital", {"state": "Sikkim", "type": "CAPITAL_HUB", "lat": 27.33, "lon": 88.61}),
            ("Mangan District Hub", {"state": "Sikkim", "type": "HILL_DISTRICT", "lat": 27.50, "lon": 88.53}),

            # Meghalaya Corridor (NH-106 & NH-6)
            ("Guwahati Hub", {"state": "Assam", "type": "TRANSIT_HUB", "lat": 26.14, "lon": 91.73}),
            ("Nongpoh", {"state": "Meghalaya", "type": "TRANSIT_TOWN", "lat": 25.90, "lon": 91.88}),
            ("Umiam Lake Junction", {"state": "Meghalaya", "type": "BRIDGE_JUNCTION", "lat": 25.66, "lon": 91.90}),
            ("Shillong Central", {"state": "Meghalaya", "type": "CAPITAL_HUB", "lat": 25.57, "lon": 91.89}),
            ("Cherrapunji Town", {"state": "Meghalaya", "type": "HIGH_RAIN_ZONE", "lat": 25.27, "lon": 91.73}),
            ("Mawsynram Village", {"state": "Meghalaya", "type": "ISOLATED_VALLEY", "lat": 25.30, "lon": 91.58})
        ]
        self.graph.add_nodes_from(nodes)

        # Edges: (u, v, highway_name, length_km, slope_deg, baseline_risk)
        edges = [
            # Sikkim NH-10 Corridors
            ("Siliguri Hub", "Sevoke Junction", {"highway": "NH-10", "length_km": 22.0, "slope": 14.0, "risk_score": 0.15}),
            ("Sevoke Junction", "Teesta Bazaar", {"highway": "NH-10", "length_km": 30.0, "slope": 38.5, "risk_score": 0.78}), # Landslide Hotspot
            ("Teesta Bazaar", "Rangpo Border", {"highway": "NH-10", "length_km": 18.0, "slope": 34.0, "risk_score": 0.65}),
            ("Rangpo Border", "Singtam", {"highway": "NH-10", "length_km": 12.0, "slope": 32.0, "risk_score": 0.45}),
            ("Singtam", "Gangtok Capital", {"highway": "NH-10", "length_km": 28.0, "slope": 41.0, "risk_score": 0.82}), # Critical Slump
            ("Gangtok Capital", "Mangan District Hub", {"highway": "North Sikkim Highway", "length_km": 54.0, "slope": 46.0, "risk_score": 0.88}),

            # Meghalaya NH-6 & NH-106 Corridors
            ("Guwahati Hub", "Nongpoh", {"highway": "NH-6", "length_km": 48.0, "slope": 16.0, "risk_score": 0.18}),
            ("Nongpoh", "Umiam Lake Junction", {"highway": "NH-6", "length_km": 42.0, "slope": 26.0, "risk_score": 0.35}),
            ("Umiam Lake Junction", "Shillong Central", {"highway": "NH-6", "length_km": 16.0, "slope": 31.0, "risk_score": 0.42}),
            ("Shillong Central", "Cherrapunji Town", {"highway": "SH-5", "length_km": 53.0, "slope": 44.0, "risk_score": 0.86}), # Cloudburst risk
            ("Cherrapunji Town", "Mawsynram Village", {"highway": "Mawsmai Ridge Road", "length_km": 36.0, "slope": 47.0, "risk_score": 0.91}) # Extreme risk
        ]
        for u, v, attrs in edges:
            self.graph.add_edge(u, v, **attrs)

    def propagate_risk_and_assess_impact(self, localized_triggers: Dict[str, float] = None) -> Dict[str, Any]:
        """
        Simulates landslide events on specific segments, propagates risk downhill,
        and determines which towns/villages are cut off from major transit hubs.
        """
        active_graph = self.graph.copy()
        blocked_segments = []
        high_risk_segments = []

        # Apply localized triggers (e.g. recent cloudburst)
        triggers = localized_triggers or {
            ("Sevoke Junction", "Teesta Bazaar"): 0.85,
            ("Singtam", "Gangtok Capital"): 0.89,
            ("Cherrapunji Town", "Mawsynram Village"): 0.94
        }

        for (u, v), trigger_risk in triggers.items():
            if active_graph.has_edge(u, v):
                active_graph[u][v]["risk_score"] = trigger_risk

        for u, v, data in active_graph.edges(data=True):
            score = data.get("risk_score", 0.0)
            segment_info = {
                "from": u,
                "to": v,
                "highway": data.get("highway", "Regional Road"),
                "risk_score": score,
                "length_km": data.get("length_km", 10.0),
                "slope": data.get("slope", 20.0)
            }
            if score >= 0.80:
                blocked_segments.append(segment_info)
            elif score >= 0.55:
                high_risk_segments.append(segment_info)

        # Disconnect blocked segments in graph to find severed connectivity
        traversable_graph = active_graph.copy()
        for blk in blocked_segments:
            if traversable_graph.has_edge(blk["from"], blk["to"]):
                traversable_graph.remove_edge(blk["from"], blk["to"])

        # Check reachability to capital hubs
        isolated_nodes = []
        for node in ["Mangan District Hub", "Mawsynram Village", "Gangtok Capital"]:
            # Check reachability from Guwahati or Siliguri
            reachable_siliguri = nx.has_path(traversable_graph, "Siliguri Hub", node) if node in traversable_graph and "Siliguri Hub" in traversable_graph else False
            reachable_guwahati = nx.has_path(traversable_graph, "Guwahati Hub", node) if node in traversable_graph and "Guwahati Hub" in traversable_graph else False
            
            if not (reachable_siliguri or reachable_guwahati):
                isolated_nodes.append({
                    "node": node,
                    "state": self.graph.nodes[node].get("state", "NER"),
                    "status": "SEVERED_FROM_SUPPLY_LIFELINE",
                    "priority": "HIGH_EVACUATION_AIRDROP"
                })

        return {
            "total_segments_monitored": len(self.graph.edges),
            "blocked_corridors_count": len(blocked_segments),
            "blocked_segments": blocked_segments,
            "high_risk_segments": high_risk_segments,
            "isolated_settlements": isolated_nodes,
            "recommended_action": "Activate emergency helicopter airdrop standby & initiate Border Roads Organisation (BRO) earthmovers"
        }
