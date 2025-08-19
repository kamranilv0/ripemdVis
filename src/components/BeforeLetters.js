import { decimalToBinary } from '../classes/utils'
import ReactTooltip from 'react-tooltip';

function displayHex(value) {
  return Number(value || 0 >>> 0).toString(16).padStart(8, '0').match(new RegExp('.{1,' + 2 + '}', 'g')).join(' ');
}

function BeforeLetters({ letters, base, labels = [], clock, algorithm = 'sha256' }) {

  function focusClass(key, clock) {
    if (algorithm === 'ripemd160') {
      if(clock <= 0) return;
      // RIPEMD160 focus classes for left and right lines
      if(4 === key) return 'text-purple-500'; // E
      if(3 === key) return 'text-indigo-500'; // D
      if(2 === key) return 'text-red-500';    // C
      if(1 === key) return 'text-green-500';  // B
      if(0 === key) return 'text-fuchsia-500'; // A
      
      if(9 === key) return 'text-purple-300'; // E'
      if(8 === key) return 'text-indigo-300'; // D'
      if(7 === key) return 'text-red-300';    // C'
      if(6 === key) return 'text-green-300';  // B'
      if(5 === key) return 'text-fuchsia-300'; // A'
      return 'border-transparent';
    }
    
    if(clock <= 49) return;
    if(7 === key) return 'text-purple-500';
    if(6 === key) return 'text-indigo-500';
    if(5 === key) return 'text-red-500';
    if(4 === key) return 'text-green-500';

    if(2 === key) return 'text-orange-500';
    if(1 === key) return 'text-lime-500';
    if(0 === key) return 'text-fuchsia-500';

    return 'border-transparent'
  }

  const showClock = algorithm === 'ripemd160' ? 1 : 50;
  if(clock < showClock) return '';

  // Safety check for letters array
  if (!letters || !Array.isArray(letters) || letters.length === 0) {
    return '';
  }

  return (
    <div className="ml-8">
      <ReactTooltip />
      <h2 className="font-bold my-1 text-indigo-200">Working Variables</h2>
      <div className="flex">
        <div>
          {base === 'bin' && letters.map((word, key) =>
            <div className="flex" data-tip={ displayHex(word) } key={key}>
              <span className="mr-2 font-bold text-green-600">{labels && labels[key]}</span>
              <div className={'px-1 ' + focusClass(key, clock)}>
                { decimalToBinary(word || 0).padStart(32, '0').match(new RegExp('.{1,' + 32 + '}', 'g')).join(' ') }
              </div>
            </div>
          )}
        </div>
        <div>
          {algorithm === 'sha256' && (
            <div className={clock === 50 ? 'opacity-100 hidden' : 'opacity-0 hidden'}>
              <div className="flex">
                <div>
                  <div className="text-fuchsia-500">= a</div>
                  <div className="text-lime-500">= b</div>
                  <div className="text-orange-500">= c</div>
                  <div className="text--500">= d</div>
                  <div className="text-green-500">= e</div>
                  <div className="text-red-500">= f</div>
                  <div className="text-indigo-500">= g</div>
                  <div className="text-purple-500">= h</div>
                </div>
                <div className="ml-1">
                  <div>┐</div>
                  <div>│</div>
                  <div>│</div>
                  <div>├ Initialize</div>
                  <div>│ working variables</div>
                  <div>│</div>
                  <div>│</div>
                  <div>┘</div>
                </div>
              </div>
            </div>
          )}
          {algorithm === 'ripemd160' && (
            <div className={clock === 1 ? 'opacity-100 hidden' : 'opacity-0 hidden'}>
              <div className="flex">
                <div>
                  <div className="text-fuchsia-500">= A</div>
                  <div className="text-green-500">= B</div>
                  <div className="text-red-500">= C</div>
                  <div className="text-indigo-500">= D</div>
                  <div className="text-purple-500">= E</div>
                  <div className="text-fuchsia-300">= A'</div>
                  <div className="text-green-300">= B'</div>
                  <div className="text-red-300">= C'</div>
                  <div className="text-indigo-300">= D'</div>
                  <div className="text-purple-300">= E'</div>
                </div>
                <div className="ml-1">
                  <div>┐</div>
                  <div>│</div>
                  <div>│</div>
                  <div>├ Initialize</div>
                  <div>│ working variables</div>
                  <div>│ (left & right lines)</div>
                  <div>│</div>
                  <div>│</div>
                  <div>│</div>
                  <div>┘</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BeforeLetters;
