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

            // Strict horizontal scroll
            const tabsNav = document.getElementById('tabsNav');
            if (tabsNav) {
                const targetLeft = btn.offsetLeft;
                const centerPos = targetLeft - tabsNav.offsetWidth / 2 + btn.offsetWidth / 2;
                tabsNav.scrollTo({
                    left: centerPos,
                    behavior: 'smooth'
                });
            }

            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Auto-rotate tabs every 2.5 seconds
    let tabRotationInterval;

    if (tabBtns.length > 0) {
        const rotateTabs = () => {
            // Check if section is in viewport to avoid scrolling when user is elsewhere
            const container = document.querySelector('.services-tabs-container');
            if (!container) return;

            // Simple check if the tabs are generally in the viewport
            const rect = container.getBoundingClientRect();
            if (rect.top >= window.innerHeight || rect.bottom <= 0) {
                return; // Container is completely off-screen, don't auto-rotate
            }

            let activeIndex = 0;
            tabBtns.forEach((btn, index) => {
                if (btn.classList.contains('active')) activeIndex = index;
            });

            const nextIndex = (activeIndex + 1) % tabBtns.length;
            const targetBtn = tabBtns[nextIndex];

            // Programmatically switch without triggering full click events that could cause unintended jumps
            const containerBtns = container.querySelectorAll('.tab-btn');
            const containerPanes = container.querySelectorAll('.tab-pane');

            containerBtns.forEach(b => b.classList.remove('active'));
            containerPanes.forEach(p => p.classList.remove('active'));

            targetBtn.classList.add('active');
            targetBtn.classList.add('active');

            // Strictly horizontal scroll 
            const tabsNav = document.getElementById('tabsNav');
            if (tabsNav) {
                const targetLeft = targetBtn.offsetLeft;
                const centerPos = targetLeft - tabsNav.offsetWidth / 2 + targetBtn.offsetWidth / 2;
                tabsNav.scrollTo({
                    left: centerPos,
                    behavior: 'smooth'
                });
            }

            const targetId = targetBtn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        };

        tabRotationInterval = setInterval(rotateTabs, 2500);
        let idleTimeout;

        // Stop rotation upon user interaction, and restart after 20 seconds of inactivity
        const tabsContainer = document.querySelector('.services-tabs-container');
        if (tabsContainer) {
            const handleInteraction = () => {
                clearInterval(tabRotationInterval);
                clearTimeout(idleTimeout);

                idleTimeout = setTimeout(() => {
                    clearInterval(tabRotationInterval); // safeguard
                    tabRotationInterval = setInterval(rotateTabs, 2500);
                }, 20000);
            };

            tabsContainer.addEventListener('click', handleInteraction);
            tabsContainer.addEventListener('touchstart', handleInteraction, { passive: true });
        }
    }

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

    // Video Modal Logic
    const galleryVideos = document.querySelectorAll('.gallery-single');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalVideoSource = modalVideo ? modalVideo.querySelector('source') : null;
    const closeModalBtn = document.querySelector('.video-modal-close');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    if (videoModal && modalVideo && modalVideoSource && closeModalBtn && playPauseBtn) {
        galleryVideos.forEach(video => {
            video.addEventListener('click', () => {
                const source = video.querySelector('source');
                if (source) {
                    modalVideoSource.src = source.src;
                    modalVideo.load();
                    videoModal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                    modalVideo.play().catch(e => console.log('Autoplay prevented', e));
                    updatePlayPauseIcons(false);
                }
            });
        });

        const closeModal = () => {
            videoModal.classList.remove('show');
            modalVideo.pause();
            modalVideo.currentTime = 0;
            document.body.style.overflow = ''; // Restore scrolling
        };

        closeModalBtn.addEventListener('click', closeModal);

        // Close on outside click
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal || e.target.classList.contains('video-modal-content')) {
                closeModal();
            }
        });

        const updatePlayPauseIcons = (isPaused) => {
            if (isPaused) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            } else {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
        };

        const togglePlayPause = () => {
            if (modalVideo.paused) {
                modalVideo.play();
                updatePlayPauseIcons(false);
            } else {
                modalVideo.pause();
                updatePlayPauseIcons(true);
            }
        };

        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayPause();
        });
        
        modalVideo.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayPause();
        });
        
        // Update icons if video ends
        modalVideo.addEventListener('ended', () => {
            updatePlayPauseIcons(true);
        });
    }
});
