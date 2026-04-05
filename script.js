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
    const slideUpElements = document.querySelectorAll('.slide-up, .service-card, .gallery-item');
    slideUpElements.forEach((el, index) => {
        // Add staggered delay based on index for cards and items
        if (el.classList.contains('service-card') || el.classList.contains('gallery-item')) {
            // Group by parent container approx index or just random stagger
            const staggerIndex = index % 5;
            el.style.transitionDelay = `${staggerIndex * 0.1}s`;
            el.classList.add('slide-up');
        }
        observer.observe(el);
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
