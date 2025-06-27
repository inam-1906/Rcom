document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

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

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // Animated counters for statistics
    const observerOptions = {
        threshold: 0.7
    };

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const increment = target / 200;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 10);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Parallax effect for floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-circle');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Gallery item hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Course card interactions
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

   const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                showMessage(result.message, 'success');
                contactForm.reset();
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Network error. Please try again later.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

    // Message popup system
    function showMessage(message, type = 'success') {
        const popup = document.getElementById('messagePopup');
        const messageText = popup.querySelector('.message-text');
        const messageIcon = popup.querySelector('.message-icon');
        
        messageText.textContent = message;
        
        // Set icon and styling based on type
        if (type === 'success') {
            messageIcon.className = 'message-icon fas fa-check-circle';
            popup.classList.remove('error');
        } else {
            messageIcon.className = 'message-icon fas fa-exclamation-circle';
            popup.classList.add('error');
        }
        
        // Show popup
        popup.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }

    function hideMessage() {
        const popup = document.getElementById('messagePopup');
        popup.classList.remove('show');
    }

    // Message close button
    const messageClose = document.querySelector('.message-close');
    if (messageClose) {
        messageClose.addEventListener('click', hideMessage);
    }

    // Hero buttons interactions
    const heroButtons = document.querySelectorAll('.hero-buttons button');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-primary')) {
                // Scroll to courses section
                document.getElementById('courses').scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                // Scroll to courses section
                document.getElementById('courses').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Course enrollment buttons
    const courseButtons = document.querySelectorAll('.course-btn');
    courseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseName = courseCard.querySelector('h3').textContent;
            const coursePrice = courseCard.querySelector('.price').textContent;
            
            // Create enrollment modal or redirect to enrollment page
            showEnrollmentModal(courseName, coursePrice);
        });
    });

    // Enrollment modal functionality
    function showEnrollmentModal(courseName, coursePrice) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('enrollmentModal');
        if (!modal) {
            modal = createEnrollmentModal();
        }
        
        // Populate modal with course data
        modal.querySelector('.modal-course-name').textContent = courseName;
        modal.querySelector('.modal-course-price').textContent = coursePrice;
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function createEnrollmentModal() {
        const modalHTML = `
            <div id="enrollmentModal" class="enrollment-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Enroll in Course</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="course-info">
                            <h4 class="modal-course-name"></h4>
                            <p class="modal-course-price"></p>
                        </div>
                        <form id="enrollmentForm">
                            <div class="form-group">
                                <input type="text" name="full_name" placeholder="Full Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" placeholder="Email Address" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" name="phone" placeholder="Phone Number" required>
                            </div>
                            <div class="form-group">
                                <select name="experience_level" required>
                                    <option value="">Select Experience Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <textarea name="motivation" placeholder="Why do you want to take this course?" rows="3"></textarea>
                            </div>
                            <button type="submit" class="enroll-btn">
                                <span>Complete Enrollment</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('enrollmentModal');
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const enrollmentForm = modal.querySelector('#enrollmentForm');
        
        closeBtn.addEventListener('click', hideEnrollmentModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideEnrollmentModal();
            }
        });
        
        enrollmentForm.addEventListener('submit', handleEnrollmentSubmission);
        
        return modal;
    }

    function hideEnrollmentModal() {
        const modal = document.getElementById('enrollmentModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    async function handleEnrollmentSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.enroll-btn');
        const originalText = submitBtn.innerHTML;
        
        // Get course info
        const courseName = document.querySelector('.modal-course-name').textContent;
        formData.append('course_name', courseName);
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/enroll-course', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage(result.message, 'success');
                hideEnrollmentModal();
                form.reset();
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Network error. Please try again later.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Floating cards animation in hero section
    function animateFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            // Initial position
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 500 + (index * 200));
            
            // Continuous floating animation
            setInterval(() => {
                const randomY = Math.sin(Date.now() * 0.001 + index) * 10;
                const randomX = Math.cos(Date.now() * 0.0015 + index) * 5;
                card.style.transform = `translate(${randomX}px, ${randomY}px) scale(1)`;
            }, 50);
        });
    }

    // Initialize floating cards animation
    setTimeout(animateFloatingCards, 1000);

    // Skill orbs animation in about section
    const skillOrbsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const orbs = entry.target.querySelectorAll('.skill-orb');
                orbs.forEach((orb, index) => {
                    setTimeout(() => {
                        orb.style.opacity = '1';
                        orb.style.transform = 'scale(1)';
                        
                        // Add continuous rotation
                        setInterval(() => {
                            const rotation = (Date.now() * 0.001 + index) * 30;
                            orb.style.transform = `scale(1) rotate(${rotation}deg)`;
                        }, 50);
                    }, index * 200);
                });
                skillOrbsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutVisual = document.querySelector('.about-visual');
    if (aboutVisual) {
        skillOrbsObserver.observe(aboutVisual);
    }

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // Hide scroll indicator after scrolling
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    // Gallery filter functionality (if needed in the future)
    function initGalleryFilter() {
        const filterButtons = document.querySelectorAll('.gallery-filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Initialize gallery filter if filter buttons exist
    if (document.querySelector('.gallery-filter-btn')) {
        initGalleryFilter();
    }

    // Back to top button functionality
    function createBackToTopButton() {
        const backToTopHTML = `
            <button id="backToTop" class="back-to-top">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', backToTopHTML);
        
        const backToTopBtn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize back to top button
    createBackToTopButton();

    // Add loading animation for the page
    window.addEventListener('load', function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        // Trigger entrance animations
        document.body.classList.add('loaded');
    });

    // Lazy loading for gallery images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    // Apply lazy loading to gallery images
    document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEw2MCA2MEgyMEw0MCA0MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
            this.alt = 'Image not available';
        });
    });
});
// WhatsApp button handler
const whatsappBtn = document.querySelector('[data-action="whatsapp"]');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const form = document.getElementById('contactForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/send_whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'success') {
                window.open(result.whatsapp_url, '_blank');
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Network error. Please try again later.', 'error');
        }
    });
}