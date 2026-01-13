// Loading Indicator Functions
function showLoading(button) {
    if (!button) return;
    button.disabled = true;
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
}

function hideLoading(button) {
    if (!button) return;
    button.disabled = false;
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
    }
}

// Comment Toggle Functions - Define early so they're available
window.toggleCommentForm = function(achievementId) {
    console.log('toggleCommentForm called with:', achievementId);
    const formId = 'comment-form-' + achievementId;
    const form = document.getElementById(formId);
    console.log('Looking for form ID:', formId, 'Found:', form);
    if (form) {
        // Check if form is currently hidden
        const isHidden = form.style.display === 'none' || 
                        window.getComputedStyle(form).display === 'none' ||
                        form.style.display === '';
        console.log('Form isHidden:', isHidden, 'Current style.display:', form.style.display);
        
        // Toggle visibility
        if (isHidden) {
            form.style.display = 'block';
            console.log('Form shown, new display:', form.style.display);
            // Scroll to form after a brief delay
            setTimeout(() => {
                form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 50);
        } else {
            form.style.display = 'none';
            console.log('Form hidden');
        }
    } else {
        console.error('Form not found! ID:', formId);
        // Try to find all comment forms for debugging
        const allForms = document.querySelectorAll('[id^="comment-form"]');
        console.log('All comment forms found:', Array.from(allForms).map(f => ({ id: f.id, display: f.style.display })));
    }
};

window.toggleCommentFormPhilanthropic = function(philanthropicId) {
    console.log('toggleCommentFormPhilanthropic called with:', philanthropicId);
    const formId = 'comment-form-philanthropic-' + philanthropicId;
    const form = document.getElementById(formId);
    console.log('Looking for form ID:', formId, 'Found:', form);
    if (form) {
        // Check if form is currently hidden
        const isHidden = form.style.display === 'none' || 
                        window.getComputedStyle(form).display === 'none' ||
                        form.style.display === '';
        console.log('Form isHidden:', isHidden, 'Current style.display:', form.style.display);
        
        // Toggle visibility
        if (isHidden) {
            form.style.display = 'block';
            console.log('Form shown, new display:', form.style.display);
            // Scroll to form after a brief delay
            setTimeout(() => {
                form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 50);
        } else {
            form.style.display = 'none';
            console.log('Form hidden');
        }
    } else {
        console.error('Form not found! ID:', formId);
        // Try to find all comment forms for debugging
        const allForms = document.querySelectorAll('[id^="comment-form-philanthropic"]');
        console.log('All philanthropic comment forms found:', Array.from(allForms).map(f => ({ id: f.id, display: f.style.display })));
    }
};

window.toggleReplyForm = function(commentId) {
    const formId = 'reply-form-' + commentId;
    const form = document.getElementById(formId);
    if (form) {
        const currentDisplay = window.getComputedStyle(form).display;
        const isHidden = currentDisplay === 'none' || form.style.display === 'none';
        form.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            setTimeout(() => {
                form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
};

window.toggleReplyFormPhilanthropic = function(commentId) {
    const formId = 'reply-form-philanthropic-' + commentId;
    const form = document.getElementById(formId);
    if (form) {
        const currentDisplay = window.getComputedStyle(form).display;
        const isHidden = currentDisplay === 'none' || form.style.display === 'none';
        form.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            setTimeout(() => {
                form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
};

// Add loading to all forms on page load
document.addEventListener('DOMContentLoaded', function() {
    // Comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                showLoading(submitBtn);
            }
        });
    });

    // Message form
    const messageForm = document.querySelector('.message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            const submitBtn = messageForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                showLoading(submitBtn);
            }
        });
    }

    // Add event listeners to comment toggle buttons - More robust approach
    function setupCommentButtons() {
        const commentButtons = document.querySelectorAll('.btn-toggle-comments');
        console.log('Setting up comment buttons. Found:', commentButtons.length);
        
        commentButtons.forEach((button) => {
            // Remove any existing listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const achievementId = this.getAttribute('data-achievement-id');
                const philanthropicId = this.getAttribute('data-philanthropic-id');
                
                console.log('=== Comment Button Clicked ===');
                console.log('Achievement ID:', achievementId);
                console.log('Philanthropic ID:', philanthropicId);
                
                let form = null;
                let formId = null;
                
                if (achievementId) {
                    formId = 'comment-form-' + achievementId;
                    form = document.getElementById(formId);
                    // Fallback: find form in same section
                    if (!form) {
                        const section = this.closest('.comments-section');
                        if (section) {
                            form = section.querySelector('.comment-form-container');
                        }
                    }
                } else if (philanthropicId) {
                    formId = 'comment-form-philanthropic-' + philanthropicId;
                    form = document.getElementById(formId);
                    // Fallback: find form in same section
                    if (!form) {
                        const section = this.closest('.comments-section');
                        if (section) {
                            form = section.querySelector('.comment-form-container');
                        }
                    }
                }
                
                console.log('Form ID searched:', formId);
                console.log('Form found:', form);
                
                if (form) {
                    const currentDisplay = window.getComputedStyle(form).display;
                    const isHidden = currentDisplay === 'none';
                    console.log('Current computed display:', currentDisplay, 'isHidden:', isHidden);
                    
                    form.style.display = isHidden ? 'block' : 'none';
                    console.log('Form display set to:', form.style.display);
                    
                    if (isHidden) {
                        // Force reflow
                        form.offsetHeight;
                        setTimeout(() => {
                            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 50);
                    }
                } else {
                    console.error('Form not found!');
                    alert('Comment form not found. Please refresh the page.');
                }
            });
        });
    }
    
    // Setup buttons when DOM is ready
    setupCommentButtons();
    
    // Also setup after a short delay in case content loads dynamically
    setTimeout(setupCommentButtons, 500);

    // Cancel buttons for comment forms
    document.querySelectorAll('.cancel-comment-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const achievementId = this.getAttribute('data-achievement-id');
            const philanthropicId = this.getAttribute('data-philanthropic-id');
            
            if (achievementId) {
                window.toggleCommentForm(achievementId);
            } else if (philanthropicId) {
                window.toggleCommentFormPhilanthropic(philanthropicId);
            }
        });
    });

    // Add event listeners to reply buttons
    function setupReplyButtons() {
        const replyButtons = document.querySelectorAll('.btn-reply');
        console.log('Setting up reply buttons. Found:', replyButtons.length);
        
        replyButtons.forEach((button) => {
            // Remove any existing listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const commentId = this.getAttribute('data-comment-id');
                console.log('=== Reply Button Clicked ===');
                console.log('Comment ID:', commentId);
                
                if (commentId) {
                    // Try both form ID patterns
                    let form = document.getElementById('reply-form-' + commentId);
                    if (!form) {
                        form = document.getElementById('reply-form-philanthropic-' + commentId);
                    }
                    
                    // Fallback: find form in same comment item
                    if (!form) {
                        const commentItem = this.closest('.comment-item');
                        if (commentItem) {
                            form = commentItem.querySelector('.reply-form-container');
                        }
                    }
                    
                    console.log('Reply form found:', form);
                    
                    if (form) {
                        const currentDisplay = window.getComputedStyle(form).display;
                        const isHidden = currentDisplay === 'none';
                        console.log('Current computed display:', currentDisplay, 'isHidden:', isHidden);
                        
                        form.style.display = isHidden ? 'block' : 'none';
                        console.log('Form display set to:', form.style.display);
                        
                        if (isHidden) {
                            // Force reflow
                            form.offsetHeight;
                            setTimeout(() => {
                                form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }, 50);
                        }
                    } else {
                        console.error('Reply form not found for comment ID:', commentId);
                    }
                } else {
                    console.error('No comment ID found on reply button!', this);
                }
            });
        });
    }
    
    setupReplyButtons();
    // Also setup after a delay in case content loads dynamically
    setTimeout(setupReplyButtons, 500);
    
    // Cancel buttons for reply forms
    document.querySelectorAll('.cancel-reply-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const commentId = this.getAttribute('data-comment-id');
            if (commentId) {
                let form = document.getElementById('reply-form-' + commentId);
                if (!form) {
                    form = document.getElementById('reply-form-philanthropic-' + commentId);
                }
                if (form) {
                    form.style.display = 'none';
                }
            }
        });
    });
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Smooth Scroll
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

// Scroll Animations
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

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Timeline Animation
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        if (item.classList.contains('timeline-item') && item.parentElement.querySelector('.timeline-item:nth-child(odd)') === item) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });
}

// Image Gallery for Philanthropic
const philanthropicGalleries = document.querySelectorAll('.philanthropic-gallery');
philanthropicGalleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img');
    if (images.length > 1) {
        let currentIndex = 0;
        
        setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }, 3000);
    }
});

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '#e2e8f0';
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields');
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Success Message Display - Check URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Check for goodwill message success
if (urlParams.get('success') === 'true') {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    successMsg.textContent = 'Message submitted successfully! It will be reviewed.';
    document.body.appendChild(successMsg);

    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
    }, 3000);
}

// Check for comment submission success
if (urlParams.get('comment') === 'submitted') {
    const successMsg = document.createElement('div');
    successMsg.className = 'comment-success-message';
    successMsg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    successMsg.textContent = 'Comment submitted! It will be reviewed before being published.';
    document.body.appendChild(successMsg);

    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
    }, 3000);
}

