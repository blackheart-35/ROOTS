// --- SCREEN 2: LIVING KNOWLEDGE TREE - MASTER ANIMATION SCRIPT ---

const canvasWrapper = document.getElementById('canvasWrapper');
const canvasContent = document.getElementById('canvasContent');
const treeSVG = document.getElementById('treeSVG');
const nodesContainer = document.getElementById('nodesContainer');

// State
let panX = 0, panY = 0;
let defaultPanX = 0, defaultPanY = 0;
let scale = 1;
let isDragging = false;
let startX, startY;

// UI state
let aiOpen = false;

const COLORS = {
    web: 'rgba(26,255,140,0.55)',
    ai: 'rgba(0,212,255,0.55)',
    cyber: 'rgba(255,107,107,0.55)'
};

const treeData = {
    x: 1500, y: 1800,
    branches: [
        {
            id: 'b-left', name: 'Web Dev', color: COLORS.web,
            path: 'M 1500 1300 Q 1300 1000 1100 800',
            duration: 520, ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', delay: 1280,
            topics: [
                { id: 'html', x: 1350, y: 1100, label: 'HTML', state: 'done' },
                { id: 'css', x: 1220, y: 950, label: 'CSS', state: 'done' },
                { id: 'js', x: 1100, y: 800, label: 'JavaScript', state: 'active' }
            ]
        },
        {
            id: 'b-center', name: 'AI / ML', color: COLORS.ai,
            path: 'M 1500 1300 Q 1550 1100 1600 700',
            duration: 480, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', delay: 1320,
            topics: [
                { id: 'py', x: 1520, y: 1150, label: 'Python', state: 'done' },
                { id: 'math', x: 1560, y: 900, label: 'Math Basics', state: 'done' },
                { id: 'nn', x: 1600, y: 700, label: 'Neural Nets', state: 'locked' }
            ]
        },
        {
            id: 'b-right', name: 'Cybersecurity', color: COLORS.cyber,
            path: 'M 1500 1300 Q 1700 1200 1850 1000',
            duration: 560, ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', delay: 1360,
            topics: [
                { id: 'linux', x: 1600, y: 1180, label: 'Linux', state: 'done' },
                { id: 'net', x: 1750, y: 1080, label: 'Networking', state: 'locked' },
                { id: 'enc', x: 1850, y: 1000, label: 'Encryption', state: 'locked' }
            ]
        }
    ]
};

function getCanvasContentOffsets() {
    const cs = window.getComputedStyle(canvasContent);
    const left = Number.parseFloat(cs.left || '0') || 0;
    const top = Number.parseFloat(cs.top || '0') || 0;
    return { left, top };
}

function computeDefaultView() {
    const { left, top } = getCanvasContentOffsets();
    const aiShift = document.body.classList.contains('ai-open') ? 380 : 0;
    const vw = Math.max(320, window.innerWidth - aiShift);
    const vh = Math.max(320, window.innerHeight);

    // Place the tree base slightly above the ground plane
    const targetX = vw * 0.5;
    const targetY = vh * 0.82;

    defaultPanX = targetX - left - (treeData.x * 1);
    defaultPanY = targetY - top - (treeData.y * 1);
}

function applyDefaultView({ animate = false } = {}) {
    computeDefaultView();
    panX = defaultPanX;
    panY = defaultPanY;
    scale = 1;
    if (animate) {
        canvasContent.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        updateCanvas();
        setTimeout(() => (canvasContent.style.transition = 'none'), 500);
        return;
    }
    canvasContent.style.transition = 'none';
    updateCanvas();
}

// Start Sequence
function initBirthSequence() {
    // Ensure we start on the "growth point" of the tree
    applyDefaultView({ animate: false });
    
    setTimeout(() => { document.querySelector('.ground-plane').style.transition = 'width 0.3s ease-out'; document.querySelector('.ground-plane').style.width = '100%'; }, 80);
    setTimeout(() => { document.querySelector('.radial-glow').style.transition = 'opacity 0.6s ease-out'; document.querySelector('.radial-glow').style.opacity = '1'; }, 120);
    setTimeout(() => { document.querySelector('.noise-overlay').style.transition = 'opacity 0.4s linear'; document.querySelector('.noise-overlay').style.opacity = '0.03'; }, 200);
    
    // Particles (burst starting at 300ms)
    setTimeout(spawnParticles, 300);

    // Root pulses
    setTimeout(() => createRootRipple(120), 400);
    setTimeout(() => createRootRipple(200), 500);
    
    // Trunk Draw
    setTimeout(drawTrunk, 700);

    // Reveal UI
    setTimeout(() => { document.querySelectorAll('.control-panel, .controls-right-group').forEach(el => el.style.opacity='1'); }, 2500);
}

function spawnParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 40; i++) {
        let p = document.createElement('div');
        p.className = 'particle';
        
        let isWhite = Math.random() > 0.65;
        p.style.background = isWhite ? 'rgba(255,255,255,0.7)' : 'var(--accent-primary)';
        
        let driftY = Math.random() * 44 + 28; 
        p.style.width = p.style.height = (Math.random() * 1.5 + 1) + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.bottom = '-10px';
        
        p.style.setProperty('--max-opacity', (Math.random() * 0.2 + 0.12).toFixed(2));
        p.style.setProperty('--drift-x', (Math.random() * 20 - 10) + 'px');
        p.style.animationDuration = (window.innerHeight / driftY) + 's';
        p.style.animationDelay = (Math.random() * 3) + 's';
        
        let pc = Math.random();
        if(pc < 0.35) { p.style.left = (50 + (Math.random() * 10 - 5)) + 'vw'; }
        else if(pc < 0.75) { p.style.left = (50 + (Math.random() * 30 - 15)) + 'vw'; }
        
        container.appendChild(p);
    }
}

function createRootRipple(maxR) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.setAttribute('cx', '1500');
    svg.setAttribute('cy', '1800');
    svg.setAttribute('r', '0');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'rgba(26,255,140,0.5)');
    svg.setAttribute('stroke-width', '2');
    
    let g = document.querySelector('.tree-group');
    if(!g) return;
    g.appendChild(svg);
    
    svg.style.transition = 'all 0.5s ease-out';
    setTimeout(() => {
        svg.setAttribute('r', maxR.toString());
        svg.style.opacity = '0';
    }, 10);
    setTimeout(() => svg.remove(), 600);
}

function drawTrunk() {
    let trunk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    trunk.setAttribute('d', 'M 1500 1800 Q 1488 1500 1500 1300');
    trunk.setAttribute('class', 'path-trunk');
    let len = trunk.getTotalLength();
    trunk.style.strokeDasharray = len;
    trunk.style.strokeDashoffset = len;
    
    document.querySelector('.tree-group').appendChild(trunk);

    // Growing Dot
    let dot = document.createElement('div');
    dot.style.cssText = `position:absolute; width:8px; height:8px; background:#1aff8c; border-radius:50%; filter:blur(3px); z-index:25;`;
    nodesContainer.appendChild(dot);
    
    trunk.animate([ { strokeDashoffset: len }, { strokeDashoffset: 0 } ], { duration: 500, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });
    dot.animate([ { transform: `translate(1495px, 1795px)` }, { transform: `translate(1495px, 1295px)` } ], { duration: 500, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });

    setTimeout(() => { 
        trunk.style.stroke = 'rgba(26,255,140,0.75)'; 
        dot.animate([ { transform: `translate(1495px, 1295px) scale(2.5)`, opacity:0 } ], { duration: 200, fill: 'forwards' });
    }, 500);

    setTimeout(drawBranches, 500);
}

function drawBranches() {
    let groupBase = document.querySelector('.tree-group');
    
    treeData.branches.forEach((b) => {
        let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', `branch-g-${b.id.split('-')[1]}`);
        groupBase.appendChild(g);

        setTimeout(() => {
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', b.path);
            path.setAttribute('class', `path-${b.id}`);
            let len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            g.appendChild(path);
            
            path.animate([ { strokeDashoffset: len }, { strokeDashoffset: 0 } ], { duration: b.duration, easing: b.ease, fill: 'forwards' });
            
            // Nodes bloom
            setTimeout(() => {
                b.topics.forEach((t, i) => {
                    setTimeout(() => spawnNode(t, b.name), i * 80);
                });
            }, b.duration - 100);

        }, b.delay - 1200); // Because drawBranches is called at 1200ms mark
    });

    // Idle activates at 2800ms
    setTimeout(() => {
        groupBase.classList.add('idle-trunk');
        document.querySelector('.branch-g-left')?.classList.add('idle-b-left');
        document.querySelector('.branch-g-center')?.classList.add('idle-b-center');
        document.querySelector('.branch-g-right')?.classList.add('idle-b-right');
        document.querySelectorAll('.tree-node:not(.node-locked)').forEach(n => {
            n.style.animation = `nodeBreath ${Math.random()*2+3}s ease-in-out infinite`;
            n.style.animationDelay = `${Math.random()}s`;
        });
    }, 1600); // 1200 + 1600 = 2800
}

