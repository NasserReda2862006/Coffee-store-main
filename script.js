// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup all functionality
    setupNavigation();
    setupCart();
    setupSearch();
    setupMobileMenu();
    setupContactForm();
    setupTestimonialsCarousel();
    setupNewsletter();
    addTouchSupport();
});

// Add touch support for testimonials carousel
function addTouchSupport() {
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    
    if (testimonialsCarousel) {
        let startX, endX;
        const threshold = 50; // Minimum distance to be considered a swipe
        
        testimonialsCarousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, false);
        
        testimonialsCarousel.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const prevBtn = document.getElementById('prevTestimonial');
            const nextBtn = document.getElementById('nextTestimonial');
            
            if (startX - endX > threshold) {
                // Swipe left, go to next
                if (nextBtn) nextBtn.click();
            } else if (endX - startX > threshold) {
                // Swipe right, go to previous
                if (prevBtn) prevBtn.click();
            }
        }
    }
}

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80, // Offset for the fixed header
            behavior: 'smooth'
        });
    }
}

// Setup navigation functionality
function setupNavigation() {
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const goToTopBtn = document.getElementById('goToTop');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        // Handle active navigation links
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        
        // Make header smaller on scroll
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide go to top button
        if (window.scrollY > 500) {
            goToTopBtn.classList.add('visible');
        } else {
            goToTopBtn.classList.remove('visible');
        }
    });
    
    // Go to top button click event
    if (goToTopBtn) {
        goToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Setup cart functionality
function setupCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    let cart = [];
    
    // Open cart sidebar
    cartBtn.addEventListener('click', function() {
        cartSidebar.classList.add('active');
    });
    
    // Close cart sidebar
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
    
    // Add items to cart with animation
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const name = menuItem.getAttribute('data-name');
            const price = parseFloat(menuItem.getAttribute('data-price'));
            const image = menuItem.getAttribute('data-image');
            
            // Add animation class
            this.classList.add('adding');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.classList.remove('adding');
            }, 500);
            
            // Show visual feedback
            const notification = document.createElement('div');
            notification.classList.add('cart-notification');
            notification.textContent = `${name} added to cart!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            updateCart();
        });
    });
    
    // Update cart display
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let count = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-name="${item.name}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-name="${item.name}">×</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = count;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const item = cart.find(item => item.name === name);
                
                if (this.classList.contains('plus')) {
                    item.quantity++;
                } else if (this.classList.contains('minus')) {
                    item.quantity--;
                    if (item.quantity === 0) {
                        cart = cart.filter(cartItem => cartItem.name !== name);
                    }
                }
                
                updateCart();
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                cart = cart.filter(item => item.name !== name);
                updateCart();
            });
        });
    }
    
    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Thank you for your order! Your coffee will be ready soon.');
            cart = [];
            updateCart();
            cartSidebar.classList.remove('active');
        } else {
            alert('Your cart is empty. Please add some items before checking out.');
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResults = document.getElementById('searchResults');

    // Initially hide the search container
    searchContainer.classList.remove('active');

    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && e.target !== searchBtn) {
            searchContainer.classList.remove('active');
            if (searchResultsContainer) {
                searchResultsContainer.style.display = 'none';
            }
            // Reset all menu items to visible when search is closed
            resetMenuItems();
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        if (searchTerm.length > 0) {
            const menuItems = document.querySelectorAll('.menu-item');
            const filteredItems = Array.from(menuItems).filter(item => {
                const itemName = item.dataset.name.toLowerCase();
                return itemName.includes(searchTerm);
            });

            // First, scroll to the menu section
            const menuSection = document.getElementById('menu');
            menuSection.scrollIntoView({ behavior: 'smooth' });
            
            // Hide all menu items first
            menuItems.forEach(item => {
                item.style.display = 'none';
            });
            
            // Show only matching items
            if (filteredItems.length > 0) {
                filteredItems.forEach(item => {
                    // Show and highlight matching items
                    item.style.display = 'block';
                    item.classList.add('search-highlight');
                    
                    const resultItem = document.createElement('div');
                    resultItem.textContent = item.dataset.name;
                    resultItem.addEventListener('click', () => {
                        // Scroll to the item
                        menuSection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Highlight the item
                        item.style.transform = 'scale(1.05)';
                        item.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.4)';
                        setTimeout(() => {
                            item.style.transform = '';
                            item.style.boxShadow = '';
                        }, 2000);
                        
                        // Close search
                        searchContainer.classList.remove('active');
                        searchResultsContainer.style.display = 'none';
                        searchInput.value = '';
                        
                        // Reset all menu items to visible
                        resetMenuItems();
                    });
                    searchResults.appendChild(resultItem);
                });
                searchResultsContainer.style.display = 'block';
            } else {
                // If no results, show a message but keep menu section visible
                const noResults = document.createElement('div');
                noResults.textContent = 'No items found';
                noResults.style.padding = '1rem';
                noResults.style.color = 'var(--text-secondary)';
                searchResults.appendChild(noResults);
                searchResultsContainer.style.display = 'block';
            }
        } else {
            searchResultsContainer.style.display = 'none';
            // Reset all menu items to visible when search is cleared
            resetMenuItems();
        }
    });
    
    // Function to reset all menu items to visible
    function resetMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('search-highlight');
        });
    }
}

// Cart functionality
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

let cart = [];

// Open cart sidebar
cartBtn.addEventListener('click', function() {
    cartSidebar.classList.add('active');
});

// Close cart sidebar
closeCart.addEventListener('click', function() {
    cartSidebar.classList.remove('active');
});

// Add items to cart with animation
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const menuItem = this.closest('.menu-item');
        const name = menuItem.getAttribute('data-name');
        const price = parseFloat(menuItem.getAttribute('data-price'));
        const image = menuItem.getAttribute('data-image');
        
        // Add animation class
        this.classList.add('adding');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.classList.remove('adding');
        }, 500);
        
        // Show visual feedback
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = `${name} added to cart!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        updateCart();
    });
});

