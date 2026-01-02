// Language Management
let currentLang = localStorage.getItem('language') || 'en';

// Initialize language on page load
function initLanguage() {
    const html = document.documentElement;
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', 'ltr');
    applyTranslations(currentLang);
    updateLangToggle();
}

// Apply translations
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        // Skip typing elements - they will be handled by typing effect
        if (element.classList.contains('typing') || element.id === 'heroTitle' || element.id === 'heroSubtitle' || element.id === 'heroDescription') {
            return;
        }
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                element.value = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Update language toggle button
function updateLangToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
    }
}

// Language toggle functionality
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        localStorage.setItem('language', currentLang);
        applyTranslations(currentLang);
        updateLangToggle();
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Clear hero text first to prepare for typing effect
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroDescription = document.getElementById('heroDescription');
    
    if (heroTitle && heroSubtitle && heroDescription) {
        // Clear text immediately
        heroTitle.textContent = '';
        heroSubtitle.textContent = '';
        heroDescription.textContent = '';
    }
    
    initLanguage();
    
    // Initialize typing effect after language is set
    setTimeout(() => {
        if (heroTitle && heroSubtitle && heroDescription) {
            // Get the text from translations or use default
            const titleKey = heroTitle.getAttribute('data-translate');
            const subtitleKey = heroSubtitle.getAttribute('data-translate');
            const descriptionKey = heroDescription.getAttribute('data-translate');
            
            const titleText = translations[currentLang]?.[titleKey] || 'Bahar Habibi';
            const subtitleText = translations[currentLang]?.[subtitleKey] || 'Theatre artist, writer, and researcher';
            const descriptionText = translations[currentLang]?.[descriptionKey] || 'I study drama, language, and cognition while creating original plays and interdisciplinary projects that combine artistic practice with scientific research.';
            
            // Type title first
            typeText(heroTitle, titleText, 80, () => {
                // After title is done, type subtitle
                setTimeout(() => {
                    typeText(heroSubtitle, subtitleText, 60, () => {
                        // After subtitle is done, type description
                        setTimeout(() => {
                            typeText(heroDescription, descriptionText, 40);
                        }, 300);
                    });
                }, 300);
            });
        }
    }, 600);
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    const hamburgerElement = hamburger || document.querySelector('.hamburger');
    const navMenuElement = navMenu || document.querySelector('.nav-menu');

    if (hamburgerElement && navMenuElement) {
        hamburgerElement.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenuElement.classList.toggle('active');
            hamburgerElement.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenuElement.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenuElement.classList.remove('active');
                hamburgerElement.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenuElement.classList.contains('active') && 
                !navMenuElement.contains(e.target) && 
                !hamburgerElement.contains(e.target)) {
                navMenuElement.classList.remove('active');
                hamburgerElement.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle smooth scroll if it's an anchor on the same page
        if (href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Download Functionality
const downloadButtons = document.querySelectorAll('.btn-download');

downloadButtons.forEach(button => {
    button.addEventListener('click', function () {
        const fileName = this.getAttribute('data-file');

        if (!fileName) {
            console.warn('No file specified for download');
            return;
        }

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = `samples/${fileName}`;
        link.download = fileName;
        link.target = '_blank';

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show loading state
        const originalText = this.textContent;
        const downloadingText = currentLang === 'en' ? 'Downloading...' : 'Téléchargement...';
        this.textContent = downloadingText;
        this.disabled = true;
        this.style.opacity = '0.7';
        this.style.cursor = 'wait';
        
        // Simulate download delay and show success
        setTimeout(() => {
            const successText = currentLang === 'en' ? '✓ Downloaded' : '✓ Téléchargé';
            this.textContent = successText;
            this.style.background = '#10b981';
            
            setTimeout(() => {
                const downloadText = currentLang === 'en' ? 'Download File' : 'Télécharger le fichier';
                this.textContent = downloadText;
                this.style.opacity = '1';
                this.style.background = '';
                this.disabled = false;
                this.style.cursor = 'pointer';
            }, 2000);
        }, 1000);
    });
});

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.borderBottom = '1px solid var(--border-color)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.borderBottom = '1px solid var(--border-light)';
        }
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Projects Grid Animation
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Use Intersection Observer for fade-in
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cardObserver.observe(card);
    });
});

// Observe portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item-detailed');
portfolioItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Typing Effect for Hero Section
function typeText(element, text, speed = 100, callback) {
    if (!element) return;
    
    element.textContent = '';
    element.classList.add('typing');
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent = text.substring(0, i + 1);
            i++;
        } else {
            clearInterval(typeInterval);
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.classList.remove('typing');
            }, 500);
            if (callback) callback();
        }
    }, speed);
}