function spawnNode(t, branchName) {
    let btn = document.createElement('div');
    btn.className = `tree-node node-${t.state}`;
    btn.style.left = t.x + 'px';
    btn.style.top = t.y + 'px';
    btn.innerHTML = `
        ${t.state === 'locked' ? `<i class="ph-fill ph-lock-key" style="color:#555"></i>` : (t.label.length < 5 ? t.label : t.label.substring(0,3))}
        <div class="node-tooltip">
            <span style="color:var(--text-primary);font-weight:600">${t.label}</span><br>
            <span style="font-size:11px;color:rgba(255,255,255,0.4)">${branchName}</span>
        </div>
        <div class="node-lbl-text">${t.label}</div>
    `;

    nodesContainer.appendChild(btn);

    // Spring Animation Math
    btn.animate([ 
        { transform: `translate(-50%, -50%) scale(0)`, opacity:1 }, 
        { transform: `translate(-50%, -50%) scale(1.18)`, opacity:1 }, 
        { transform: `translate(-50%, -50%) scale(0.95)`, opacity:1 },
        { transform: `translate(-50%, -50%) scale(1)`, opacity:1 } 
    ], { duration: 280, easing: 'linear', fill: 'forwards' });

    // Node state styles
    if (t.state === 'active') {
        let tag = document.createElement('div');
        tag.style.cssText = "position:absolute; top:-24px; font-size:10px; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:10px; color:#fff;";
        tag.innerText = "You are here";
        btn.appendChild(tag);
        
        // Inner ring SVG
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = "position:absolute; inset:-30px; width:120px; height:120px; pointer-events:none;";
        svg.innerHTML = `<circle cx="60" cy="60" r="30" fill="none" stroke="rgba(26,255,140,0.8)" stroke-width="2" style="animation:sonarRing 2s ease-out infinite"/><circle cx="60" cy="60" r="28" fill="none" stroke="#1aff8c" stroke-width="1.5" style="animation:nodeBreath 2s infinite"/>`;
        btn.appendChild(svg);
    } else if (t.state === 'done') {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = "position:absolute; inset:-40px; width:128px; height:128px; pointer-events:none; z-index:-1;";
        svg.innerHTML = `<circle cx="64" cy="64" r="24" fill="none" stroke="rgba(26,255,140,0.6)" stroke-width="1.5" style="animation:sonarRing 3s ease-out infinite"/>`;
        btn.appendChild(svg);
    }

    if(t.state !== 'locked') {
        btn.onclick = (e) => triggerNodeFocus(e, t, btn, branchName);
    }

    setTimeout(() => { btn.querySelector('.node-lbl-text').style.opacity = '1'; btn.querySelector('.node-lbl-text').style.transform = 'translateY(0)'; }, 100);
}

// 4.1 - 4.6 Complex Interaction Sequence
function triggerNodeFocus(e, topic, el, branchName) {
    e.stopPropagation();
    
    // Step 1: Ripple
    let svgR = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgR.setAttribute('style', `position:absolute; left:${topic.x - 72}px; top:${topic.y - 72}px; width:144px; height:144px; pointer-events:none; z-index:45;`);
    svgR.innerHTML = `<circle cx="72" cy="72" r="24" class="ripple-ring"/><circle cx="72" cy="72" r="24" class="ripple-ring" style="animation-delay:0.08s; stroke:rgba(26,255,140,0.35); animation-duration:0.5s;"/>`;
    nodesContainer.appendChild(svgR);
    setTimeout(() => svgR.remove(), 600);

    // Step 2 & 3: Dim world
    document.querySelectorAll('.tree-node').forEach(n => { if(n !== el) n.classList.add('dimmed'); });
    document.querySelector('.path-trunk').classList.add('dimmed');
    document.querySelectorAll('.tree-group > g > path').forEach(p => p.classList.add('dimmed'));
    
    // Step 4: Pan & Zoom
    scale = 1.2;
    // target center offsets
    let tx = window.innerWidth / 2 - 170; // Offset left for panel
    let ty = window.innerHeight / 2.5;
    panX = tx - (topic.x * scale);
    panY = ty - (topic.y * scale);
    canvasContent.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    updateCanvas();
    
    // Step 6: Slide Panel
    let panel = document.getElementById('nodePanel');
    panel.classList.remove('closing');
    panel.classList.add('open');
    document.getElementById('panelTitle').innerText = topic.label;
    document.getElementById('panelBranchPill').innerText = branchName;
}

