/* ============================================================
   BLACKMONO — script.js v2
   ============================================================ */

const lever   = document.getElementById('lever-line');
const gStatus = document.getElementById('gravity-status');
const lStatus = document.getElementById('lever-status');
const header  = document.getElementById('site-header');

// ── TORCIA (cave mask) ────────────────────────────────────

const updateTorch = (x, y) => {
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
};

document.addEventListener('mousemove', (e) => {
    updateTorch(
        (e.clientX / window.innerWidth) * 100,
        (e.clientY / window.innerHeight) * 100
    );
    pruneEntropy(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    updateTorch(
        (t.clientX / window.innerWidth) * 100,
        (t.clientY / window.innerHeight) * 100
    );
    pruneEntropy(t.clientX, t.clientY);
}, { passive: true });

// ── ENTROPY PRUNING ───────────────────────────────────────

function pruneEntropy(cx, cy) {
    const vault = document.getElementById('entropy-vault');
    const field = document.getElementById('entropy-field');
    if (!vault || !field) return;

    const r = vault.getBoundingClientRect();
    if (cy >= r.top && cy <= r.bottom) {
        const vx   = ((cx - r.left) / r.width) * 100;
        const vy   = ((cy - r.top)  / r.height) * 100;
        const mask = `radial-gradient(circle at ${vx}% ${vy}%, transparent 120px, black 300px)`;
        field.style.webkitMaskImage = mask;
        field.style.maskImage       = mask;
    }
}

// ── SCROLL: GRAVITY + HEADER ──────────────────────────────

window.addEventListener('scroll', () => {
    const scrolled      = window.pageYOffset;
    const maxScroll     = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? scrolled / maxScroll : 0;

    // Leva
    if (lever) lever.style.top = `${100 - scrollPercent * 100}%`;

    // Gravità
    if (gStatus) {
        const g = (9.81 - scrollPercent * 9.81).toFixed(2);
        if (parseFloat(g) <= 0.1) {
            gStatus.innerText   = 'ANTIGRAVITY: ACTIVATED';
            gStatus.style.color = '#00ffcc';
        } else {
            gStatus.innerText   = `GRAVITY: ${g} M/S²`;
            gStatus.style.color = 'var(--gold)';
        }
    }

    // Header: diventa solido dopo 60px
    if (header) header.classList.toggle('scrolled', scrolled > 60);
});

// ── FREQUENZE: HOVER → COLORE LEVA ───────────────────────

const freqColors = {
    picaresca: '#c9a96e',
    corale:    '#4fa8d5',
    logos:     '#5fd4b3',
    eterea:    '#b794f4',
    entropia:  '#f87171',
};

document.querySelectorAll('.freq-card').forEach((card) => {
    const freq  = card.dataset.freq;
    const color = freqColors[freq] || '#ffd900';

    card.addEventListener('mouseenter', () => {
        if (lever)   lever.style.backgroundColor = color;
        if (lStatus) {
            lStatus.innerText   = `FREQ: ${freq?.toUpperCase() ?? 'LOGOS'}`;
            lStatus.style.color = '#fff';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (lever)   lever.style.backgroundColor = '#ffd900';
        if (lStatus) {
            lStatus.innerText   = 'LEVER: STATIC';
            lStatus.style.color = 'var(--gold, #ffd900)';
        }
    });
});

// ── CALCOLATORE VEDICO (opzionale, non presente in index) ─

const vInput = document.getElementById('vedic-input');
const vBtn   = document.getElementById('solve-logos');
const vRes   = document.getElementById('calculator-res');

if (vBtn && vInput && vRes) {
    vBtn.addEventListener('click', () => {
        const n = parseInt(vInput.value, 10);
        if (isNaN(n)) { vRes.innerText = 'LOGOS_ERROR'; return; }

        if (n % 10 === 5) {
            const prev = Math.floor(n / 10);
            vRes.innerText = `${n}² = ${(prev * (prev + 1)) * 100 + 25} [Leva: ${prev}×${prev + 1}]`;
        } else {
            vRes.innerText = `${n}² = ${n * n}`;
        }
        vRes.style.opacity = '1';
    });
}
