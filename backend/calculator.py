"""
Chromatic Polynomial Calculator
Computes chromatic polynomials using the deletion-contraction algorithm
"""

from polynomial import Polynomial
from graph import Graph


def chromatic_polynomial(graph: Graph) -> Polynomial:
    """
    Calculate chromatic polynomial using deletion-contraction algorithm

    The chromatic polynomial P(G,k) gives the number of proper k-colorings of G.
    Uses the recurrence: P(G) = P(G-e) - P(G/e)
    where G-e is G with edge e deleted, G/e is G with edge e contracted.
    """
    if graph.num_edges() == 0:
        n = graph.num_vertices()
        if n == 0:
            return Polynomial({0: 1})
        else:
            return Polynomial({n: 1})

    edges = graph.get_edges()
    if not edges:
        return Polynomial({graph.num_vertices(): 1})

    u, v = edges[0]

    # Deletion: P(G-e) and Contraction: P(G/e)
    g_minus_e = graph.delete_edge(u, v)
    p_deletion = chromatic_polynomial(g_minus_e)

    g_contract_e = graph.contract_edge(u, v)
    p_contraction = chromatic_polynomial(g_contract_e)

    return p_deletion - p_contraction
