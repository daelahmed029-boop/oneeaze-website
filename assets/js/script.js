// ===== OneEaze Professional Website JavaScript =====
// Version: 1.0.0
// Author: OneEaze Team

class OneEazeWebsite {
    constructor() {
        this.currentModal = null;
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupMobileMenu();
        this.setupFAQAccordion();
        this.setupFormHandlers();
        this.setupDemoInteractions();
        this.initializeAnimations();
        
        console.log('🚀 OneEaze Website Initialized');
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Mobile menu
        this.setupMobileMenuHandlers();
        
        // FAQ accordion
        this.setupFAQHandlers();
        
        // Form submissions
        this.setupFormHandlers();
    }

    // ===== SCROLL HANDLING =====
    handleScroll() {
        this.toggleNavbarBackground();
        this.triggerScrollAnimations();
    }

    toggleNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;
        
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }
    }

    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.feature-card, .problem-card, .step, .benefit-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    // ===== MOBILE MENU =====
    setupMobileMenu() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileClose = document.querySelector('.mobile-close');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    }

    setupMobileMenuHandlers() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (this.mobileMenu && this.mobileMenu.classList.contains('active') &&
                !this.mobileMenu.contains(event.target) &&
                !this.mobileMenuBtn.contains(event.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('active');
            document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===== FAQ ACCORDION =====
    setupFAQAccordion() {
        this.faqItems = document.querySelectorAll('.faq-item');
    }

    setupFAQHandlers() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    this.toggleFAQItem(item);
                });
            }
        });
    }

    toggleFAQItem(item) {
        // Close all other items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    }

    // ===== FORM HANDLING =====
    setupFormHandlers() {
        // Waitlist form
        const waitlistForm = document.getElementById('waitlistForm');
        if (waitlistForm) {
            waitlistForm.addEventListener('submit', this.handleWaitlistSubmit.bind(this));
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
            // Simulate API call
            await this.simulateWaitlistSubmission(formData);
            
            this.showSuccess('🎉 Successfully joined waitlist! You\'ll be notified when we launch.');
            form.reset();
            
            // Show confirmation
            this.showWaitlistConfirmation(formData);
            
        } catch (error) {
            console.error('Waitlist submission error:', error);
            this.showError('Failed to join waitlist. Please try again.');
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

    async simulateWaitlistSubmission(formData) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Waitlist submission simulated:', formData);
                resolve({
                    success: true,
                    message: 'Successfully joined waitlist!'
                });
            }, 2000);
        });
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            // Clear validation on input
            input.addEventListener('input', () => {
                this.clearValidation(input);
            });
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
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-sm)';
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

    // ===== DEMO INTERACTIONS =====
    setupDemoInteractions() {
        // Service cards in phone mockup
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (event) => {
                const service = event.currentTarget.querySelector('span').textContent.toLowerCase();
                this.showServiceDemo(service);
            });
        });

        // Demo tabs
        this.setupDemoTabs();
    }

    setupDemoTabs() {
        const demoTabs = document.querySelectorAll('.demo-tab');
        demoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                this.switchDemoTab(targetTab);
            });
        });
    }

    switchDemoTab(tabName) {
        // Update active tab
        const demoTabs = document.querySelectorAll('.demo-tab');
        demoTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            }
        });

        // Update active content
        const demoViews = document.querySelectorAll('.demo-view');
        demoViews.forEach(view => {
            view.classList.remove('active');
            if (view.id === `${tabName}-demo`) {
                view.classList.add('active');
            }
        });
    }

    // ===== MODAL SYSTEM =====
    showModal(content) {
        const modal = document.getElementById('demoModal');
        const modalContent = document.getElementById('modalContent');
        
        if (modal && modalContent) {
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.currentModal = modal;
        }
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.style.display = 'none';
            document.body.style.overflow = '';
            this.currentModal = null;
        }
    }

    // ===== SERVICE DEMOS =====
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
                        
                        <button class="btn btn-primary" onclick="oneEaze.closeModal()">
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
                        
                        <button class="btn btn-primary" onclick="oneEaze.closeModal()">
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
                        
                        <button class="btn btn-primary" onclick="oneEaze.closeModal()">
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
                    
                    <button class="btn btn-primary" onclick="oneEaze.showStepDemo(2)">
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
                    
                    <button class="btn btn-primary" onclick="oneEaze.showStepDemo(3)">
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
                    
                    <button class="btn btn-primary" onclick="oneEaze.scrollToSection('waitlist')">
                        <i class="fas fa-rocket"></i>
                        Join Waitlist
                    </button>
                </div>
            `
        };

        this.showModal(stepDemos[step]);
    }

    // ===== NOTIFICATION SYSTEM =====
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById(`${type}Notification`);
        if (!notification) {
            notification = document.createElement('div');
            notification.id = `${type}Notification`;
            notification.className = `notification ${type}`;
            document.body.appendChild(notification);
        }

        const messageElement = notification.querySelector('span') || notification.appendChild(document.createElement('span'));
        const icon = notification.querySelector('i') || notification.appendChild(document.createElement('i'));
        
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        messageElement.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // ===== WAITLIST CONFIRMATION =====
    showWaitlistConfirmation(userData) {
        const waitlistPosition = Math.floor(Math.random() * 1000) + 5000;
        const earlyAccess = waitlistPosition <= 1000;
        const referralCode = 'ONE' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const modalContent = `
            <div class="demo-content">
                <div class="demo-animation" style="background: linear-gradient(135deg, #10b981, #06b6d4);">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Welcome to OneEaze, ${userData.name}!</h3>
                <p>🎉 You're position <strong>#${waitlistPosition}</strong> on our waitlist!</p>
                
                ${earlyAccess ? 
                    '<p style="color: #10b981; font-weight: bold; font-size: 1.2em;">🌟 You qualified for early access!</p>' : 
                    `<p>Only <strong>${1000 - waitlistPosition + 1}</strong> spots left for early access!</p>`
                }
                
                <div class="referral-section">
                    <h4>Share with Friends</h4>
                    <p>Your referral code: <strong>${referralCode}</strong></p>
                    <div class="referral-actions">
                        <button class="btn btn-outline" onclick="oneEaze.copyToClipboard('${referralCode}')">
                            <i class="fas fa-copy"></i>
                            Copy Code
                        </button>
                        <button class="btn btn-primary" onclick="oneEaze.shareReferral('${referralCode}')">
                            <i class="fas fa-share"></i>
                            Share
                        </button>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="oneEaze.closeModal()">
                    <i class="fas fa-thumbs-up"></i>
                    Awesome!
                </button>
            </div>
        `;

        this.showModal(modalContent);
    }

    // ===== UTILITY FUNCTIONS =====
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            this.closeMobileMenu();
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Referral code copied to clipboard!');
        }).catch(() => {
            this.showError('Failed to copy referral code');
        });
    }

    shareReferral(code) {
        const shareText = `Join me on OneEaze - the all-in-one super app for shopping, food delivery, and payments! Use my referral code: ${code}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Join OneEaze',
                text: shareText,
                url: window.location.href
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    // ===== ANIMATIONS =====
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
    }

    setupCounterAnimations() {
        // Animate stats counters
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const text = counter.textContent;
            if (text.includes('+') || text.includes('K')) {
                // Don't animate already formatted numbers
                return;
            }
            
            const target = parseInt(text.replace(/,/g, ''));
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

    // ===== VIDEO MODAL =====
    openVideoModal() {
        const modalContent = `
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
                <button class="btn btn-primary" onclick="oneEaze.scrollToSection('waitlist')">
                    <i class="fas fa-rocket"></i>
                    Join Waitlist to Get Early Access
                </button>
            </div>
        `;
        this.showModal(modalContent);
    }
}

