// RIPEMD160 Algorithm Implementation for Step-by-Step Visualization
// Based on the official RIPEMD160 specification

import { stringToBinary, decimalToBinary } from './utils.js';

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

// Main RIPEMD160 function with known working implementation
export function ripemd160(message) {
  // Initialize hash values (little-endian)
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

    // Initialize working variables
    let al = h0, bl = h1, cl = h2, dl = h3, el = h4;
    let ar = h0, br = h1, cr = h2, dr = h3, er = h4;

    // 80 rounds of compression using exact specification
    for (let i = 0; i < 80; i++) {
      // Left line computation  
      let t = al;
      if (i < 16) {
        t = (t + F(bl, cl, dl) + w[i] + 0x00000000) >>> 0;
        t = rotateLeft(t, [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8][i]);
      } else if (i < 32) {
        t = (t + G(bl, cl, dl) + w[[7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8][i-16]] + 0x5a827999) >>> 0;
        t = rotateLeft(t, [7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12][i-16]);
      } else if (i < 48) {
        t = (t + H(bl, cl, dl) + w[[3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12][i-32]] + 0x6ed9eba1) >>> 0;
        t = rotateLeft(t, [11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5][i-32]);
      } else if (i < 64) {
        t = (t + I(bl, cl, dl) + w[[1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2][i-48]] + 0x8f1bbcdc) >>> 0;
        t = rotateLeft(t, [11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12][i-48]);
      } else {
        t = (t + J(bl, cl, dl) + w[[4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13][i-64]] + 0xa953fd4e) >>> 0;
        t = rotateLeft(t, [9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6][i-64]);
      }
      t = (t + el) >>> 0;
      al = el; el = dl; dl = rotateLeft(cl, 10); cl = bl; bl = t;

      // Right line computation
      t = ar;
      if (i < 16) {
        t = (t + J(br, cr, dr) + w[[5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12][i]] + 0x50a28be6) >>> 0;
        t = rotateLeft(t, [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6][i]);
      } else if (i < 32) {
        t = (t + I(br, cr, dr) + w[[6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2][i-16]] + 0x5c4dd124) >>> 0;
        t = rotateLeft(t, [9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11][i-16]);
      } else if (i < 48) {
        t = (t + H(br, cr, dr) + w[[15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13][i-32]] + 0x6d703ef3) >>> 0;
        t = rotateLeft(t, [9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5][i-32]);
      } else if (i < 64) {
        t = (t + G(br, cr, dr) + w[[8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14][i-48]] + 0x7a6d76e9) >>> 0;
        t = rotateLeft(t, [15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8][i-48]);
      } else {
        t = (t + F(br, cr, dr) + w[[12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11][i-64]] + 0x00000000) >>> 0;
        t = rotateLeft(t, [8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11][i-64]);
      }
      t = (t + er) >>> 0;
      ar = er; er = dr; dr = rotateLeft(cr, 10); cr = br; br = t;
    }

    // Combine results
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

// Stepped RIPEMD160 function for visualization
export function ripemd160Stepped(message, firstLoop, secondLoop, chunksLoop, inputBase = 'text') {
  // Initialize hash values (little-endian)
  let h0 = 0x67452301;
  let h1 = 0xefcdab89; 
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  let hsBefore = [];
  let lettersBefore = [];
  const paddedBytes = ripemd160Padding(message, inputBase);
  let w = new Array(16).fill(0);

  // Initialize with initial state
  lettersBefore.push([h0, h1, h2, h3, h4, h0, h1, h2, h3, h4]);
  hsBefore.push([h0, h1, h2, h3, h4]);

  // Process message in chunks 
  for (let chunkIndex = 0; chunkIndex < chunksLoop; chunkIndex++) {
    const chunkStart = chunkIndex * 64;
    
    // Break chunk into 16 32-bit words (little-endian)
    for (let i = 0; i < 16; i++) {
      const byteOffset = chunkStart + i * 4;
      if (byteOffset + 3 < paddedBytes.length) {
        w[i] = paddedBytes[byteOffset] |
               (paddedBytes[byteOffset + 1] << 8) |
               (paddedBytes[byteOffset + 2] << 16) |
               (paddedBytes[byteOffset + 3] << 24);
        w[i] = w[i] >>> 0;
      } else {
        w[i] = 0;
      }
    }

    // Initialize working variables
    let al = h0, bl = h1, cl = h2, dl = h3, el = h4;
    let ar = h0, br = h1, cr = h2, dr = h3, er = h4;

    // 80 rounds of compression
    let maxRounds = chunkIndex < chunksLoop - 1 ? 79 : secondLoop;
    for (let i = 0; i <= maxRounds; i++) {
      // Left line computation  
      let t = al;
      if (i < 16) {
        t = (t + F(bl, cl, dl) + w[i] + 0x00000000) >>> 0;
        t = rotateLeft(t, [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8][i]);
      } else if (i < 32) {
        t = (t + G(bl, cl, dl) + w[[7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8][i-16]] + 0x5a827999) >>> 0;
        t = rotateLeft(t, [7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12][i-16]);
      } else if (i < 48) {
        t = (t + H(bl, cl, dl) + w[[3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12][i-32]] + 0x6ed9eba1) >>> 0;
        t = rotateLeft(t, [11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5][i-32]);
      } else if (i < 64) {
        t = (t + I(bl, cl, dl) + w[[1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2][i-48]] + 0x8f1bbcdc) >>> 0;
        t = rotateLeft(t, [11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12][i-48]);
      } else {
        t = (t + J(bl, cl, dl) + w[[4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13][i-64]] + 0xa953fd4e) >>> 0;
        t = rotateLeft(t, [9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6][i-64]);
      }
      t = (t + el) >>> 0;
      al = el; el = dl; dl = rotateLeft(cl, 10); cl = bl; bl = t;

      // Right line computation
      t = ar;
      if (i < 16) {
        t = (t + J(br, cr, dr) + w[[5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12][i]] + 0x50a28be6) >>> 0;
        t = rotateLeft(t, [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6][i]);
      } else if (i < 32) {
        t = (t + I(br, cr, dr) + w[[6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2][i-16]] + 0x5c4dd124) >>> 0;
        t = rotateLeft(t, [9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11][i-16]);
      } else if (i < 48) {
        t = (t + H(br, cr, dr) + w[[15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13][i-32]] + 0x6d703ef3) >>> 0;
        t = rotateLeft(t, [9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5][i-32]);
      } else if (i < 64) {
        t = (t + G(br, cr, dr) + w[[8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14][i-48]] + 0x7a6d76e9) >>> 0;
        t = rotateLeft(t, [15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8][i-48]);
      } else {
        t = (t + F(br, cr, dr) + w[[12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11][i-64]] + 0x00000000) >>> 0;
        t = rotateLeft(t, [8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11][i-64]);
      }
      t = (t + er) >>> 0;
      ar = er; er = dr; dr = rotateLeft(cr, 10); cr = br; br = t;
      
      // Store step results
      lettersBefore.push([al, bl, cl, dl, el, ar, br, cr, dr, er]);
    }

    // Combine results
    let t = (h1 + cl + dr) >>> 0;
    h1 = (h2 + dl + er) >>> 0;
    h2 = (h3 + el + ar) >>> 0;
    h3 = (h4 + al + br) >>> 0;
    h4 = (h0 + bl + cr) >>> 0;
    h0 = t;

    hsBefore.push([h0, h1, h2, h3, h4]);
  }

  // Return final hash in hex format
  function toHexLE(value) {
    const bytes = [
      (value >>> 0) & 0xFF,
      (value >>> 8) & 0xFF,
      (value >>> 16) & 0xFF,
      (value >>> 24) & 0xFF
    ];
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  const hash = toHexLE(h0) + toHexLE(h1) + toHexLE(h2) + toHexLE(h3) + toHexLE(h4);

  // Ensure we have proper final letters
  const finalLetters = lettersBefore.length > 1 ? lettersBefore[lettersBefore.length - 1] : [h0, h1, h2, h3, h4, h0, h1, h2, h3, h4];
  
  return {
    hash,
    letters: finalLetters,
    lettersBefore,
    hs: hsBefore[hsBefore.length - 1] || [h0, h1, h2, h3, h4],
    hsBefore,
    w: w.map(word => word.toString(2).padStart(32, '0'))
  };
}