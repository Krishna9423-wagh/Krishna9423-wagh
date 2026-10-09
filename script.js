document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if device supports hover (ignore on mobile/touch devices)
    if (window.matchMedia("(any-hover: hover)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Outline follows with slight delay using GSAP if available, or just CSS
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
            
            // GSAP for smoother cursor (if loaded)
            if (typeof gsap !== 'undefined') {
                gsap.to(cursorOutline, {
                    x: posX - 20, // Offset by half width
                    y: posY - 20, // Offset by half height
                    duration: 0.15,
                    ease: "power2.out"
                });
                // Reset standard translate since GSAP uses transforms
                cursorOutline.style.transform = 'none';
                cursorOutline.style.left = '0';
                cursorOutline.style.top = '0';
                
                cursorDot.style.transform = 'none';
                cursorDot.style.left = '0';
                cursorDot.style.top = '0';
                gsap.set(cursorDot, { x: posX - 4, y: posY - 4 });
            }
        });

        // Hover effect for links and buttons
        const interactives = document.querySelectorAll('a, button, .btn, .profile-card, .project-content');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Typing Effect
    const textRoles = ["CS Student", "Aspiring AI/ML Engineer", "Competitive Programmer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-text');
    
    function typeEffect() {
        const currentRole = textRoles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % textRoles.length;
            typeSpeed = 500; // Pause before typing next
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect
    if (typingElement) setTimeout(typeEffect, 1000);

    // 5. 3D Tilt Effect
    const tiltElements = document.querySelectorAll('.tilt-effect');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 6. GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Reveal elements on scroll
        const revealElements = document.querySelectorAll('.reveal');
        
        revealElements.forEach((el) => {
            let delay = 0;
            if (el.classList.contains('reveal-delay')) delay = 0.2;
            if (el.classList.contains('reveal-delay-2')) delay = 0.4;
            
            gsap.fromTo(el, 
                { 
                    y: 50, 
                    opacity: 0 
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: delay,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Trigger when top of element hits 85% of viewport
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    } else {
        // Fallback if GSAP fails to load
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        });
    }

    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(6, 9, 19, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            }
        });
    }

    // 7. Fetch GitHub Data
    fetchGitHubData('Krishna9423-wagh');
});

async function fetchGitHubData(username) {
    const profileContainer = document.getElementById('github-profile');
    const reposContainer = document.getElementById('github-repos');

    if (!profileContainer || !reposContainer) return;

    try {
        // Fetch Profile
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        if (!profileRes.ok) throw new Error('Profile not found');
        const profile = await profileRes.json();

        // Render Profile
        profileContainer.innerHTML = `
            <img src="${profile.avatar_url}" alt="${profile.name} Avatar">
            <h3>${profile.name || username}</h3>
            <p>@${profile.login}</p>
            <div class="github-stats">
                <div class="stat-item">
                    <span class="stat-value">${profile.public_repos}</span>
                    <span class="stat-label">Repos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${profile.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
            </div>
            <a href="${profile.html_url}" target="_blank" class="btn btn-primary btn-sm" style="margin-top: 24px;">
                View Profile
            </a>
        `;

        // Fetch Repos
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
        if (!reposRes.ok) throw new Error('Repos not found');
        const repos = await reposRes.json();

        // Render Repos
        reposContainer.innerHTML = repos.map(repo => `
            <a href="${repo.html_url}" target="_blank" class="repo-card tilt-effect">
                <div class="repo-header">
                    <i class="ph-fill ph-book-bookmark"></i>
                    <h4>${repo.name}</h4>
                </div>
                <p class="repo-desc">${repo.description || 'No description provided.'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span><i class="ph-fill ph-circle" style="color: var(--primary);"></i> ${repo.language}</span>` : ''}
                    <span><i class="ph-fill ph-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="ph-fill ph-git-fork"></i> ${repo.forks_count}</span>
                </div>
            </a>
        `).join('');

        // Re-initialize tilt effect for dynamically added repo cards
        const tiltElements = document.querySelectorAll('#github-repos .tilt-effect');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10; 
                const rotateY = ((x - centerX) / centerX) * 10;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        profileContainer.innerHTML = `
            <div style="color: #ef4444; text-align: center;">
                <i class="ph-fill ph-warning-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Failed to load GitHub profile.</p>
            </div>
        `;
        reposContainer.innerHTML = '';
    }
}
