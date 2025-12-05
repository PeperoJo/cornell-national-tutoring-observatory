document.addEventListener('DOMContentLoaded', () => {
    const typingSpan = document.getElementById('hero-typing-word');
    const heroBackground = document.getElementById('hero-background');
    const progressDots = document.querySelectorAll('.hero-progress-dot');

    // Require only the core elements; progress dots are optional (we no longer show a progress bar)
    if (!typingSpan || !heroBackground) {
        return;
    }

    // Hero background images (reuse existing hero assets)
    const heroImages = [
        'img/hero/mission.jpg',
        'img/hero/about.jpg',
        'img/hero/work.jpg',
        'img/hero/news.jpg',
        'img/hero/news2.jpg'
    ];

    let currentImageIndex = 0;
    let imageIntervalId = null;

    function setHeroImage(index) {
        currentImageIndex = index;

        // Update background image
        const imageSrc = heroImages[index % heroImages.length];
        heroBackground.style.backgroundImage = `url('${imageSrc}')`;

        // Restart pan animation
        heroBackground.classList.remove('hero-pan');
        // Force reflow
        void heroBackground.offsetWidth;
        heroBackground.classList.add('hero-pan');

        // Update progress active state (if any dots exist)
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function startImageRotation() {
        if (imageIntervalId) {
            clearInterval(imageIntervalId);
        }
        imageIntervalId = setInterval(() => {
            const nextIndex = (currentImageIndex + 1) % heroImages.length;
            setHeroImage(nextIndex);
        }, 8000);
    }

    // Attach click handlers for manual navigation (only if dots exist)
    if (progressDots.length > 0) {
        progressDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const indexAttr = dot.getAttribute('data-hero-index');
                const index = Number(indexAttr);
                if (Number.isNaN(index)) return;

                setHeroImage(index);
                startImageRotation();
            });
        });
    }

    // Initialize hero background
    setHeroImage(0);
    startImageRotation();

    // Typing animation for final word (loaded from JSON)
    function startTyping(words) {
        if (!Array.isArray(words) || words.length === 0) {
            words = ['Learning', 'Growth', 'Nurturing'];
        }

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const typeSpeed = 120;
        const deleteSpeed = 80;
        const pauseAtEnd = 1500;

        function tick() {
            const currentWord = words[wordIndex];

            if (!deleting) {
                charIndex++;
                typingSpan.textContent = currentWord.slice(0, charIndex);

                if (charIndex === currentWord.length) {
                    deleting = true;
                    setTimeout(tick, pauseAtEnd);
                    return;
                }
            } else {
                charIndex--;
                typingSpan.textContent = currentWord.slice(0, Math.max(charIndex, 0));

                if (charIndex <= 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }

            const delay = deleting ? deleteSpeed : typeSpeed;
            setTimeout(tick, delay);
        }

        typingSpan.textContent = '';
        tick();
    }

    fetch('data/hero-words.json')
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(data => {
            const words = Array.isArray(data.words) ? data.words : undefined;
            startTyping(words);
        })
        .catch(() => {
            startTyping(['Learning', 'Growth', 'Nurturing']);
        });
});


