
        // User Authentication System
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

        // DOM Elements
        const authModal = document.getElementById('auth-modal');
        const loginToggle = document.getElementById('login-toggle');
        const closeAuth = document.querySelector('.close-auth');
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const authLink = document.getElementById('auth-link');

        // Open/Close Auth Modal
        loginToggle.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.style.display = 'flex';
        });

        closeAuth.addEventListener('click', () => {
            authModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });

        // Switch between login and signup tabs
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Update active tab
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                authForms.forEach(form => form.classList.remove('active'));
                document.getElementById(`${tabId}-form`).classList.add('active');
            });
        });

        // Show signup form from login footer
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelector('.auth-tab[data-tab="signup"]').classList.add('active');
            
            authForms.forEach(form => form.classList.remove('active'));
            signupForm.classList.add('active');
        });

        // Show login form from signup footer
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
            
            authForms.forEach(form => form.classList.remove('active'));
            loginForm.classList.add('active');
        });

        // Signup Form Submission
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Check if user already exists
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                alert('User with this email already exists!');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                orders: []
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Log in the new user
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateAuthUI();
            authModal.style.display = 'none';
            alert('Account created successfully!');
            signupForm.reset();
        });

        // Login Form Submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Find user
            const user = users.find(user => user.email === email);
            
            if (!user || user.password !== password) {
                alert('Invalid email or password!');
                return;
            }
            
            // Log in the user
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateAuthUI();
            authModal.style.display = 'none';
            alert('Logged in successfully!');
            loginForm.reset();
        });

        // Logout Function
        function logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI();
            alert('Logged out successfully!');
        }

        // Update Authentication UI
        function updateAuthUI() {
            if (currentUser) {
                // User is logged in
                authLink.innerHTML = `
                    <div class="user-profile">
                        <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                        <span class="user-name">${currentUser.name.split(' ')[0]}</span>
                        <a href="#" id="logout-btn" style="margin-left: 10px;">(Logout)</a>
                    </div>
                `;
                
                // Add logout event listener
                document.getElementById('logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            } else {
                // User is not logged in
                authLink.innerHTML = `
                    <a href="#login" id="login-toggle">
                        <i class="fas fa-user"></i> Login
                    </a>
                `;
                
                // Re-add login toggle event listener
                document.getElementById('login-toggle').addEventListener('click', (e) => {
                    e.preventDefault();
                    authModal.style.display = 'flex';
                });
            }
        }

        // Initialize auth UI
        updateAuthUI();

        // Mobile Navigation
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            themeToggle.textContent = savedTheme === 'dark-mode' ? '☀️' : '🌙';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Save theme preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark-mode');
                themeToggle.textContent = '☀️';
            } else {
                localStorage.setItem('theme', '');
                themeToggle.textContent = '🌙';
            }
        });

        // Menu Tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Shopping Cart Functionality
        const cartToggle = document.getElementById('cart-toggle');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.querySelector('.close-cart');
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const cartCount = document.querySelector('.cart-count');
        const checkoutBtn = document.querySelector('.checkout-btn');

        let cart = [];

        // Open/Close Cart Modal
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'flex';
        });

        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });

        // Add to Cart
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                const image = btn.getAttribute('data-image');
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                updateCart();
                cartModal.style.display = 'flex';
            });
        });

        // Update Cart
        function updateCart() {
            // Clear cart items
            cartItemsContainer.innerHTML = '';
            
            let total = 0;
            
            // Add each item to cart
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">MZN${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Update total price
            cartTotalPrice.textContent = total.toFixed(2);
            
            // Update cart count
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    
                    updateCart();
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    updateCart();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    updateCart();
                });
            });
        }

        // Checkout
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            if (!currentUser) {
                alert('Please login to complete your order!');
                authModal.style.display = 'flex';
                return;
            }
            
            // Create order
            const order = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                items: [...cart],
                total: parseFloat(cartTotalPrice.textContent),
                status: 'Pending'
            };
            
            // Add order to user's orders
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].orders.push(order);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user
                currentUser = users[userIndex];
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            alert(`Order placed! Total: MZN${cartTotalPrice.textContent}`);
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
        });

        // Form Submission
        document.getElementById('reservation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Table booked successfully! We look forward to serving you.');
            e.target.reset();
        });

        document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            e.target.reset();
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });