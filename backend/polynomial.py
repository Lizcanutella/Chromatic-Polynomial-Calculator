from collections import defaultdict
from typing import Dict

class Polynomial:
    """
    Represents a polynomial in k with integer coefficients.
    """

    def __init__(self, coeffs: Dict[int, int] = None):
        """Initializes the polynomial from a dictionary {degree: coefficient}"""
        self.coeffs = coeffs if coeffs else {}
        self._remove_zeros()

    def _remove_zeros(self):
        """Removes the terms with zero coefficients"""
        self.coeffs = {deg: coeff for deg, coeff in self.coeffs.items() if coeff != 0}

    def __add__(self, other):
        result = defaultdict(int)
        for deg, coeff in self.coeffs.items():
            result[deg] += coeff
        for deg, coeff in other.coeffs.items():
            result[deg] += coeff
        return Polynomial(dict(result))

    def __sub__(self, other):
        result = defaultdict(int)
        for deg, coeff in self.coeffs.items():
            result[deg] += coeff
        for deg, coeff in other.coeffs.items():
            result[deg] -= coeff
        return Polynomial(dict(result))

    def __mul__(self, other):
        if isinstance(other, (int, float)):
            result = {deg: coeff * other for deg, coeff in self.coeffs.items()}
            return Polynomial(result)
        
        elif isinstance(other, Polynomial):
            result = defaultdict(int)
            for deg1, coeff1 in self.coeffs.items():
                for deg2, coeff2 in other.coeffs.items():
                    result[deg1 + deg2] += coeff1 * coeff2
            return Polynomial(dict(result))

    def __str__(self):
        if not self.coeffs:
            return "0"

        terms = sorted(self.coeffs.items(), key=lambda x: x[0], reverse=True)

        result = []
        for i, (deg, coeff) in enumerate(terms):
            if i == 0:
                if coeff < 0:
                    sign = "-"
                    coeff = abs(coeff)
                else:
                    sign = ""
            else:
                if coeff < 0:
                    sign = " - "
                    coeff = abs(coeff)
                else:
                    sign = " + "

            if deg == 0:
                term = f"{coeff}"
            elif deg == 1:
                if coeff == 1:
                    term = "k"
                else:
                    term = f"{coeff}k"
            else:
                if coeff == 1:
                    term = f"k^{{{deg}}}"
                else:
                    term = f"{coeff}k^{{{deg}}}"

            result.append(sign + term)

        return "".join(result)

    def __repr__(self):
        return f"Polynomial({self.coeffs})"
    