// Update cart display
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-name="${item.name}">+</button>
                </div>
            </div>
            <button class="remove-item" data-name="${item.name}">×</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const item = cart.find(item => item.name === name);
            
            if (this.classList.contains('plus')) {
                item.quantity++;
            } else if (this.classList.contains('minus')) {
                item.quantity--;
                if (item.quantity === 0) {
                    cart = cart.filter(cartItem => cartItem.name !== name);
                }
            }
            
            updateCart();
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            cart = cart.filter(item => item.name !== name);
            updateCart();
        });
    });
}

// Checkout functionality
checkoutBtn.addEventListener('click', function() {
    if (cart.length > 0) {
        alert('Thank you for your order! Your coffee will be ready soon.');
        cart = [];
        updateCart();
        cartSidebar.classList.remove('active');
    } else {
        alert('Your cart is empty. Please add some items before checking out.');
    }
});


// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const mobileNav = document.getElementById('mobileNav');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu on small screens
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Use slide-in menu on very small screens
                if (mobileNav) {
                    mobileNav.classList.add('active');
                }
            } else {
                // Toggle navigation on medium screens
                if (navLinks) {
                    navLinks.classList.toggle('active');
                }
            }
        });
    }
    
    // Close mobile menu
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', function() {
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
        });
    }
    
    // Close mobile menu when a link is clicked
    if (mobileNavLinks) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                }
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav && !mobileNav.contains(event.target) && event.target !== mobileMenuBtn) {
            mobileNav.classList.remove('active');
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
        }
    });
}

// Setup contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', { name, email, message });
            
            alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
            contactForm.reset();
        });
    }
}

