// RIPEMD160 Algorithm Implementation for Step-by-Step Visualization
// Based on the original RIPEMD160 specification and the C implementation

import { stringToBinary, hexToBinary, binaryToHex, chunkString, appendOneBit, isMultipleOf512, decimalToBinary } from './utils.js';

// RIPEMD160-specific padding (little-endian length encoding)
function ripemd160Padding(message, base = 'text') {
  // First convert to bytes
  let bytes = [];
  if (base === 'text') {
    // Simple UTF-8 encoding for ASCII characters
    for (let i = 0; i < message.length; i++) {
      const code = message.charCodeAt(i);
      if (code < 128) {
        bytes.push(code);
      } else {
        // Handle multi-byte UTF-8 later if needed
        throw new Error('Non-ASCII characters not supported yet');
      }
    }
  } else {
    // Convert from binary string to bytes for now
    if(base === 'text') message = stringToBinary(message);
    for (let i = 0; i < message.length; i += 8) {
      bytes.push(parseInt(message.slice(i, i + 8), 2));
    }
  }
  
  const originalLength = bytes.length;
  
  // Add padding bit (0x80)
  bytes.push(0x80);
  
  // Add padding zeros
  while ((bytes.length % 64) !== 56) {
    bytes.push(0);
  }
  
  // Add length in bits as 64-bit little-endian
  const lengthInBits = originalLength * 8;
  for (let i = 0; i < 8; i++) {
    bytes.push((lengthInBits >>> (i * 8)) & 0xFF);
  }
  
  return bytes;
}

// Left rotate function
export function rotateLeft(value, r) {
  const bitWidth = 32;
  const rotation = r & (bitWidth - 1);
  const bitMask = (2 ** bitWidth) - 1;
  return (
    ((value << rotation) & bitMask) |
    (value >>> (bitWidth - rotation))
  );
}

// RIPEMD160 Selection Functions
export function F(x, y, z) {
  return (x ^ y ^ z) >>> 0;
}

export function G(x, y, z) {
  return ((x & y) | (~x & z)) >>> 0;
}

export function H(x, y, z) {
  return ((x | ~y) ^ z) >>> 0;
}

export function I(x, y, z) {
  return ((x & z) | (y & ~z)) >>> 0;
}

export function J(x, y, z) {
  return (x ^ (y | ~z)) >>> 0;
}

// Constants for left line
const KL = [
  0x00000000, // Round 1
  0x5a827999, // Round 2  
  0x6ed9eba1, // Round 3
  0x8f1bbcdc, // Round 4
  0xa953fd4e  // Round 5
];

// Constants for right line
const KR = [
  0x50a28be6, // Round 1
  0x5c4dd124, // Round 2
  0x6d703ef3, // Round 3
  0x7a6d76e9, // Round 4
  0x00000000  // Round 5
];

// Left line rotation amounts
const RL = [
  // Round 1
  11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
  // Round 2 
   7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
  // Round 3
  11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
  // Round 4
  11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
  // Round 5
   9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6
];

// Right line rotation amounts  
const RR = [
  // Round 1
   8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
  // Round 2
   9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
  // Round 3
   9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
  // Round 4
  15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
  // Round 5
   8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11
];

// Left line message selection
const ZL = [
  // Round 1
   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
  // Round 2
   7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
  // Round 3
   3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
  // Round 4
   1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
  // Round 5
   4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13
];

// Right line message selection
const ZR = [
  // Round 1
   5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
  // Round 2
   6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
  // Round 3
  15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
  // Round 4
   8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
  // Round 5
  12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11
];

// Main RIPEMD160 function
export function ripemd160(message) {
  // Initialize hash values
  let h0 = 0x67452301;
  let h1 = 0xefcdab89; 
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const paddedBytes = ripemd160Padding(message);
  
  // Process message in 64-byte (512-bit) chunks
  for (let chunkStart = 0; chunkStart < paddedBytes.length; chunkStart += 64) {
    // Break chunk into 16 32-bit words (little-endian)
    let w = new Array(16);
    
    for (let i = 0; i < 16; i++) {
      const byteOffset = chunkStart + i * 4;
      w[i] = paddedBytes[byteOffset] |
             (paddedBytes[byteOffset + 1] << 8) |
             (paddedBytes[byteOffset + 2] << 16) |
             (paddedBytes[byteOffset + 3] << 24);
      w[i] = w[i] >>> 0; // Ensure unsigned 32-bit
    }

    // Initialize working variables for left and right lines
    let al = h0, bl = h1, cl = h2, dl = h3, el = h4;
    let ar = h0, br = h1, cr = h2, dr = h3, er = h4;

    // 80 rounds of compression
    for (let i = 0; i < 80; i++) {
      // Left line
      let fl, tl;
      if (i < 16) fl = F(bl, cl, dl);
      else if (i < 32) fl = G(bl, cl, dl);
      else if (i < 48) fl = H(bl, cl, dl);
      else if (i < 64) fl = I(bl, cl, dl);
      else fl = J(bl, cl, dl);

      tl = (al + fl + w[ZL[i]] + KL[Math.floor(i / 16)]) >>> 0;
      tl = (rotateLeft(tl, RL[i]) + el) >>> 0;
      al = el; el = dl; dl = rotateLeft(cl, 10); cl = bl; bl = tl;

      // Right line
      let fr, tr;
      if (i < 16) fr = J(br, cr, dr);
      else if (i < 32) fr = I(br, cr, dr);
      else if (i < 48) fr = H(br, cr, dr);
      else if (i < 64) fr = G(br, cr, dr);
      else fr = F(br, cr, dr);

      tr = (ar + fr + w[ZR[i]] + KR[Math.floor(i / 16)]) >>> 0;
      tr = (rotateLeft(tr, RR[i]) + er) >>> 0;
      ar = er; er = dr; dr = rotateLeft(cr, 10); cr = br; br = tr;
    }

    // Combine results (following the C implementation exactly)
    let t = (h1 + cl + dr) >>> 0;
    h1 = (h2 + dl + er) >>> 0;
    h2 = (h3 + el + ar) >>> 0;
    h3 = (h4 + al + br) >>> 0;
    h4 = (h0 + bl + cr) >>> 0;
    h0 = t;
  }

  // Return hex string (160 bits = 40 hex chars) in little-endian format
  function toHexLE(value) {
    const bytes = [
      (value >>> 0) & 0xFF,
      (value >>> 8) & 0xFF,
      (value >>> 16) & 0xFF,
      (value >>> 24) & 0xFF
    ];
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  return toHexLE(h0) + toHexLE(h1) + toHexLE(h2) + toHexLE(h3) + toHexLE(h4);
}