// Global Canvas Collapse
window.addEventListener('click', (e) => {
    if(e.target.closest('.side-panel') || e.target.closest('.tree-node') || e.target.closest('.control-panel')) return;
    
    // Revert visual scaling
    document.querySelectorAll('.tree-node, .path-trunk, .tree-group > g > path').forEach(el => el.classList.remove('dimmed'));
    
    let panel = document.getElementById('nodePanel');
    if(panel.classList.contains('open')) {
        panel.classList.remove('open');
        panel.classList.add('closing');
    }
    
    // Revert pan to default view
    canvasContent.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    computeDefaultView();
    scale = 1; panX = defaultPanX; panY = defaultPanY;
    updateCanvas();
    
    // Remove transition so drag is 1:1 again
    setTimeout(() => { canvasContent.style.transition = 'none'; }, 500);
});

// Canvas Pan Drag
canvasWrapper.addEventListener('mousedown', e => {
    if(e.target.closest('.tree-node') || e.target.closest('.side-panel') || e.target.closest('.ai-panel')) return;
    isDragging = true; startX = e.clientX - panX; startY = e.clientY - panY;
    canvasContent.style.transition = 'none';
});
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX = e.clientX - startX; panY = e.clientY - startY;
    updateCanvas();
});
canvasWrapper.addEventListener('wheel', e => {
    e.preventDefault();
    if(e.deltaY < 0) scale *= 1.08; else scale /= 1.08;
    if(scale < 0.5) scale = 0.5; if(scale > 3) scale = 3;
    canvasContent.style.transition = 'transform 0.2s ease-out';
    updateCanvas();
    setTimeout(() => canvasContent.style.transition = 'none', 200);
});

function updateCanvas() { canvasContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`; }

// --- Inline-handler functions referenced by tree.html ---
function zoomCanvas(delta) {
    const next = Math.min(3, Math.max(0.5, scale + delta));
    if (next === scale) return;
    scale = next;
    canvasContent.style.transition = 'transform 0.2s ease-out';
    updateCanvas();
    setTimeout(() => (canvasContent.style.transition = 'none'), 200);
}

function resetCanvas() {
    applyDefaultView({ animate: true });
}

function closeNodePanel() {
    const panel = document.getElementById('nodePanel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.classList.add('closing');
    document.querySelectorAll('.tree-node, .path-trunk, .tree-group > g > path').forEach(el => el.classList.remove('dimmed'));
    setTimeout(() => panel.classList.remove('closing'), 450);
}

function toggleAI(forceState) {
    const panel = document.getElementById('aiPanel');
    if (!panel) return;

    aiOpen = typeof forceState === 'boolean' ? forceState : !aiOpen;
    panel.classList.toggle('open', aiOpen);
    document.body.classList.toggle('ai-open', aiOpen);

    // Keep panel from intercepting drag when closed
    panel.style.pointerEvents = aiOpen ? 'auto' : 'none';

    if (aiOpen) {
        const input = document.getElementById('aiInput');
        setTimeout(() => input?.focus(), 0);
    }
}

function sendAiMessage() {
    const input = document.getElementById('aiInput');
    const messages = document.getElementById('aiMessages');
    if (!input || !messages) return;

    const text = (input.value || '').trim();
    if (!text) return;

    // Remove empty state if present
    const empty = messages.querySelector('.ai-empty-state');
    if (empty) empty.remove();

    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg ai-msg-user';
    userMsg.textContent = text;
    messages.appendChild(userMsg);

    input.value = '';
    input.style.height = 'auto';

    // Lightweight demo reply
    const botMsg = document.createElement('div');
    botMsg.className = 'ai-msg ai-msg-bot';
    botMsg.textContent = `Got it — want a quick explanation, a quiz, or next steps for: "${text}"?`;
    setTimeout(() => {
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 250);

    messages.scrollTop = messages.scrollHeight;
}

// Expose for inline onclick="" handlers (defensive for strict-mode bundlers)
window.zoomCanvas = zoomCanvas;
window.resetCanvas = resetCanvas;
window.closeNodePanel = closeNodePanel;
window.toggleAI = toggleAI;
window.sendAiMessage = sendAiMessage;

// Panel Setup
document.getElementById('panelRing').style.strokeDashoffset = '100'; // Initial

window.onload = () => {
    document.querySelector('.tree-group').innerHTML = '';
    initBirthSequence();

    // Open AI panel when linked with #ai
    if (window.location.hash && window.location.hash.toLowerCase() === '#ai') {
        toggleAI(true);
    }
};

window.addEventListener('resize', () => {
    const panelOpen = document.getElementById('nodePanel')?.classList.contains('open');
    if (isDragging || panelOpen || scale !== 1) return;
    applyDefaultView({ animate: false });
});
