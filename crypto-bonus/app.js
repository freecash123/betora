/* ============================================
   CryptoBoost â€” Interactive Features
   ============================================ */

// --- Particles ---
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['#a855f7', '#6366f1', '#22d3ee', '#c084fc', '#7c3aed'];
    const count = 60;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 20) + 's';
        particle.style.opacity = (Math.random() * 0.06 + 0.02);
        container.appendChild(particle);
    }
})();

// --- Counter Animation ---
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            counter.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    });
}

// --- Intersection Observer for Counters ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.counter').forEach(counter => {
    observer.observe(counter);
});

// --- Coin Tab Switching ---
const coinTabs = document.querySelectorAll('.coin-tab');
const walletCards = document.querySelectorAll('.wallet-card');

coinTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const coin = tab.getAttribute('data-coin');
        coinTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        walletCards.forEach(card => card.classList.remove('active'));
        const activeCard = document.getElementById('wallet-' + coin);
        if (activeCard) activeCard.classList.add('active');
    });
});

// --- QR Code Generation ---
function generateQRCodes() {
    if (typeof QRCode === 'undefined') {
        setTimeout(generateQRCodes, 300);
        return;
    }
    const addresses = {
        btc: 'bc1ql9j624q07ml9xpccx7t79hu9khcleyy03x9pxv',
        eth: '0x06C4A6cE5f5D318dc92855B187Ea684D2663a20D',
        ltc: 'ltc1qnh8gfs265dag0g6wn88f5sdxlra7ersg6tp2vs',
        doge: 'DHC3A7uncFJpCMucx7ZFpT4gMCpRrSkfKz'
    };
    Object.entries(addresses).forEach(([coin, address]) => {
        const canvas = document.getElementById('qr-' + coin);
        if (canvas) {
            QRCode.toCanvas(canvas, address, {
                width: 160, margin: 1,
                color: { dark: '#0a0a0f', light: '#ffffff' }
            }, (err) => { if (err) console.warn('QR error', coin, err); });
        }
    });
}
generateQRCodes();

// --- Copy Address ---
function copyAddress(button) {
    const address = button.getAttribute('data-address');
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => showCopySuccess(button));
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = address;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); showCopySuccess(button); }
        catch (e) { showCopySuccess(button); }
        document.body.removeChild(textarea);
    }
}

function showCopySuccess(button) {
    button.classList.add('copied');
    const span = button.querySelector('span');
    if (span) span.textContent = 'Copied!';
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
    setTimeout(() => { button.classList.remove('copied'); if (span) span.textContent = 'Copy'; }, 2000);
}

// --- FAQ Accordion ---
function toggleFaq(button) {
    const card = button.closest('.faq-card');
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.faq-card.open').forEach(c => c.classList.remove('open'));
    if (!isOpen) card.classList.add('open');
}

// --- Mobile Menu ---
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
}
function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileMenuToggle) {
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = ''; spans[1].style.opacity = ''; spans[2].style.transform = '';
    }
}

// --- Live Ticker Simulation ---
(function liveTicker() {
    const ta = document.getElementById('tickerAmount');
    const tw = document.getElementById('tickerWallet');
    const tt = document.getElementById('tickerTime');
    if (!ta || !tw || !tt) return;
    const amounts = ['$1,250', '$5,000', '$750', '$2,500', '$15,000', '$8,400', '$12,500', '$36,000', '$25,000'];
    const chars = '0123456789abcdef';
    function tick() {
        ta.textContent = amounts[Math.floor(Math.random() * amounts.length)];
        tw.textContent = '0x...' + Array.from({length: 4}, () => chars[Math.floor(Math.random() * 16)]).join('').toUpperCase() + 'A';
        tt.textContent = ['5 seconds ago', 'Just now', '3 seconds ago', '12 seconds ago'][Math.floor(Math.random() * 4)];
    }
    setInterval(tick, 4000); tick();
})();

// --- Live Depositors Count ---
(function() {
    const lc = document.getElementById('liveCount');
    if (!lc) return;
    let base = 12847;
    const step = () => { base += Math.floor(Math.random() * 7) + 1; lc.textContent = base.toLocaleString() + '+'; setTimeout(step, Math.random() * 8000 + 4000); };
    setTimeout(step, 3000);
})();

// --- Scroll header effect ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) header.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.5)' : 'none';
});

// --- Smooth scroll offset ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const pos = target.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    });
});

console.log('%cÂš€ CryptoBoost %CReady','font-size:18px;font-weight:bold;background:linear-gradient(135deg,#7c3aed,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;','color:#a1a1aa;');
