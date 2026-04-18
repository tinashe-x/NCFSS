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
        if (el.classList.contains('gallery-item') || el.classList.contains('tab-btn')) {
            const staggerIndex = index % 5;
            el.style.transitionDelay = `${staggerIndex * 0.1}s`;
            if (!el.classList.contains('slide-up')) {
                el.classList.add('slide-up');
            }
        }
        observer.observe(el);
    });

    // Burger Menu Logic
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.services-tabs-container');
            const containerBtns = container.querySelectorAll('.tab-btn');
            const containerPanes = container.querySelectorAll('.tab-pane');

            // Remove active class from all
            containerBtns.forEach(b => b.classList.remove('active'));
            containerPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');

            // Scroll tab into view
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Tabs Scroll Indicator Logic
    const tabsNav = document.getElementById('tabsNav');
    const tabsScrollIndicator = document.getElementById('tabsScrollIndicator');
    
    if (tabsNav && tabsScrollIndicator) {
        const updateIndicator = () => {
            // Check if we can scroll right
            if (tabsNav.scrollWidth > tabsNav.clientWidth) {
                // If we are at the end, hide indicator
                if (Math.ceil(tabsNav.scrollLeft + tabsNav.clientWidth) >= tabsNav.scrollWidth) {
                    tabsScrollIndicator.classList.remove('visible');
                } else {
                    tabsScrollIndicator.classList.add('visible');
                }
            } else {
                tabsScrollIndicator.classList.remove('visible');
            }
        };

        // Initial check and event listener
        updateIndicator();
        tabsNav.addEventListener('scroll', updateIndicator);
        window.addEventListener('resize', updateIndicator);
    }

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            
            // Optional: close other open accordions in the same group
            // const currentActive = accordionItem.parentElement.querySelector('.accordion-item.active');
            // if(currentActive && currentActive !== accordionItem) {
            //     currentActive.classList.remove('active');
            //     currentActive.querySelector('.accordion-content').style.maxHeight = null;
            // }
            
            accordionItem.classList.toggle('active');
            const content = header.nextElementSibling;
            
            if (accordionItem.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Smooth scrolling for native anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
