from typing import List, Tuple, Set

class Graph:
    
    def __init__(self, vertices: Set[int] = None):
        self.vertices = vertices if vertices else set()
        self.edges = set()

    def add_vertex(self, v: int):
        self.vertices.add(v)

    def add_edge(self, u: int, v: int):
        if u != v:  
            self.vertices.add(u)
            self.vertices.add(v)
            edge = tuple(sorted([u, v]))
            self.edges.add(edge)

    def remove_edge(self, u: int, v: int):
        edge = tuple(sorted([u, v]))
        if edge in self.edges:
            self.edges.remove(edge)

    def has_edge(self, u: int, v: int) -> bool:
        edge = tuple(sorted([u, v]))
        return edge in self.edges

    def get_edges(self) -> List[Tuple[int, int]]:
        """Get all edges as list of tuples"""
        return list(self.edges)

    def num_vertices(self) -> int:
        return len(self.vertices)

    def num_edges(self) -> int:
        return len(self.edges)

    def copy(self):
        new_graph = Graph(self.vertices.copy())
        new_graph.edges = self.edges.copy()
        return new_graph

    def delete_edge(self, u: int, v: int):
        """Returns a new graph with edge (u,v) deleted"""
        new_graph = self.copy()
        new_graph.remove_edge(u, v)
        return new_graph

    def contract_edge(self, u: int, v: int):
        """Returns a new graph with edge (u,v) contracted"""
        if not self.has_edge(u, v):
            return self.copy()

        new_graph = Graph()

        vertex_map = {}
        for vertex in self.vertices:
            if vertex == v:
                vertex_map[vertex] = u
            else:
                vertex_map[vertex] = vertex
                new_graph.add_vertex(vertex)

        for edge_u, edge_v in self.edges:
            if (edge_u, edge_v) != (u, v) and (edge_u, edge_v) != (v, u):
                new_u = vertex_map[edge_u]
                new_v = vertex_map[edge_v]
                if new_u != new_v:
                    new_graph.add_edge(new_u, new_v)

        return new_graph

    def __str__(self):
        vertices_str = f"Vertices: {sorted(self.vertices)}"
        edges_str = f"Edges: {sorted(self.edges)}"
        return f"Graph({vertices_str}, {edges_str})"

