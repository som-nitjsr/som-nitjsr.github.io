// Newsletter signup functionality
console.log('Newsletter script loaded successfully');

document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Simulate API call (replace with actual newsletter service)
            setTimeout(() => {
                // For now, we'll just show a success message
                // In production, you'd integrate with Mailchimp, ConvertKit, etc.
                showMessage('Thanks for subscribing! Check your email for confirmation.', 'success');
                emailInput.value = '';
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Track subscription (if using Google Analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'engagement',
                        'event_label': 'blog_post'
                    });
                }
            }, 1500);
        });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        padding: 0.75rem;
        margin-top: 1rem;
        border-radius: 4px;
        font-weight: 500;
        text-align: center;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    // Insert message after the form
    const newsletterSignup = document.querySelector('.newsletter-signup');
    if (newsletterSignup) {
        newsletterSignup.appendChild(messageDiv);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
}

// Social sharing analytics
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-share a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track social sharing (if using Google Analytics)
            if (typeof gtag !== 'undefined') {
                const platform = this.textContent.toLowerCase().replace(/[^a-z]/g, '');
                gtag('event', 'social_share', {
                    'event_category': 'engagement',
                    'event_label': platform
                });
            }
        });
    });
});

// Reading time calculation
function updateReadingTime() {
    const content = document.querySelector('.post-content');
    if (content) {
        const text = content.textContent || content.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed
        
        const readingTimeElement = document.querySelector('.reading-time');
        if (readingTimeElement) {
            readingTimeElement.textContent = `📖 ${readingTime} min read`;
        }
    }
}

// Initialize reading time on page load
document.addEventListener('DOMContentLoaded', updateReadingTime);
