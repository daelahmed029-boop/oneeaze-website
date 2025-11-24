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
document.getElementById('waitlist-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Show success message
        alert(`🎉 Thank you ${name}! You've been added to our waitlist. We'll notify you at ${email} when OneEaze launches!`);
        
        // Reset form
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Modal functions
function openDemo() {
    document.getElementById('demo-modal').style.display = 'block';
}

function closeDemo() {
    document.getElementById('demo-modal').style.display = 'none';
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.problem-card, .feature-card, .step, .waitlist-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Service cards interaction
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        const services = {
            shopping: '🛍️ Opening Shopping... Explore thousands of products!',
            food: '🍕 Opening Food Delivery... Browse restaurant partners!',
            payments: '💳 Opening Payments... Manage your wallet securely!'
        };
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Show service message
        const appFeature = document.querySelector('.app-feature h4');
        const originalText = appFeature.textContent;
        
        appFeature.textContent = services[service].split('...')[0] + '...';
        appFeature.nextElementSibling.textContent = services[service].split('...')[1];
        
        setTimeout(() => {
            appFeature.textContent = originalText;
            appFeature.nextElementSibling.textContent = 'Based on your preferences';
        }, 3000);
    });
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('demo-modal');
    if (e.target === modal) {
        closeDemo();
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDemo();
    }
});
