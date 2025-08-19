/**
 * RIPEMD-160 Interactive Visualizer
 * Educational implementation showing step-by-step algorithm execution
 */

class RIPEMD160Visualizer {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.steps = [];
        this.currentBlock = 0;
        this.animationSpeed = 1000; // milliseconds between steps
        this.showGateView = false;
        this.littleEndian = true;
        this.zoomLevel = 1.0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.reset();
    }

    initializeElements() {
        // Input elements
        this.messageInput = document.getElementById('message-input');
        this.hashButton = document.getElementById('hash-button');
        this.stepButton = document.getElementById('step-button');
        this.resetButton = document.getElementById('reset-button');
        
        // Display elements
        this.originalInput = document.getElementById('original-input');
        this.paddedInput = document.getElementById('padded-input');
        this.messageLength = document.getElementById('message-length');
        this.messageBlocks = document.getElementById('message-blocks');
        
        // Enhanced control elements
        this.playPauseButton = document.getElementById('play-pause-button');
        this.nextStepButton = document.getElementById('next-step-button');
        this.prevStepButton = document.getElementById('prev-step-button');
        this.currentStepDisplay = document.getElementById('current-step');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedDisplay = document.getElementById('speed-display');
        this.stepGranularity = document.getElementById('step-granularity');
        
        // Visualization controls
        this.toggleViewButton = document.getElementById('toggle-view-button');
        this.toggleEndianButton = document.getElementById('toggle-endian-button');
        this.exportButton = document.getElementById('export-button');
        
        // Gate visualization elements
        this.gateSection = document.getElementById('gate-section');
        this.gateCanvas = document.getElementById('gate-canvas');
        this.bitDetails = document.getElementById('bit-details');
        this.zoomInButton = document.getElementById('zoom-in-button');
        this.zoomOutButton = document.getElementById('zoom-out-button');
        this.highlightPathButton = document.getElementById('highlight-path-button');
        
        // Register elements
        this.leftRegisters = {
            a: document.getElementById('left-a'),
            b: document.getElementById('left-b'),
            c: document.getElementById('left-c'),
            d: document.getElementById('left-d'),
            e: document.getElementById('left-e')
        };
        
        this.leftRegistersBinary = {
            a: document.getElementById('left-a-binary'),
            b: document.getElementById('left-b-binary'),
            c: document.getElementById('left-c-binary'),
            d: document.getElementById('left-d-binary'),
            e: document.getElementById('left-e-binary')
        };
        
        this.rightRegisters = {
            a: document.getElementById('right-a'),
            b: document.getElementById('right-b'),
            c: document.getElementById('right-c'),
            d: document.getElementById('right-d'),
            e: document.getElementById('right-e')
        };
        
        this.rightRegistersBinary = {
            a: document.getElementById('right-a-binary'),
            b: document.getElementById('right-b-binary'),
            c: document.getElementById('right-c-binary'),
            d: document.getElementById('right-d-binary'),
            e: document.getElementById('right-e-binary')
        };
        
        // Operation displays
        this.leftOperation = document.getElementById('left-operation');
        this.rightOperation = document.getElementById('right-operation');
        
        // Round info
        this.currentRound = document.getElementById('current-round');
        this.currentFunction = document.getElementById('current-function');
        this.currentConstant = document.getElementById('current-constant');
        
        // Result elements
        this.finalHash = document.getElementById('final-hash');
        this.hashHex = document.getElementById('hash-hex');
        
        // State variables
        this.showGateView = false;
        this.littleEndian = true;
        this.zoomLevel = 1.0;
    }

    setupEventListeners() {
        this.hashButton.addEventListener('click', () => this.calculateHash());
        this.stepButton.addEventListener('click', () => this.startStepMode());
        this.resetButton.addEventListener('click', () => this.reset());
        this.playPauseButton.addEventListener('click', () => this.togglePlayPause());
        this.nextStepButton.addEventListener('click', () => this.nextStep());
        this.prevStepButton.addEventListener('click', () => this.prevStep());
        
        // Enhanced controls
        this.speedSlider.addEventListener('input', () => this.updateSpeed());
        this.toggleViewButton.addEventListener('click', () => this.toggleGateView());
        this.toggleEndianButton.addEventListener('click', () => this.toggleEndianness());
        this.exportButton.addEventListener('click', () => this.exportCurrentFrame());
        
        // Gate visualization controls
        this.zoomInButton.addEventListener('click', () => this.zoomIn());
        this.zoomOutButton.addEventListener('click', () => this.zoomOut());
        this.highlightPathButton.addEventListener('click', () => this.toggleHighlightPath());
        
        // Enter key on input
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculateHash();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextStep();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevStep();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.increaseSpeed();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.decreaseSpeed();
                    break;
                case 'g':
                    e.preventDefault();
                    this.toggleGateView();
                    break;
            }
        });
    }

    reset() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.steps = [];
        this.currentBlock = 0;
        
        // Reset UI
        this.playPauseButton.textContent = '▶ Play';
        this.playPauseButton.disabled = true;
        this.nextStepButton.disabled = true;
        this.prevStepButton.disabled = true;
        this.stepButton.disabled = false;
        
        // Clear displays
        this.originalInput.textContent = '';
        this.paddedInput.textContent = '';
        this.messageLength.textContent = '';
        this.messageBlocks.innerHTML = '';
        this.finalHash.textContent = '';
        this.hashHex.textContent = '';
        
        // Reset registers to initial values
        const initialValues = {
            a: '0x67452301',
            b: '0xefcdab89', 
            c: '0x98badcfe',
            d: '0x10325476',
            e: '0xc3d2e1f0'
        };
        
        const initialBinary = {
            a: '01100111010001010010001100000001',
            b: '11101111110011011010101110001001',
            c: '10011000101110101101110011111110',
            d: '00010000001100100101010001110110',
            e: '11000011110100101110000111110000'
        };
        
        Object.keys(initialValues).forEach(reg => {
            this.leftRegisters[reg].textContent = initialValues[reg];
            this.rightRegisters[reg].textContent = initialValues[reg];
            this.leftRegisters[reg].classList.remove('changed');
            this.rightRegisters[reg].classList.remove('changed');
            
            // Update binary displays
            this.updateBinaryDisplay(this.leftRegistersBinary[reg], initialBinary[reg]);
            this.updateBinaryDisplay(this.rightRegistersBinary[reg], initialBinary[reg]);
        });
        
        // Clear operations
        this.leftOperation.textContent = '';
        this.rightOperation.textContent = '';
        
        // Reset round info
        this.currentRound.textContent = '1';
        this.currentFunction.textContent = 'F';
        this.currentConstant.textContent = '0x00000000';
        this.currentStepDisplay.textContent = 'Step: 0/0';
        
        // Reset speed and controls
        this.speedSlider.value = '1.0';
        this.speedDisplay.textContent = '1.0×';
        this.animationSpeed = 1000;
        
        // Hide gate view
        this.gateSection.style.display = 'none';
        this.toggleViewButton.textContent = '📊 Toggle Gate View';
        this.showGateView = false;
    }

    calculateHash() {
        const message = this.messageInput.value;
        
        // Step 1: Show input preprocessing
        this.showInputPreprocessing(message);
        
        // Step 2: Create message blocks
        const blocks = this.createMessageBlocks(message);
        this.displayMessageBlocks(blocks);
        
        // Step 3: Calculate hash and prepare steps
        const result = this.ripemd160WithSteps(message);
        
        // Display final result
        this.displayResult(result.hash);
        
        // Prepare for step-through mode
        this.steps = result.steps;
        this.totalSteps = this.steps.length;
        this.currentStep = 0;
        this.currentStepDisplay.textContent = `Step: 0/${this.totalSteps}`;
        
        // Enable step controls
        this.stepButton.disabled = false;
    }

    showInputPreprocessing(message) {
        // Show original input
        this.originalInput.textContent = message;
        
        // Convert to bytes and show preprocessing
        const messageBytes = new TextEncoder().encode(message);
        const messageBits = messageBytes.length * 8;
        
        // Show message length
        this.messageLength.textContent = `${messageBits} bits (${messageBytes.length} bytes)`;
        
        // Show padded message
        const paddedMessage = this.padMessage(messageBytes);
        const paddedHex = Array.from(paddedMessage).map(b => 
            b.toString(16).padStart(2, '0')).join(' ');
        this.paddedInput.textContent = paddedHex;
    }

    padMessage(messageBytes) {
        const messageBitLen = messageBytes.length * 8;
        
        // Calculate padding length - need to fit message + 1 bit + 8 bytes for length
        let paddedLength = messageBytes.length + 1; // message + 0x80 byte
        while ((paddedLength + 8) % 64 !== 0) {
            paddedLength++;
        }
        paddedLength += 8; // add 8 bytes for length
        
        const padded = new Uint8Array(paddedLength);
        padded.set(messageBytes);
        
        // Add '1' bit followed by zeros
        padded[messageBytes.length] = 0x80;
        
        // Add length as 64-bit little-endian at the end
        for (let i = 0; i < 8; i++) {
            padded[paddedLength - 8 + i] = (messageBitLen >>> (i * 8)) & 0xff;
        }
        
        return padded;
    }

    createMessageBlocks(message) {
        const messageBytes = new TextEncoder().encode(message);
        const padded = this.padMessage(messageBytes);
        
        const blocks = [];
        for (let i = 0; i < padded.length; i += 64) {
            const block = new Uint32Array(16);
            for (let j = 0; j < 16; j++) {
                const offset = i + j * 4;
                block[j] = padded[offset] | 
                          (padded[offset + 1] << 8) | 
                          (padded[offset + 2] << 16) | 
                          (padded[offset + 3] << 24);
            }
            blocks.push(block);
        }
        
        return blocks;
    }

    displayMessageBlocks(blocks) {
        this.messageBlocks.innerHTML = '';
        
        blocks.forEach((block, blockIndex) => {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'message-block';
            if (blockIndex === 0) blockDiv.classList.add('active');
            
            const header = document.createElement('h4');
            header.textContent = `Block ${blockIndex + 1}`;
            blockDiv.appendChild(header);
            
            const wordsDiv = document.createElement('div');
            wordsDiv.className = 'block-words';
            
            for (let i = 0; i < 16; i++) {
                const wordDiv = document.createElement('div');
                wordDiv.className = 'word';
                wordDiv.textContent = '0x' + block[i].toString(16).padStart(8, '0');
                wordsDiv.appendChild(wordDiv);
            }
            
            blockDiv.appendChild(wordsDiv);
            this.messageBlocks.appendChild(blockDiv);
        });
    }

    // RIPEMD-160 implementation with step tracking
    ripemd160WithSteps(message) {
        const messageBytes = new TextEncoder().encode(message);
        const padded = this.padMessage(messageBytes);
        
        // Initial hash values
        let h0 = 0x67452301;
        let h1 = 0xefcdab89;
        let h2 = 0x98badcfe;
        let h3 = 0x10325476;
        let h4 = 0xc3d2e1f0;
        
        const steps = [];
        
        // Process each 512-bit block
        for (let blockIndex = 0; blockIndex < padded.length; blockIndex += 64) {
            const block = new Uint32Array(16);
            for (let j = 0; j < 16; j++) {
                const offset = blockIndex + j * 4;
                block[j] = padded[offset] | 
                          (padded[offset + 1] << 8) | 
                          (padded[offset + 2] << 16) | 
                          (padded[offset + 3] << 24);
            }
            
            // Initialize working variables for both lanes
            let al = h0, bl = h1, cl = h2, dl = h3, el = h4; // Left lane
            let ar = h0, br = h1, cr = h2, dr = h3, er = h4; // Right lane
            
            const result = this.compressWithSteps(
                {a: al, b: bl, c: cl, d: dl, e: el},
                {a: ar, b: br, c: cr, d: dr, e: er},
                block,
                blockIndex / 64,
                steps
            );
            
            // Combine results
            const temp = (h1 + result.left.c + result.right.d) >>> 0;
            h1 = (h2 + result.left.d + result.right.e) >>> 0;
            h2 = (h3 + result.left.e + result.right.a) >>> 0;
            h3 = (h4 + result.left.a + result.right.b) >>> 0;
            h4 = (h0 + result.left.b + result.right.c) >>> 0;
            h0 = temp;
        }
        
        // Convert to bytes
        const hash = new Uint8Array(20);
        const words = [h0, h1, h2, h3, h4];
        for (let i = 0; i < 5; i++) {
            hash[i * 4] = words[i] & 0xff;
            hash[i * 4 + 1] = (words[i] >>> 8) & 0xff;
            hash[i * 4 + 2] = (words[i] >>> 16) & 0xff;
            hash[i * 4 + 3] = (words[i] >>> 24) & 0xff;
        }
        
        return { hash, steps };
    }

    // Helper functions for RIPEMD-160
    f(x, y, z) { return x ^ y ^ z; }
    g(x, y, z) { return (x & y) | (~x & z); }
    h(x, y, z) { return (x | ~y) ^ z; }
    i(x, y, z) { return (x & z) | (y & ~z); }
    j(x, y, z) { return x ^ (y | ~z); }
    
    rotateLeft(value, amount) {
        return ((value << amount) | (value >>> (32 - amount))) >>> 0;
    }

    compressWithSteps(leftRegs, rightRegs, X, blockNum, steps) {
        // Round selection arrays
        const rl = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
                   7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,
                   3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,
                   1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,
                   4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
                   
        const rr = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,
                   6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,
                   15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,
                   8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,
                   12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
                   
        const sl = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,
                   7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,
                   11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,
                   11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,
                   9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
                   
        const sr = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,
                   9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,
                   9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,
                   15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,
                   8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];

        const functions = ['F', 'G', 'H', 'I', 'J'];
        const constants = [
            [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e],
            [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]
        ];

        // Copy initial values
        let al = leftRegs.a, bl = leftRegs.b, cl = leftRegs.c, dl = leftRegs.d, el = leftRegs.e;
        let ar = rightRegs.a, br = rightRegs.b, cr = rightRegs.c, dr = rightRegs.d, er = rightRegs.e;

        // 80 rounds for each lane
        for (let i = 0; i < 80; i++) {
            const round = Math.floor(i / 16);
            
            // Left lane operation
            let fl, kleft;
            switch (round) {
                case 0: fl = this.f(bl, cl, dl); kleft = 0x00000000; break;
                case 1: fl = this.g(bl, cl, dl); kleft = 0x5a827999; break;
                case 2: fl = this.h(bl, cl, dl); kleft = 0x6ed9eba1; break;
                case 3: fl = this.i(bl, cl, dl); kleft = 0x8f1bbcdc; break;
                case 4: fl = this.j(bl, cl, dl); kleft = 0xa953fd4e; break;
            }
            
            const tl = (al + fl + X[rl[i]] + kleft) >>> 0;
            al = el; el = dl; dl = this.rotateLeft(cl, 10); cl = bl;
            bl = (this.rotateLeft(tl, sl[i]) + el) >>> 0;
            
            // Right lane operation
            let fr, kright;
            switch (round) {
                case 0: fr = this.j(br, cr, dr); kright = 0x50a28be6; break;
                case 1: fr = this.i(br, cr, dr); kright = 0x5c4dd124; break;
                case 2: fr = this.h(br, cr, dr); kright = 0x6d703ef3; break;
                case 3: fr = this.g(br, cr, dr); kright = 0x7a6d76e9; break;
                case 4: fr = this.f(br, cr, dr); kright = 0x00000000; break;
            }
            
            const tr = (ar + fr + X[rr[i]] + kright) >>> 0;
            ar = er; er = dr; dr = this.rotateLeft(cr, 10); cr = br;
            br = (this.rotateLeft(tr, sr[i]) + er) >>> 0;
            
            // Record step
            steps.push({
                step: i + 1,
                round: round + 1,
                function: functions[round],
                leftLane: {
                    a: al, b: bl, c: cl, d: dl, e: el,
                    operation: `${functions[round]}(0x${bl.toString(16)}, 0x${cl.toString(16)}, 0x${dl.toString(16)})`,
                    word: `X[${rl[i]}] = 0x${X[rl[i]].toString(16)}`,
                    constant: `0x${kleft.toString(16)}`,
                    shift: sl[i]
                },
                rightLane: {
                    a: ar, b: br, c: cr, d: dr, e: er,
                    operation: `${functions[4-round]}(0x${br.toString(16)}, 0x${cr.toString(16)}, 0x${dr.toString(16)})`,
                    word: `X[${rr[i]}] = 0x${X[rr[i]].toString(16)}`,
                    constant: `0x${kright.toString(16)}`,
                    shift: sr[i]
                },
                blockNum
            });
        }
        
        return {
            left: {a: al, b: bl, c: cl, d: dl, e: el},
            right: {a: ar, b: br, c: cr, d: dr, e: er}
        };
    }

    displayResult(hash) {
        const hexString = Array.from(hash).map(b => 
            b.toString(16).padStart(2, '0')).join('');
        
        this.finalHash.textContent = hexString;
        this.hashHex.textContent = `Hex: ${hexString}`;
    }

    startStepMode() {
        if (this.steps.length === 0) return;
        
        this.playPauseButton.disabled = false;
        this.nextStepButton.disabled = false;
        this.stepButton.disabled = true;
        
        // Reset to beginning
        this.currentStep = 0;
        this.updateStepDisplay();
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.playPauseButton.textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';
        
        if (this.isPlaying) {
            this.playAnimation();
        }
    }

    playAnimation() {
        if (!this.isPlaying || this.currentStep >= this.totalSteps) {
            this.isPlaying = false;
            this.playPauseButton.textContent = '▶ Play';
            return;
        }
        
        this.nextStep();
        setTimeout(() => this.playAnimation(), this.animationSpeed);
    }

    nextStep() {
        if (this.currentStep >= this.totalSteps) return;
        
        const step = this.steps[this.currentStep];
        this.displayStep(step);
        
        this.currentStep++;
        this.updateStepDisplay();
        
        if (this.currentStep >= this.totalSteps) {
            this.isPlaying = false;
            this.playPauseButton.textContent = '▶ Play';
        }
    }

    displayStep(step) {
        // Update round information
        this.currentRound.textContent = step.round;
        this.currentFunction.textContent = step.function;
        this.currentConstant.textContent = step.leftLane.constant;
        
        // Store previous values for change detection
        const prevLeftValues = Object.keys(this.leftRegisters).reduce((acc, reg) => {
            acc[reg] = parseInt(this.leftRegisters[reg].textContent, 16);
            return acc;
        }, {});
        
        const prevRightValues = Object.keys(this.rightRegisters).reduce((acc, reg) => {
            acc[reg] = parseInt(this.rightRegisters[reg].textContent, 16);
            return acc;
        }, {});
        
        // Update left lane registers
        this.updateRegister(this.leftRegisters.a, step.leftLane.a);
        this.updateRegister(this.leftRegisters.b, step.leftLane.b);
        this.updateRegister(this.leftRegisters.c, step.leftLane.c);
        this.updateRegister(this.leftRegisters.d, step.leftLane.d);
        this.updateRegister(this.leftRegisters.e, step.leftLane.e);
        
        // Update right lane registers
        this.updateRegister(this.rightRegisters.a, step.rightLane.a);
        this.updateRegister(this.rightRegisters.b, step.rightLane.b);
        this.updateRegister(this.rightRegisters.c, step.rightLane.c);
        this.updateRegister(this.rightRegisters.d, step.rightLane.d);
        this.updateRegister(this.rightRegisters.e, step.rightLane.e);
        
        // Update binary displays with change detection
        Object.keys(this.leftRegisters).forEach(reg => {
            const newValue = step.leftLane[reg];
            const changedBits = this.findChangedBits(prevLeftValues[reg], newValue);
            const binary = this.toBinaryString(newValue);
            this.updateBinaryDisplay(this.leftRegistersBinary[reg], binary, changedBits);
        });
        
        Object.keys(this.rightRegisters).forEach(reg => {
            const newValue = step.rightLane[reg];
            const changedBits = this.findChangedBits(prevRightValues[reg], newValue);
            const binary = this.toBinaryString(newValue);
            this.updateBinaryDisplay(this.rightRegistersBinary[reg], binary, changedBits);
        });
        
        // Update operations
        this.leftOperation.innerHTML = `
            <strong>Function:</strong> ${step.leftLane.operation}<br>
            <strong>Word:</strong> ${step.leftLane.word}<br>
            <strong>Constant:</strong> ${step.leftLane.constant}<br>
            <strong>Shift:</strong> ${step.leftLane.shift}
        `;
        
        this.rightOperation.innerHTML = `
            <strong>Function:</strong> ${step.rightLane.operation}<br>
            <strong>Word:</strong> ${step.rightLane.word}<br>
            <strong>Constant:</strong> ${step.rightLane.constant}<br>
            <strong>Shift:</strong> ${step.rightLane.shift}
        `;
        
        // Update gate visualization if enabled
        if (this.showGateView) {
            this.renderGateVisualization();
        }
    }

    updateRegister(element, value) {
        const newValue = '0x' + value.toString(16).padStart(8, '0');
        if (element.textContent !== newValue) {
            element.textContent = newValue;
            element.classList.add('changed');
            setTimeout(() => element.classList.remove('changed'), 500);
        }
    }

    updateBinaryDisplay(element, binaryString, changedBits = []) {
        // Clear existing content
        element.innerHTML = '';
        
        // Create individual bit elements
        for (let i = 0; i < binaryString.length; i++) {
            const bitSpan = document.createElement('span');
            bitSpan.className = 'bit';
            bitSpan.textContent = binaryString[i];
            bitSpan.dataset.bitIndex = i;
            
            // Add click handler for bit inspection
            bitSpan.addEventListener('click', () => this.inspectBit(i, binaryString[i]));
            
            // Highlight changed bits
            if (changedBits.includes(i)) {
                bitSpan.classList.add('changed');
            }
            
            element.appendChild(bitSpan);
        }
    }

    // Convert 32-bit number to binary string
    toBinaryString(value) {
        return (value >>> 0).toString(2).padStart(32, '0');
    }

    // Find changed bits between two values
    findChangedBits(oldValue, newValue) {
        const oldBinary = this.toBinaryString(oldValue);
        const newBinary = this.toBinaryString(newValue);
        const changedBits = [];
        
        for (let i = 0; i < 32; i++) {
            if (oldBinary[i] !== newBinary[i]) {
                changedBits.push(i);
            }
        }
        
        return changedBits;
    }

    // Enhanced control methods
    updateSpeed() {
        const speed = parseFloat(this.speedSlider.value);
        this.speedDisplay.textContent = speed.toFixed(1) + '×';
        this.animationSpeed = 1000 / speed;
    }

    increaseSpeed() {
        const currentSpeed = parseFloat(this.speedSlider.value);
        if (currentSpeed < 16) {
            this.speedSlider.value = Math.min(16, currentSpeed + 0.5);
            this.updateSpeed();
        }
    }

    decreaseSpeed() {
        const currentSpeed = parseFloat(this.speedSlider.value);
        if (currentSpeed > 0.1) {
            this.speedSlider.value = Math.max(0.1, currentSpeed - 0.5);
            this.updateSpeed();
        }
    }

    toggleGateView() {
        this.showGateView = !this.showGateView;
        if (this.showGateView) {
            this.gateSection.style.display = 'block';
            this.toggleViewButton.textContent = '📋 Toggle Register View';
            this.renderGateVisualization();
        } else {
            this.gateSection.style.display = 'none';
            this.toggleViewButton.textContent = '📊 Toggle Gate View';
        }
    }

    toggleEndianness() {
        this.littleEndian = !this.littleEndian;
        this.toggleEndianButton.textContent = this.littleEndian ? '🔄 Big Endian' : '🔄 Little Endian';
        // Refresh binary displays with new endianness
        this.refreshBinaryDisplays();
    }

    refreshBinaryDisplays() {
        // Re-render all binary displays with current endianness
        Object.keys(this.leftRegisters).forEach(reg => {
            const value = parseInt(this.leftRegisters[reg].textContent, 16);
            const binary = this.toBinaryString(value);
            this.updateBinaryDisplay(this.leftRegistersBinary[reg], binary);
            
            const rightValue = parseInt(this.rightRegisters[reg].textContent, 16);
            const rightBinary = this.toBinaryString(rightValue);
            this.updateBinaryDisplay(this.rightRegistersBinary[reg], rightBinary);
        });
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.displayStep(this.steps[this.currentStep]);
            this.updateStepDisplay();
            
            if (this.showGateView) {
                this.renderGateVisualization();
            }
        }
    }

    inspectBit(bitIndex, bitValue) {
        this.bitDetails.innerHTML = `
            <strong>Bit ${bitIndex}:</strong> ${bitValue}<br>
            <strong>Position:</strong> ${this.littleEndian ? bitIndex : 31 - bitIndex} (${this.littleEndian ? 'LE' : 'BE'})<br>
            <strong>Weight:</strong> 2^${bitIndex}<br>
            <strong>Dependency:</strong> Analyzing...
        `;
        
        // TODO: Add dependency analysis
        this.analyzeBitDependency(bitIndex);
    }

    analyzeBitDependency(bitIndex) {
        // Placeholder for dependency analysis
        setTimeout(() => {
            this.bitDetails.innerHTML += `<br><strong>Source:</strong> Input bit transformed through ${this.currentStep} operations`;
        }, 500);
    }

    zoomIn() {
        this.zoomLevel = Math.min(3.0, this.zoomLevel * 1.2);
        this.applyZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(0.5, this.zoomLevel / 1.2);
        this.applyZoom();
    }

    applyZoom() {
        const canvas = this.gateCanvas;
        canvas.style.transform = `scale(${this.zoomLevel})`;
        canvas.style.transformOrigin = 'top left';
    }

    toggleHighlightPath() {
        // TODO: Implement path highlighting
        console.log('Highlighting critical path...');
    }

    exportCurrentFrame() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Create export data
        const exportData = {
            timestamp: timestamp,
            step: this.currentStep,
            totalSteps: this.totalSteps,
            currentState: this.steps[this.currentStep] || null,
            registers: {
                left: Object.keys(this.leftRegisters).reduce((acc, reg) => {
                    acc[reg] = {
                        hex: this.leftRegisters[reg].textContent,
                        binary: this.toBinaryString(parseInt(this.leftRegisters[reg].textContent, 16))
                    };
                    return acc;
                }, {}),
                right: Object.keys(this.rightRegisters).reduce((acc, reg) => {
                    acc[reg] = {
                        hex: this.rightRegisters[reg].textContent,
                        binary: this.toBinaryString(parseInt(this.rightRegisters[reg].textContent, 16))
                    };
                    return acc;
                }, {})
            }
        };
        
        // Download as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ripemd160-step-${this.currentStep}-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    renderGateVisualization() {
        if (!this.showGateView || !this.steps[this.currentStep]) return;
        
        const canvas = this.gateCanvas;
        const step = this.steps[this.currentStep];
        
        // Clear canvas
        canvas.innerHTML = '';
        
        // Create SVG elements for current step visualization
        this.renderCurrentOperation(canvas, step);
    }

    renderCurrentOperation(canvas, step) {
        // Simple gate visualization for current operation
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(50, 50)');
        
        // Draw function gate (simplified)
        const functionRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        functionRect.setAttribute('x', '0');
        functionRect.setAttribute('y', '0');
        functionRect.setAttribute('width', '100');
        functionRect.setAttribute('height', '60');
        functionRect.setAttribute('rx', '10');
        functionRect.setAttribute('class', 'gate gate-xor');
        
        const functionLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        functionLabel.setAttribute('x', '50');
        functionLabel.setAttribute('y', '35');
        functionLabel.setAttribute('class', 'gate-label');
        functionLabel.textContent = step.function;
        
        g.appendChild(functionRect);
        g.appendChild(functionLabel);
        
        // Add some input/output wires
        const inputWire1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        inputWire1.setAttribute('x1', '-30');
        inputWire1.setAttribute('y1', '20');
        inputWire1.setAttribute('x2', '0');
        inputWire1.setAttribute('y2', '20');
        inputWire1.setAttribute('class', 'wire active');
        
        const inputWire2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        inputWire2.setAttribute('x1', '-30');
        inputWire2.setAttribute('y1', '40');
        inputWire2.setAttribute('x2', '0');
        inputWire2.setAttribute('y2', '40');
        inputWire2.setAttribute('class', 'wire active');
        
        const outputWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        outputWire.setAttribute('x1', '100');
        outputWire.setAttribute('y1', '30');
        outputWire.setAttribute('x2', '130');
        outputWire.setAttribute('y2', '30');
        outputWire.setAttribute('class', 'wire active');
        
        g.appendChild(inputWire1);
        g.appendChild(inputWire2);
        g.appendChild(outputWire);
        
        canvas.appendChild(g);
    }

    updateStepDisplay() {
        this.currentStepDisplay.textContent = `Step: ${this.currentStep}/${this.totalSteps}`;
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RIPEMD160Visualizer();
});