// ===== GLOBAL FUNCTIONS =====
// These are called from HTML onclick attributes

function scrollToSection(sectionId) {
    if (window.oneEaze) {
        window.oneEaze.scrollToSection(sectionId);
    }
}

function showServiceDemo(service) {
    if (window.oneEaze) {
        window.oneEaze.showServiceDemo(service);
    }
}

function showFeatureDemo(feature) {
    if (window.oneEaze) {
        window.oneEaze.showFeatureDemo(feature);
    }
}

function showStepDemo(step) {
    if (window.oneEaze) {
        window.oneEaze.showStepDemo(step);
    }
}

function openVideoModal() {
    if (window.oneEaze) {
        window.oneEaze.openVideoModal();
    }
}

function closeModal() {
    if (window.oneEaze) {
        window.oneEaze.closeModal();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the OneEaze application
    window.oneEaze = new OneEazeWebsite();
    
    // Add CSS for animations and demo styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
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

        /* Demo tabs */
        .demo-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border);
        }
        
        .demo-tab {
            background: none;
            border: none;
            padding: 0.75rem 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .demo-tab.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }
        
        .demo-view {
            display: none;
        }
        
        .demo-view.active {
            display: block;
        }

        /* Demo products */
        .demo-products {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .product-card {
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
        }
        
        .product-image {
            width: 60px;
            height: 60px;
            background: var(--border);
            border-radius: 0.375rem;
            margin: 0 auto 0.5rem;
        }
    `;
    document.head.appendChild(style);
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce scroll events
let scrollTimer;
window.addEventListener('scroll', function() {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(function() {
        // Scroll handling is done in the class
    }, 10);
});

// Preload critical resources
window.addEventListener('load', function() {
    // Add any preloading logic here
    console.log('OneEaze website loaded successfully!');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});