// Add this function to your script.js file
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // In a real application, you would send this data to a server
                console.log('Newsletter subscription:', email);
                
                // Show success message
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.textContent = `Thank you for subscribing to our newsletter!`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
                
                // Reset form
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add this line to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Existing setup functions
    setupNavigation();
    setupCart();
    setupSearch();
    setupMobileMenu();
    setupContactForm();
    
    // Add touch support for testimonials carousel
    function addTouchSupport() {
        const testimonialsCarousel = document.querySelector('.testimonials-carousel');
        
        if (testimonialsCarousel) {
            let startX, endX;
            const threshold = 50; // Minimum distance to be considered a swipe
            
            testimonialsCarousel.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
            }, false);
            
            testimonialsCarousel.addEventListener('touchend', function(e) {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
            }, false);
            
            function handleSwipe() {
                const prevBtn = document.getElementById('prevTestimonial');
                const nextBtn = document.getElementById('nextTestimonial');
                
                if (startX - endX > threshold) {
                    // Swipe left, go to next
                    if (nextBtn) nextBtn.click();
                } else if (endX - startX > threshold) {
                    // Swipe right, go to previous
                    if (prevBtn) prevBtn.click();
                }
            }
        }
    }
    
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Existing setup functions
        setupNavigation();
        setupCart();
        setupSearch();
        setupMobileMenu();
        setupContactForm();
        setupTestimonialsCarousel();
        setupNewsletter();
        
        // Add touch support
        addTouchSupport();
    });
    
    // Instead, call these functions directly
    setupTestimonialsCarousel();
    addTouchSupport();
    setupNewsletter();
});


// Setup testimonials carousel
function setupTestimonialsCarousel() {
    // Get all necessary elements
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    // Exit if no slides found
    if (!slides.length) {
        console.error('No testimonial slides found');
        return;
    }
    
    let currentIndex = 0;
    let slideInterval;
    
    // Function to display a specific slide
    function showSlide(index) {
        // Hide all slides first
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.opacity = '0';
            slides[i].style.visibility = 'hidden';
            slides[i].style.transform = 'translateX(50px)';
            slides[i].classList.remove('active');
            
            if (dots[i]) {
                dots[i].classList.remove('active');
            }
        }
        
        // Show the selected slide
        setTimeout(() => {
            slides[index].style.opacity = '1';
            slides[index].style.visibility = 'visible';
            slides[index].style.transform = 'translateX(0)';
            slides[index].classList.add('active');
            
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }, 50);
        
        currentIndex = index;
    }
    
    // Function to go to the next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    // Function to go to the previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }
    
    // Function to start the automatic slideshow
    function startSlideshow() {
        // Clear any existing interval first
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Add click event for previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            // Reset the automatic slideshow
            startSlideshow();
        });
    }
    
    // Add click event for next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            // Reset the automatic slideshow
            startSlideshow();
        });
    }
    
    // Add click events for the dots
    if (dots.length) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', function() {
                showSlide(i);
                // Reset the automatic slideshow
                startSlideshow();
            });
        }
    }
    
    // Initialize: show the first slide and start the slideshow
    showSlide(0);
    startSlideshow();
}
;

// Add this function to optimize images based on screen size
function optimizeImages() {
    const screenWidth = window.innerWidth;
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        if (screenWidth <= 480) {
            // Mobile size
            img.src = img.getAttribute('data-src-sm') || img.getAttribute('data-src');
        } else if (screenWidth <= 1024) {
            // Tablet size
            img.src = img.getAttribute('data-src-md') || img.getAttribute('data-src');
        } else {
            // Desktop size
            img.src = img.getAttribute('data-src');
        }
    });
}

// Call this function on load and resize
window.addEventListener('load', optimizeImages);
window.addEventListener('resize', optimizeImages);
;

// Optimize performance on mobile devices
function optimizeMobilePerformance() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add class to reduce animations on mobile
        document.body.classList.add('reduce-motion');
        
        // Optimize images
        optimizeImages();
        
        // Add passive event listeners for better scrolling
        addPassiveEventListeners();
    }
}

// Optimize images based on screen size
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" attribute to images below the fold
        if (!isElementInViewport(img)) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add passive event listeners for better scrolling performance
function addPassiveEventListeners() {
    const wheelOpt = { passive: true };
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    
    window.addEventListener(wheelEvent, () => {}, wheelOpt);
    window.addEventListener('touchstart', () => {}, wheelOpt);
}

// Call optimization function on load and resize
window.addEventListener('load', optimizeMobilePerformance);
window.addEventListener('resize', optimizeMobilePerformance);
;

// Improve performance on mobile devices
function improvePerformance() {
    // Detect if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce animations on mobile
        document.body.classList.add('reduce-motion');
        
        // Lazy load images that are off-screen
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
}

// Call on page load
window.addEventListener('load', improvePerformance);