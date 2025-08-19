import React from 'react';
import { decimalToBinary } from '../classes/utils';

function RipemdFunction({ functionName, x, y, z, base }) {
  // RIPEMD-160 Selection Functions
  function F(x, y, z) {
    return (x ^ y ^ z) >>> 0;
  }

  function G(x, y, z) {
    return ((x & y) | (~x & z)) >>> 0;
  }

  function H(x, y, z) {
    return ((x | ~y) ^ z) >>> 0;
  }

  function I(x, y, z) {
    return ((x & z) | (y & ~z)) >>> 0;
  }

  function J(x, y, z) {
    return (x ^ (y | ~z)) >>> 0;
  }

  function calculateFunction(name, x, y, z) {
    switch(name) {
      case 'F': return F(x, y, z);
      case 'G': return G(x, y, z);
      case 'H': return H(x, y, z);
      case 'I': return I(x, y, z);
      case 'J': return J(x, y, z);
      default: return 0;
    }
  }

  function getFormulaDisplay(name) {
    switch(name) {
      case 'F': return 'x ⊕ y ⊕ z';
      case 'G': return '(x ∧ y) ∨ (¬x ∧ z)';
      case 'H': return '(x ∨ ¬y) ⊕ z';
      case 'I': return '(x ∧ z) ∨ (y ∧ ¬z)';
      case 'J': return 'x ⊕ (y ∨ ¬z)';
      default: return '';
    }
  }

  const result = calculateFunction(functionName, x || 0, y || 0, z || 0);
  const formula = getFormulaDisplay(functionName);

  if (!x && !y && !z) return null;

  return (
    <div className="p-2 bg-gray-800 rounded mb-2">
      <h4 className="font-bold text-yellow-400 text-sm">{functionName}(x, y, z)</h4>
      <div className="text-xs text-gray-300 mb-1">{formula}</div>
      {base === 'bin' && (
        <div className="text-xs">
          <div>x: {decimalToBinary(x || 0).padStart(32, '0')}</div>
          <div>y: {decimalToBinary(y || 0).padStart(32, '0')}</div>
          <div>z: {decimalToBinary(z || 0).padStart(32, '0')}</div>
          <div className="border-t border-gray-600 pt-1 mt-1 text-green-400">
            Result: {decimalToBinary(result).padStart(32, '0')}
          </div>
        </div>
      )}
    </div>
  );
}

export default RipemdFunction;