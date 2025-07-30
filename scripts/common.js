/* Common JavaScript functionality */
document.addEventListener('DOMContentLoaded', function() {
    // Load navigation
    fetch('includes/nav.html')
        .then(response => response.text())
        .then(data => {
            const navContainer = document.getElementById('nav-container');
            if (navContainer) {
                navContainer.innerHTML = data;
            }
        })
        .catch(error => console.log('Navigation loading failed:', error));

    // Load footer
    fetch('includes/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(error => console.log('Footer loading failed:', error));

    // Navbar scroll enhancement
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else if (navbar) {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Mobile menu toggle (delegated event handling)
    document.addEventListener('click', function(e) {
        if (e.target.matches('#nav-toggle') || e.target.closest('#nav-toggle')) {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
        }

        // Close menu when clicking on links
        if (e.target.matches('.nav-link')) {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Smooth scroll to sections
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Update active nav link based on current page
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'home.html')) {
            link.style.color = '#667eea';
            link.style.fontWeight = '600';
        }
    });
}

// Call updateActiveNavLink after navigation loads
setTimeout(updateActiveNavLink, 100);
