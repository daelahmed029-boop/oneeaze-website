// ===== OneEaze Professional Website JavaScript =====
// Version: 1.0.0
// Author: OneEaze Team

class OneEazeApp {
    constructor() {
        this.apiBaseUrl = 'https://your-backend-url.herokuapp.com/api'; // Will be updated after deployment
        this.currentUser = null;
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.loadWaitlistStats();
        this.setupScrollAnimations();
        this.setupServiceDemos();
        this.setupFormHandlers();
        this.setupMobileMenu();
        this.initializeAnimations();
        
        console.log('🚀 OneEaze Website Initialized');
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation scroll
        document.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    // ===== SCROLL HANDLING =====
    handleScroll() {
        this.toggleNavbarBackground();
        this.triggerScrollAnimations();
    }

    toggleNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;
        
        navbar.classList.toggle('scrolled', scrolled);
    }

    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // ===== MOBILE MENU =====
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== FORM HANDLING =====
    setupFormHandlers() {
        // Waitlist form
        const waitlistForm = document.getElementById('waitlistForm');
        if (waitlistForm) {
            waitlistForm.addEventListener('submit', this.handleWaitlistSubmit.bind(this));
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // Input validation
        this.setupInputValidation();
    }

    async handleWaitlistSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Get form data
        const formData = {
            name: document.getElementById('userName').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            phone: document.getElementById('userPhone').value.trim(),
            interest: document.getElementById('userInterest').value,
            referralCode: document.getElementById('referralCode').value.trim()
        };

        // Validate form
        if (!this.validateWaitlistForm(formData)) {
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining Waitlist...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual API endpoint)
            const response = await this.submitWaitlistForm(formData);
            
            if (response.success) {
                this.showSuccess('🎉 Successfully joined waitlist! You\'ll be notified when we launch.');
                this.updateWaitlistStats();
                form.reset();
                
                // Show confirmation modal with user details
                this.showWaitlistConfirmation(response.data);
            } else {
                throw new Error(response.message || 'Failed to join waitlist');
            }
        } catch (error) {
            console.error('Waitlist submission error:', error);
            this.showError(error.message || 'Failed to join waitlist. Please try again.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateWaitlistForm(data) {
        // Name validation
        if (!data.name || data.name.length < 2) {
            this.showError('Please enter a valid name (at least 2 characters)');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        // Interest validation
        if (!data.interest) {
            this.showError('Please select your primary interest');
            return false;
        }

        return true;
    }

    async submitWaitlistForm(formData) {
        // Simulate API call - Replace with actual fetch to your backend
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate mock response
                const waitlistPosition = Math.floor(Math.random() * 1000) + 2500;
                const earlyAccess = waitlistPosition <= 1000;
                
                resolve({
                    success: true,
                    message: 'Successfully joined waitlist!',
                    data: {
                        id: 'user_' + Date.now(),
                        name: formData.name,
                        email: formData.email,
                        waitlistPosition: waitlistPosition,
                        earlyAccess: earlyAccess,
                        referralCode: 'ONE' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                        joinDate: new Date().toISOString()
                    }
                });
            }, 1500);
        });

        // Actual API implementation (uncomment when backend is deployed):
        /*
        try {
            const response = await fetch(`${this.apiBaseUrl}/waitlist/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            return await response.json();
        } catch (error) {
            throw new Error('Network error. Please check your connection.');
        }
        */
    }

    handleContactSubmit(event) {
        event.preventDefault();
        this.showSuccess('Message sent! We\'ll get back to you within 24 hours.');
        event.target.reset();
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                this.validateInput(this);
            }.bind(this));

            // Clear validation on input
            input.addEventListener('input', function() {
                this.clearValidation(this);
            }.bind(this));
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && !value) {
            this.showInputError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'Please enter a valid email address');
                return false;
            }
        }

        this.clearInputError(input);
        return true;
    }

    showInputError(input, message) {
        this.clearInputError(input);
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearValidation(input) {
        this.clearInputError(input);
    }

    // ===== SERVICE DEMOS =====
    setupServiceDemos() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('click', (event) => {
                const service = event.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.showServiceDemo(service);
            });
        });
    }

    showServiceDemo(service) {
        const demos = {
            shopping: {
                title: '🛍️ Smart Shopping Experience',
                content: `
                    <div class="demo-content">
                        <div class="demo-animation">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h3>AI-Powered Shopping</h3>
                        <p>Discover products tailored to your preferences with our intelligent recommendation system.</p>
                        
                        <div class="demo-features">
                            <div class="demo-feature">
                                <i class="fas fa-robot"></i>
                                <div>
                                    <strong>Smart Recommendations</strong>
                                    <span>Based on your browsing history and preferences</span>
                                </div>
                            </div>
                            <div class="demo-feature">
                                <i class="fas fa-bolt"></i>
                                <div>
                                    <strong>Fast Delivery</strong>
                                    <span>Same-day delivery available in major cities</span>
                                </div>
                            </div>
                            <div class="demo-feature">
                                <i class="fas fa-shield-alt"></i>
                                <div>
                                    <strong>Secure Payments</strong>
                                    <span>Bank-level security for all transactions</span>
                                </div>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="closeModal()">
                            <i class="fas fa-thumbs-up"></i>
                            Looks Amazing!
                        </button>
                    </div>
                `
            },
            food: {
                title: '🍕 Seamless Food Delivery',
                content: `
                    <div class="demo-content">
                        <div class="demo-animation" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <h3>Restaurant Quality at Home</h3>
                        <p>Order from hundreds of restaurants with real-time tracking and exclusive deals.</p>
                        
                        <div class="demo-features">
                            <div class="demo-feature">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <strong>Live Tracking</strong>
                                    <span>Real-time order tracking on interactive map</span>
                                </div>
                            </div>
                            <div class="demo-feature">
                                <i class="fas fa-star"></i>
                                <div>
                                    <strong>Verified Reviews</strong>
                                    <span>Authentic ratings and reviews from real customers</span>
                                </div>
                            </div>
                            <div class="demo-feature">
                                <i class="fas fa-bolt"></i>
                                <div>
                                    <strong>Quick Delivery</strong>
                                    <span>Average delivery time under 30 minutes</span>
                                </div>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="closeModal()">
                            <i class="fas fa-pizza-slice"></i>
                            Can't Wait to Try!
                        </button>
                    </div>
                `
            },
            payments: {
                title: '💳 Unified Digital Wallet',
                content: `
                    <div class="demo-content">
                        <div class="demo-animation" style="background: linear-gradient(135deg, #10b981, #06b6d4);">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <h3>All Payments in One Place</h3>
                        <p>Manage all your financial transactions securely with our unified wallet system.</p>
                        
                        <div class="demo-features">
                            <div class="demo-feature">
                                <i class="fas fa-lock"></i>
                                <div>
                                    <strong>Bank-Level Security</strong>
                                    <span>256-bit encryption and fraud protection</span>
                                </div>
                            </div>
                            <div class="demo-feature">
                                <i class="fas fa-chart-line"></i>
                                <div>
                                    <strong>Spending Analytics</strong>
                                    <span>Track and analyze your expenses across all services</span>
                                </div>
                            </div>
                            <div class="demo-feature">
                                <i class="fas fa-sync"></i>
                                <div>
                                    <strong>Instant Transfers</strong>
                                    <span>Quick money transfers between accounts</span>
                                </div>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="closeModal()">
                            <i class="fas fa-check-circle"></i>
                            Secure & Convenient!
                        </button>
                    </div>
                `
            }
        };

        const demo = demos[service];
        if (demo) {
            this.showModal(demo.content);
        }
    }

    showFeatureDemo(feature) {
        this.showServiceDemo(feature);
    }

    showStepDemo(step) {
        const stepDemos = {
            1: `
                <div class="demo-content">
                    <div class="demo-animation">
                        <i class="fas fa-download"></i>
                    </div>
                    <h3>Step 1: Download & Sign Up</h3>
                    <p>Get started in under 2 minutes with our streamlined onboarding process.</p>
                    
                    <div class="step-demo-details">
                        <div class="step-demo-item">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Download from App Store or Google Play</span>
                        </div>
                        <div class="step-demo-item">
                            <i class="fas fa-user-plus"></i>
                            <span>Quick registration with email or social login</span>
                        </div>
                        <div class="step-demo-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure account verification</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" onclick="closeModal()">
                        <i class="fas fa-arrow-right"></i>
                        Next Step
                    </button>
                </div>
            `,
            2: `
                <div class="demo-content">
                    <div class="demo-animation" style="background: linear-gradient(135deg, #10b981, #06b6d4);">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <h3>Step 2: Set Up Your Wallet</h3>
                    <p>Add your payment methods once and use them securely across all services.</p>
                    
                    <div class="step-demo-details">
                        <div class="step-demo-item">
                            <i class="fas fa-credit-card"></i>
                            <span>Add credit/debit cards or bank account</span>
                        </div>
                        <div class="step-demo-item">
                            <i class="fas fa-lock"></i>
                            <span>256-bit encryption security</span>
                        </div>
                        <div class="step-demo-item">
                            <i class="fas fa-check-circle"></i>
                            <span>One-time setup for all services</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" onclick="closeModal()">
                        <i class="fas fa-arrow-right"></i>
                        Next Step
                    </button>
                </div>
            `,
            3: `
                <div class="demo-content">
                    <div class="demo-animation" style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">
                        <i class="fas fa-compass"></i>
                    </div>
                    <h3>Step 3: Start Exploring</h3>
                    <p>Discover the full power of OneEaze with all services at your fingertips.</p>
                    
                    <div class="step-demo-details">
                        <div class="step-demo-item">
                            <i class="fas fa-shopping-bag"></i>
                            <span>Shop thousands of products</span>
                        </div>
                        <div class="step-demo-item">
                            <i class="fas fa-utensils"></i>
                            <span>Order from favorite restaurants</span>
                        </div>
                        <div class="step-demo-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>Pay bills and transfer money</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" onclick="scrollToSection('waitlist')">
                        <i class="fas fa-rocket"></i>
                        Join Waitlist
                    </button>
                </div>
            `
        };

        this.showModal(stepDemos[step]);
    }

    // ===== MODAL SYSTEM =====
    showModal(content) {
        const modal = document.getElementById('demoModal');
        const modalContent = document.getElementById('modalContent');
        
        if (modal && modalContent) {
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // ===== NOTIFICATION SYSTEM =====
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.getElementById(type === 'success' ? 'successNotification' : 'errorNotification');
        const messageElement = document.getElementById(type === 'success' ? 'notificationMessage' : 'errorMessage');
        
        if (notification && messageElement) {
            messageElement.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }
    }

    // ===== WAITLIST MANAGEMENT =====
    async loadWaitlistStats() {
        try {
            // Simulate API call - Replace with actual fetch
            const stats = await this.fetchWaitlistStats();
            this.updateWaitlistUI(stats);
        } catch (error) {
            console.error('Failed to load waitlist stats:', error);
        }
    }

    async fetchWaitlistStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalUsers: 2547 + Math.floor(Math.random() * 100),
                    earlyAccessUsers: 547 + Math.floor(Math.random() * 50),
                    earlyAccessSpotsLeft: 453 - Math.floor(Math.random() * 50)
                });
            }, 1000);
        });

        // Actual implementation:
        /*
        try {
            const response = await fetch(`${this.apiBaseUrl}/waitlist/stats`);
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch waitlist statistics');
        }
        */
    }

    updateWaitlistUI(stats) {
        const totalElement = document.getElementById('waitlistCount');
        const earlyAccessElement = document.getElementById('earlyAccessCount');
        const totalUsersElement = document.getElementById('totalUsers');

        if (totalElement) totalElement.textContent = stats.totalUsers.toLocaleString();
        if (earlyAccessElement) earlyAccessElement.textContent = stats.earlyAccessSpotsLeft.toLocaleString();
        if (totalUsersElement) totalUsersElement.textContent = stats.totalUsers.toLocaleString() + '+';
    }

    updateWaitlistStats() {
        this.loadWaitlistStats();
    }

    showWaitlistConfirmation(userData) {
        const modalContent = `
            <div class="demo-content">
                <div class="demo-animation" style="background: linear-gradient(135deg, #10b981, #06b6d4);">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Welcome to OneEaze, ${userData.name}!</h3>
                <p>🎉 You're position <strong>#${userData.waitlistPosition}</strong> on our waitlist!</p>
                
                ${userData.earlyAccess ? 
                    '<p style="color: #10b981; font-weight: bold; font-size: 1.2em;">🌟 You qualified for early access!</p>' : 
                    `<p>Only <strong>${1000 - userData.waitlistPosition + 1}</strong> spots left for early access!</p>`
                }
                
                <div class="referral-section">
                    <h4>Share with Friends</h4>
                    <p>Your referral code: <strong>${userData.referralCode}</strong></p>
                    <div class="referral-actions">
                        <button class="btn btn-outline" onclick="copyToClipboard('${userData.referralCode}')">
                            <i class="fas fa-copy"></i>
                            Copy Code
                        </button>
                        <button class="btn btn-primary" onclick="shareReferral('${userData.referralCode}')">
                            <i class="fas fa-share"></i>
                            Share
                        </button>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="closeModal()">
                    <i class="fas fa-thumbs-up"></i>
                    Awesome!
                </button>
            </div>
        `;

        this.showModal(modalContent);
    }

    // ===== ANIMATIONS =====
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .problem-card, .step, .benefit').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-count');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/,/g, ''));
            if (!isNaN(target)) {
                this.animateCounter(counter, 0, target, 2000);
            }
        });
    }

    animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ===== UTILITY FUNCTIONS =====
    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth > 768) {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    handleKeydown(event) {
        // Close modal on Escape key
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ===== GLOBAL FUNCTIONS =====
// These are called from HTML onclick attributes

function scrollToSection(sectionId) {
    if (window.oneEazeApp) {
        window.oneEazeApp.scrollToSection(sectionId);
    }
}

function showServiceDemo(service) {
    if (window.oneEazeApp) {
        window.oneEazeApp.showServiceDemo(service);
    }
}

function showFeatureDemo(feature) {
    if (window.oneEazeApp) {
        window.oneEazeApp.showFeatureDemo(feature);
    }
}

function showStepDemo(step) {
    if (window.oneEazeApp) {
        window.oneEazeApp.showStepDemo(step);
    }
}

function openVideoModal() {
    if (window.oneEazeApp) {
        window.oneEazeApp.showModal(`
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-play-circle"></i>
                </div>
                <h3>OneEaze App Demo</h3>
                <p>Get a sneak peek of how OneEaze simplifies your digital life.</p>
                <div class="video-placeholder">
                    <i class="fas fa-video"></i>
                    <p>Demo video coming soon!</p>
                    <p>Experience the future of all-in-one convenience</p>
                </div>
                <button class="btn btn-primary" onclick="closeModal()">
                    <i class="fas fa-rocket"></i>
                    Join Waitlist to Get Early Access
                </button>
            </div>
        `);
    }
}

function closeModal() {
    if (window.oneEazeApp) {
        window.oneEazeApp.closeModal();
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        if (window.oneEazeApp) {
            window.oneEazeApp.showSuccess('Referral code copied to clipboard!');
        }
    }).catch(() => {
        if (window.oneEazeApp) {
            window.oneEazeApp.showError('Failed to copy referral code');
        }
    });
}

function shareReferral(code) {
    const shareText = `Join me on OneEaze - the all-in-one super app for shopping, food delivery, and payments! Use my referral code: ${code}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Join OneEaze',
            text: shareText,
            url: window.location.href
        });
    } else {
        copyToClipboard(shareText);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the OneEaze application
    window.oneEazeApp = new OneEazeApp();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .fade-in.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .demo-content {
            text-align: center;
            padding: 2rem;
        }
        
        .demo-animation {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            color: white;
            font-size: 3rem;
        }
        
        .demo-features {
            text-align: left;
            margin: 2rem 0;
        }
        
        .demo-feature {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 0.5rem;
        }
        
        .demo-feature i {
            color: #2563eb;
            font-size: 1.5rem;
            width: 40px;
        }
        
        .step-demo-details {
            text-align: left;
            margin: 2rem 0;
        }
        
        .step-demo-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 0.5rem;
        }
        
        .step-demo-item i {
            color: #10b981;
            font-size: 1.5rem;
            width: 40px;
        }
        
        .video-placeholder {
            background: #f8fafc;
            padding: 3rem 2rem;
            border-radius: 1rem;
            margin: 2rem 0;
        }
        
        .video-placeholder i {
            font-size: 4rem;
            color: #6b7280;
            margin-bottom: 1rem;
        }
        
        .referral-section {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 1rem;
            margin: 2rem 0;
        }
        
        .referral-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }
        
        input.error {
            border-color: #ef4444 !important;
        }
        
        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
});

// ===== SERVICE WORKER FOR PWA (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== PERFORMANCE MONITORING =====
// Track page load performance
window.addEventListener('load', function() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Error tracking
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// ===== EXPORTS FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OneEazeApp;
}
