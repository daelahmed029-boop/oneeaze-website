// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Waitlist form handling
document.getElementById('waitlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const interest = document.getElementById('userInterest').value;
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update waitlist count
        const currentCount = parseInt(document.getElementById('waitlistCount').textContent);
        document.getElementById('waitlistCount').textContent = (currentCount + 1).toLocaleString();
        
        // Show success message
        showModal(`
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Welcome to OneEaze, ${name}!</h3>
                <p>You've been added to our exclusive waitlist. We'll notify you at <strong>${email}</strong> when we launch.</p>
                <p>We see you're interested in <strong>${getInterestText(interest)}</strong> - we'll make sure you get early access!</p>
                <button class="btn btn-primary" onclick="closeModal()">Awesome!</button>
            </div>
        `);
        
        // Reset form
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

function getInterestText(interest) {
    const interests = {
        'shopping': 'Shopping',
        'food': 'Food Delivery', 
        'payments': 'Digital Payments',
        'all': 'All Services'
    };
    return interests[interest] || 'our services';
}

// Service demonstrations
function showService(service) {
    const services = {
        shopping: {
            title: '🛍️ Shopping Demo',
            content: 'Browse thousands of products, compare prices, and enjoy fast delivery - all within OneEaze!',
            icon: 'fas fa-shopping-bag'
        },
        food: {
            title: '🍕 Food Delivery Demo', 
            content: 'Order from your favorite restaurants with live tracking and quick delivery to your doorstep!',
            icon: 'fas fa-utensils'
        },
        payments: {
            title: '💳 Payments Demo',
            content: 'Securely pay bills, transfer money, and manage all your finances with our unified wallet!',
            icon: 'fas fa-wallet'
        }
    };
    
    const serviceInfo = services[service];
    const appDemo = document.getElementById('appDemo');
    
    // Update app demo display
    appDemo.innerHTML = `
        <h4>${serviceInfo.title}</h4>
        <p>${serviceInfo.content}</p>
        <div style="font-size: 2rem; margin: 1rem 0;">
            <i class="${serviceInfo.icon}"></i>
        </div>
    `;
    
    // Highlight active service card
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Feature demonstrations
function showFeatureDemo(feature) {
    const demos = {
        shopping: `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <h3>Smart Shopping Experience</h3>
                <p>Browse through categorized products with AI-powered recommendations based on your preferences.</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>🎯 Personalized product suggestions</li>
                    <li>🚚 Fast delivery tracking</li>
                    <li>⭐ Verified seller ratings</li>
                    <li>💳 Secure one-tap payments</li>
                </ul>
                <button class="btn btn-primary" onclick="closeModal()">Got it!</button>
            </div>
        `,
        food: `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-utensils"></i>
                </div>
                <h3>Seamless Food Delivery</h3>
                <p>Order from hundreds of restaurants with real-time tracking and exclusive deals.</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>📍 Live order tracking on map</li>
                    <li>🍽️ Restaurant reviews & ratings</li>
                    <li>⚡ Quick reorder from history</li>
                    <li>🎁 Exclusive member discounts</li>
                </ul>
                <button class="btn btn-primary" onclick="closeModal()">Looks delicious!</button>
            </div>
        `,
        payments: `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-wallet"></i>
                </div>
                <h3>Unified Digital Wallet</h3>
                <p>One secure wallet for all your transactions, bill payments, and money transfers.</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>🔒 Bank-level security encryption</li>
                    <li>💸 Instant bill payments</li>
                    <li>📊 Spending analytics</li>
                    <li>🎯 Smart savings features</li>
                </ul>
                <button class="btn btn-primary" onclick="closeModal()">Secure & Easy!</button>
            </div>
        `
    };
    
    showModal(demos[feature]);
}

// Step demonstrations
function showStepDemo(step) {
    const steps = {
        1: `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-download"></i>
                </div>
                <h3>Step 1: Download & Sign Up</h3>
                <p>Get started in under 2 minutes! Download the app and create your account with just basic information.</p>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                    <p><strong>App Store:</strong> Available on iOS and Android</p>
                    <p><strong>Sign Up:</strong> Email, phone, or social login</p>
                    <p><strong>Verification:</strong> Quick SMS or email confirmation</p>
                </div>
                <button class="btn btn-primary" onclick="closeModal()">Easy!</button>
            </div>
        `,
        2: `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-wallet"></i>
                </div>
                <h3>Step 2: Set Up Your Wallet</h3>
                <p>Add your payment method once and use it across all OneEaze services securely.</p>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                    <p><strong>Supported Methods:</strong> Credit/Debit cards, bank transfer</p>
                    <p><strong>Security:</strong> 256-bit encryption & fraud protection</p>
                    <p><strong>Convenience:</strong> One-time setup for all services</p>
                </div>
                <button class="btn btn-primary" onclick="closeModal()">Secure!</button>
            </div>
        `,
        3: `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-compass"></i>
                </div>
                <h3>Step 3: Start Exploring</h3>
                <p>Discover the full power of OneEaze - shop, order food, pay bills, and more in one app!</p>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                    <p><strong>Shopping:</strong> Thousands of products</p>
                    <p><strong>Food:</strong> Restaurant delivery</p>
                    <p><strong>Payments:</strong> Bills, transfers, top-ups</p>
                    <p><strong>AI Features:</strong> Personalized experience</p>
                </div>
                <button class="btn btn-primary" onclick="closeModal()">Let's Explore!</button>
            </div>
        `
    };
    
    showModal(steps[step]);
}

// General demo function
function showDemo() {
    showModal(`
        <div class="demo-content">
            <div class="demo-animation">
                <i class="fas fa-play"></i>
            </div>
            <h3>OneEaze App Overview</h3>
            <p>Experience the future of all-in-one convenience with our comprehensive app demo.</p>
            <div style="margin: 2rem 0;">
                <p>🚀 <strong>Coming Soon:</strong> Full interactive demo</p>
                <p>📱 <strong>Platforms:</strong> iOS & Android</p>
                <p>🎯 <strong>Launch:</strong> Q1 2024</p>
            </div>
            <button class="btn btn-primary" onclick="scrollToSection('waitlist')">Join Waitlist</button>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `);
}

// Modal functions
function showModal(content) {
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('demoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('demoModal').style.display = 'none';
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    closeModal();
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('demoModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animations to elements
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .step').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Initialize waitlist count animation
    animateCount();
});

function animateCount() {
    const countElement = document.getElementById('waitlistCount');
    let count = 1247;
    setInterval(() => {
        count += Math.floor(Math.random() * 3) + 1;
        countElement.textContent = count.toLocaleString();
    }, 5000);
}
