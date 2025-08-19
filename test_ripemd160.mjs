// Test script to verify RIPEMD160 implementation
import { ripemd160 } from './src/classes/ripemd160.js';

// Test vectors for RIPEMD160
const testVectors = [
  {
    input: "",
    expected: "9c1185a5c5e9fc54612808977ee8f548b2258d31"
  },
  {
    input: "a",
    expected: "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe"
  },
  {
    input: "abc",
    expected: "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"
  }
];

console.log("Testing RIPEMD160 implementation...");

testVectors.forEach((test, index) => {
  try {
    const result = ripemd160(test.input);
    const passed = result === test.expected;
    console.log(`Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`  Input: "${test.input}"`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got:      ${result}`);
    console.log('');
  } catch (error) {
    console.log(`Test ${index + 1}: ERROR - ${error.message}`);
    console.log('');
  }
});