// Debug script for RIPEMD160
import { ripemd160 } from './src/classes/ripemd160.js';

// Let's debug step by step for "a"
console.log("Debugging RIPEMD160 for input 'a'");

// First check what bytes we get
const message = "a";
let bytes = [];
for (let i = 0; i < message.length; i++) {
  const code = message.charCodeAt(i);
  bytes.push(code);
}

console.log("Original bytes:", bytes);

// Add padding bit
bytes.push(0x80);
console.log("After adding 0x80:", bytes);

// Add padding zeros
while ((bytes.length % 64) !== 56) {
  bytes.push(0);
}

console.log("After padding to 56 mod 64:", bytes.length, "bytes");

// Add length in bits as 64-bit little-endian
const lengthInBits = message.length * 8;
console.log("Length in bits:", lengthInBits);

for (let i = 0; i < 8; i++) {
  bytes.push((lengthInBits >>> (i * 8)) & 0xFF);
}

console.log("Final padded bytes:", bytes.length, "bytes");
console.log("Final bytes:", bytes);

// Now test the hash
const result = ripemd160("a");
console.log("Hash result:", result);
console.log("Expected:    0bdc9d2d256b3ee9daae347be6f4dc835a467ffe");