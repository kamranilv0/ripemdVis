import React from 'react';
import RipemdFunction from './RipemdFunction';

function RipemdCompressionCalculation({ letters, clock, wView, base, lastClock, hsBefore, hs, masterClock, result }) {
  let execute = masterClock === lastClock();

  function active(clock) {
    return '';
  }

  // RIPEMD-160 Selection Functions for display
  function getFunctionName(round) {
    if (round < 16) return 'F';
    if (round < 32) return 'G';
    if (round < 48) return 'H';
    if (round < 64) return 'I';
    return 'J';
  }

  function getConstantName(round) {
    if (round < 16) return '0x00000000';
    if (round < 32) return '0x5a827999';
    if (round < 48) return '0x6ed9eba1';
    if (round < 64) return '0x8f1bbcdc';
    return '0xa953fd4e';
  }

  function getRightConstantName(round) {
    if (round < 16) return '0x50a28be6';
    if (round < 32) return '0x5c4dd124';
    if (round < 48) return '0x6d703ef3';
    if (round < 64) return '0x7a6d76e9';
    return '0x00000000';
  }

  function getRightFunctionName(round) {
    if (round < 16) return 'J';
    if (round < 32) return 'I';
    if (round < 48) return 'H';
    if (round < 64) return 'G';
    return 'F';
  }

  // Word indices for message scheduling
  function getLeftWordIndex(round) {
    if (round < 16) return round;
    if (round < 32) return [7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8][round-16];
    if (round < 48) return [3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12][round-32];
    if (round < 64) return [1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2][round-48];
    return [4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13][round-64];
  }

  function getRightWordIndex(round) {
    if (round < 16) return [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12][round];
    if (round < 32) return [6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2][round-16];
    if (round < 48) return [15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13][round-32];
    if (round < 64) return [8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14][round-48];
    return [12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11][round-64];
  }

  const round = clock;
  const leftFunction = getFunctionName(round);
  const rightFunction = getRightFunctionName(round);
  const leftConstant = getConstantName(round);
  const rightConstant = getRightConstantName(round);
  const leftWordIndex = getLeftWordIndex(round);
  const rightWordIndex = getRightWordIndex(round);

  const showClock = 1;
  if(clock < showClock) return '';

  return (
    <div className={`duration-500 ${active(clock)}`}>
      {clock < showClock && clock >= 0 ? null :
        <div className="mt-5 flex">
          <div className="mr-1 mt-[7px]">
            <br/><br/>
            <div>&nbsp;&nbsp;┌─</div>
            <div>&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;▼</div>
            <div>&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;│</div>
            <div>┌─┼─</div>
            <div>│ │</div>
            <div>▼ │</div>
            <div>│ └─</div>
            <div>└───</div>
            <br/><br/><br/><br/>
            <br/><br/><br/><br/><br/>
            <div className="mt-[0px]">┌───</div>
            <div>│&nbsp;&nbsp;</div>
            <div>│&nbsp;&nbsp;</div>
            <div>│&nbsp;&nbsp;</div>
            <div>▼&nbsp;&nbsp;</div>
            <div>│&nbsp;&nbsp;</div>
            <div>│ ┌─</div>
            <div>│ ▼</div>
            <div>│ └─</div>
            <div>└───</div>
          </div>
          <div>
            <h3 className="font-bold my-1 text-indigo-200">RIPEMD-160 Compression - Round {round}</h3>
            
            {/* Left Line Function Display */}
            {letters && letters.length >= 5 && (
              <RipemdFunction 
                functionName={leftFunction} 
                x={letters[1]} 
                y={letters[2]} 
                z={letters[3]} 
                base={base} 
              />
            )}
            
            {/* Right Line Function Display */}
            {letters && letters.length >= 10 && (
              <RipemdFunction 
                functionName={rightFunction} 
                x={letters[6]} 
                y={letters[7]} 
                z={letters[8]} 
                base={base} 
              />
            )}
            
            {/* Left Line */}
            <div className="mb-4 p-3 bg-gray-800 rounded">
              <h4 className="font-bold text-green-400 mb-2">Left Line</h4>
              <div className="text-sm">
                <div>Function: <span className="text-yellow-400">{leftFunction}(B, C, D)</span></div>
                <div>Word: <span className="text-blue-400">w{leftWordIndex}</span></div>
                <div>Constant: <span className="text-purple-400">{leftConstant}</span></div>
                <div className="mt-2 text-xs text-gray-300">
                  T = (A + {leftFunction}(B,C,D) + w{leftWordIndex} + K) &lt;&lt;&lt; s + E
                </div>
              </div>
            </div>

            {/* Right Line */}
            <div className="mb-4 p-3 bg-gray-700 rounded">
              <h4 className="font-bold text-green-300 mb-2">Right Line</h4>
              <div className="text-sm">
                <div>Function: <span className="text-yellow-300">{rightFunction}(B', C', D')</span></div>
                <div>Word: <span className="text-blue-300">w{rightWordIndex}</span></div>
                <div>Constant: <span className="text-purple-300">{rightConstant}</span></div>
                <div className="mt-2 text-xs text-gray-300">
                  T' = (A' + {rightFunction}(B',C',D') + w{rightWordIndex} + K') &lt;&lt;&lt; s' + E'
                </div>
              </div>
            </div>

            {/* Working Variables Update */}
            <div className="p-3 bg-gray-800 rounded">
              <h4 className="font-bold text-orange-400 mb-2">Variable Updates</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>A ← E, B ← T, C ← B, D ← C&lt;&lt;&lt;10, E ← D</div>
                <div>A' ← E', B' ← T', C' ← B', D' ← C'&lt;&lt;&lt;10, E' ← D'</div>
              </div>
            </div>

            {execute && (
              <div className="mt-4 p-3 bg-gray-900 rounded">
                <h4 className="font-bold text-red-400 mb-2">Final Combination</h4>
                <div className="text-xs text-gray-300">
                  <div>h1 = h2 + C + D', h2 = h3 + D + E'</div>
                  <div>h3 = h4 + E + A', h4 = h0 + A + B'</div>
                  <div>h0 = h1 + B + C'</div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}

export default RipemdCompressionCalculation;