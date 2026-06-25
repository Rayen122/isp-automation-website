/* ISP AUTOMATION - 3D DYNAMIC ENHANCEMENT SCRIPT
   Advanced 3D interactions, GSAP ScrollTrigger, and physics-based motion */

console.log('🚀 Loading 3D Enhancement Script...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - Initializing 3D effects');
    
    // Register GSAP plugins if available
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        console.log('✅ GSAP and ScrollTrigger loaded');
    } else {
        console.warn('⚠️ GSAP not loaded - some animations may not work');
    }
    
    init3DEffects();
});

function init3DEffects() {
    console.log('🎯 Initializing 3D Effects...');
    
    // 1. MAGNETIC CURSOR (Desktop only)
    initMagneticCursor();
    
    // 2. 3D TILT ON MOUSE MOVE
    init3DTilt();
    
    // 3. GSAP SCROLL ANIMATIONS
    initScrollAnimations();
    
    // 4. ENHANCED PRODUCT FILTERS
    enhance3DFilters();
    
    // 5. FLOATING ANIMATIONS
    initFloatingBadges();
    
    // 6. RIPPLE EFFECTS
    initRipple();
    
    console.log('✅ All 3D effects initialized');
}

/* === MAGNETIC CURSOR (Desktop) === */
function initMagneticCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
        console.log('📱 Touch device detected - skipping magnetic cursor');
        return;
    }
    if (window.innerWidth < 1024) {
        console.log('📱 Small screen detected - skipping magnetic cursor');
        return;
    }

    console.log('🧲 Initializing magnetic cursor...');
    
    const targets = document.querySelectorAll('.btn-primary, .btn-outline, .btn-send, .nav-cta, .bento-card, .p-card');
    console.log(`Found ${targets.length} magnetic targets`);
    
    targets.forEach(target => {
        target.classList.add('magnetic');
        
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.max(rect.width, rect.height) / 2;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = x * 0.2 * force;
                const moveY = y * 0.2 * force;
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(target, {
                        x: moveX,
                        y: moveY,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    target.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            }
        });
        
        target.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(target, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            } else {
                target.style.transform = 'translate(0, 0)';
            }
        });
    });
}

/* === 3D TILT ON MOUSE MOVE === */
function init3DTilt() {
    if (window.innerWidth < 1024) {
        console.log('📱 Skipping 3D tilt on mobile');
        return;
    }

    console.log('🎭 Initializing 3D tilt effects...');
    
    const cards = document.querySelectorAll('.p-card, .bento-card, .contact-info-card, .contact-form-wrap');
    console.log(`Found ${cards.length} tiltable cards`);
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            } else {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            }
        });
    });
}

/* === GSAP SCROLL-TRIGGERED 3D ANIMATIONS === */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || !ScrollTrigger) {
        console.log('⚠️ GSAP or ScrollTrigger not available - skipping scroll animations');
        return;
    }

    console.log('📜 Initializing GSAP scroll animations...');

    // Hero parallax depth
    gsap.to('.hero-video', {
        y: '20%',
        scale: 1.1,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
        }
    });

    gsap.to('.hero-content', {
        y: '10%',
        opacity: 0.5,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Bento cards stagger
    gsap.from('.bento-card', {
        scrollTrigger: {
            trigger: '.bento-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        y: 80,
        rotationX: -20,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
    });

    // Product cards cascade
    ScrollTrigger.batch('.p-card', {
        onEnter: (batch) => {
            gsap.from(batch, {
                y: 60,
                rotationX: -15,
                opacity: 0,
                stagger: 0.08,
                duration: 0.8,
                ease: 'power2.out'
            });
        },
        start: 'top 85%'
    });
}

/* === ENHANCED PRODUCT FILTER WITH 3D === */
function enhance3DFilters() {
    console.log('🎛️ Initializing 3D product filters...');
    
    const filters = document.querySelectorAll('.prod-filter');
    const cards = document.querySelectorAll('.p-card');
    
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const cat = filter.dataset.cat;
            
            // Update active filter
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            cards.forEach((card, i) => {
                if (cat === 'all' || card.dataset.cat === cat) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 1,
                            scale: 1,
                            rotationY: 0,
                            duration: 0.6,
                            delay: i * 0.03,
                            ease: 'back.out(1.2)',
                            onStart: () => {
                                card.style.display = '';
                            }
                        });
                    } else {
                        card.style.display = '';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }
                } else {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.8,
                            rotationY: -30,
                            duration: 0.4,
                            ease: 'power2.in',
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

/* === FLOATING ANIMATION FOR BADGES === */
function initFloatingBadges() {
    console.log('🎈 Initializing floating badge animations...');
    
    if (typeof gsap !== 'undefined') {
        gsap.to('.about-exp-badge', {
            y: -8,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    } else {
        // CSS fallback
        const badges = document.querySelectorAll('.about-exp-badge');
        badges.forEach(badge => {
            badge.style.animation = 'float 4s ease-in-out infinite';
        });
    }
}

/* === RIPPLE CLICK EFFECT === */
function initRipple() {
    console.log('💧 Initializing ripple effects...');
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-send, .nav-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0,217,255,0.4) 0%, transparent 70%);
                pointer-events: none;
                animation: ripple-effect 0.6s ease-out;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-effect {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('📦 3D Enhancement Script Loaded - Waiting for DOM...');
