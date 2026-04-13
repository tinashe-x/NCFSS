document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const slideUpElements = document.querySelectorAll('.slide-up, .gallery-item, .tab-btn');
    slideUpElements.forEach((el, index) => {
        // Add staggered delay based on index for items
        if (el.classList.contains('gallery-item') || el.classList.contains('tab-btn')) {
            const staggerIndex = index % 5;
            el.style.transitionDelay = `${staggerIndex * 0.1}s`;
            if (!el.classList.contains('slide-up')) {
                el.classList.add('slide-up');
            }
        }
        observer.observe(el);
    });

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Scroll tab into view for mobile carousel
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

            // Add active class to corresponding pane
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Form submission mock functionality
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            
            setTimeout(() => {
                btn.innerText = "Message Sent!";
                btn.style.background = "#10b981"; // success green
                btn.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
                form.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "";
                    btn.style.boxShadow = "";
                }, 3000);
            }, 1000);
        });
    }

    // Smooth scrolling for native anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
});
