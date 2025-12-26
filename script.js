document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const labelText = document.querySelector('.label-text');
    const body = document.body;

    // Initial State Check
    // Default is 'mode-work' as per HTML
    updateButtonText();

    toggleBtn.addEventListener('click', () => {
        if (body.classList.contains('mode-work')) {
            body.classList.remove('mode-work');
            body.classList.add('mode-fun');

            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                initParallax(); // 🔥 START PARALLAX
            }, 150);

        } else {
            body.classList.remove('mode-fun');
            body.classList.add('mode-work');

            destroyParallax(); // 🧹 CLEAN RESET
        }

        updateButtonText();
    });


    function updateButtonText() {
        if (body.classList.contains('mode-work')) {
            // In Work mode, suggest Fun
            labelText.textContent = "Switch to Fun";
        } else {
            // In Fun mode, suggest Work
            labelText.textContent = "Back to Work";
        }
    }

    // --- LIVE FEED FETCH ---
    const FEED_URL = 'https://ioatwork.com/feed';
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;
    const container = document.getElementById('articles-container');

    if (container) {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    renderArticles(data.items.slice(0, 4)); // Show top 4
                } else {
                    renderFallback();
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                renderFallback();
            });
    }

    function renderFallback() {
        // Fallback or "Static" feed if API limit is hit
        const fallbackItems = [
            { title: "The Future of Remote Work is Asynchronous", link: "#", pubDate: new Date().toISOString() },
            { title: "Why Your Office Needs a Nap Pod", link: "#", pubDate: new Date().toISOString() },
            { title: "The Psychology of Flow States in Coding", link: "#", pubDate: new Date().toISOString() },
            { title: "IO Psychology Trends to Watch in 2026", link: "#", pubDate: new Date().toISOString() }
        ];
        renderArticles(fallbackItems);
    }

    function renderArticles(items) {
        container.innerHTML = ''; // Clear loading text
        items.forEach(item => {
            const article = document.createElement('div');
            article.className = 'wire-item';

            // Format Date
            const date = new Date(item.pubDate);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            article.innerHTML = `
                <div class="wire-meta">
                    <span class="wire-source">IO At Work</span> • <span class="wire-date">${dateStr}</span>
                </div>
                <h4 class="wire-headline"><a href="${item.link}" target="_blank">${item.title}</a></h4>
            `;
            container.appendChild(article);
        });
    }

    // --- WEATHER FETCH ---
    async function updateWeather() {
        const weatherText = document.getElementById('weather-text');
        if (!weatherText) return;

        try {
            // Nashik Coords: 19.9975, 73.7898
            // London Coords: 51.5074, -0.1278
            const [nashikRes, londonRes] = await Promise.all([
                fetch('https://api.open-meteo.com/v1/forecast?latitude=19.9975&longitude=73.7898&current_weather=true'),
                fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true')
            ]);

            const nashikData = await nashikRes.json();
            const londonData = await londonRes.json();

            const nashikTemp = Math.round(nashikData.current_weather.temperature);
            const londonTemp = Math.round(londonData.current_weather.temperature);

            weatherText.textContent = `NASHIK: ${nashikTemp}°C / LONDON: ${londonTemp}°C`;
        } catch (error) {
            console.error('Weather fetch error:', error);
            // Fallback is already '--°C' in HTML
        }
    }

    updateWeather();

    // --- CONTACT MODAL ---
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-contact-modal');
    const closeBtn = document.getElementById('close-modal');
    const contactForm = document.getElementById('contact-form');

    if (modal && openBtn && closeBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = document.getElementById('subject').value;
            const body = document.getElementById('body').value;

            // In a real app, this would send data to a backend.
            // For now, we simulate sending.
            alert(`Message Sent to Editor!\n\nSubject: ${subject}\nBody: ${body}\n\n(This features will be connected to email later)`);

            contactForm.reset();
            modal.classList.remove('show');
        });
    }

    // --- GLOBE VISUALIZATION (FUN MODE) ---
    const globeContainer = document.getElementById('globe-viz');
    if (globeContainer && window.Globe) {
        const places = [
            { name: "Kashmir", lat: 34.0837, lng: 74.7973 },
            { name: "Nainital", lat: 29.3919, lng: 79.4542 },
            { name: "Ladakh", lat: 34.1526, lng: 77.5770 },
            { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
            { name: "Leh", lat: 34.1526, lng: 77.5770 },
            { name: "Paris", lat: 48.8566, lng: 2.3522 },
            { name: "Switzerland", lat: 46.8182, lng: 8.2275 },
            { name: "Liechtenstein", lat: 47.1410, lng: 9.5209 },
            { name: "London", lat: 51.5074, lng: -0.1278 },
            { name: "Prato", lat: 43.8777, lng: 11.1022 },
            { name: "Florence", lat: 43.7696, lng: 11.2558 },
            { name: "Titisee", lat: 47.9103, lng: 8.1637 },
            { name: "Vaduz", lat: 47.1410, lng: 9.5209 }, // Capital of Liechtenstein
            { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
            { name: "Brussels", lat: 50.8503, lng: 4.3517 },
            { name: "Innsbruck", lat: 47.2692, lng: 11.4041 },
            { name: "Rome", lat: 41.9028, lng: 12.4964 },
            { name: "Loughborough", lat: 52.7721, lng: -1.2062 }
        ];

        const world = Globe()
            (globeContainer)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .pointsData(places)
            .pointLat('lat')
            .pointLng('lng')
            .pointColor(() => '#ffeb3b') // Yellow points
            .pointAltitude(0.05)
            .pointRadius(0.5)
            .width(globeContainer.clientWidth)
            .height(300)
            .backgroundColor('rgba(0,0,0,0)');

        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 1.0;

        // Handle resize
        window.addEventListener('resize', () => {
            world.width(globeContainer.clientWidth);
        });

        // --- GLOBE MODAL EXPANSION ---
        const globeModal = document.getElementById('globe-modal');
        const globeCard = document.querySelector('.item-globe'); // Clickable card
        const closeGlobeBtn = document.getElementById('close-globe-modal');
        const largeGlobeContainer = document.getElementById('globe-viz-large');
        let largeWorld = null;

        if (globeModal && globeCard && closeGlobeBtn && largeGlobeContainer) {

            globeCard.style.cursor = 'pointer';
            globeCard.title = "Click to Explore";

            globeCard.addEventListener('click', () => {
                globeModal.classList.add('show');

                // Initialize Large Globe if not already
                if (!largeWorld) {
                    largeWorld = Globe()
                        (largeGlobeContainer)
                        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                        .pointsData(places)
                        .pointLat('lat')
                        .pointLng('lng')
                        .pointColor(() => '#00f2ea') // Cyan points for large view
                        .pointAltitude(0.08)
                        .pointRadius(0.8)
                        .width(largeGlobeContainer.clientWidth)
                        .height(largeGlobeContainer.clientHeight)
                        .backgroundColor('rgba(0,0,0,0)');

                    largeWorld.controls().autoRotate = true;
                    largeWorld.controls().autoRotateSpeed = 0.5;
                } else {
                    // Refresh size just in case
                    largeWorld.width(largeGlobeContainer.clientWidth);
                    largeWorld.height(largeGlobeContainer.clientHeight);
                }
            });

            closeGlobeBtn.addEventListener('click', () => {
                globeModal.classList.remove('show');
            });

            // Close on outside click is tricky with full screen, but we can do:
            globeModal.addEventListener('click', (e) => {
                if (e.target === globeModal) {
                    globeModal.classList.remove('show');
                }
            });
        }
    }

    // --- PAGE FLIP ANIMATION ---
    const pubLinks = document.querySelectorAll('.pub-link');
    pubLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            // Add animation class to body
            // Wait for animation to finish then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 550); // Slightly less than 0.6s to feel snappy
        });
    });

    // --- MUSIC CHOICE MODAL ---
    const musicModal = document.getElementById('music-modal');
    const closeMusicBtn = document.getElementById('close-music-modal');
    const spotifyBtn = document.getElementById('spotify-btn');
    const appleBtn = document.getElementById('apple-btn');
    const musicTitle = document.getElementById('music-title');
    const songLinks = document.querySelectorAll('.song-link');

    if (musicModal && songLinks.length > 0) {
        songLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = link.getAttribute('data-title');
                const spotify = link.getAttribute('data-spotify');
                const apple = link.getAttribute('data-apple');
                const img = link.getAttribute('data-img');

                // Update content
                musicTitle.textContent = title;
                document.getElementById('music-art').src = img || 'placeholder.png'; // Fallback
                spotifyBtn.href = spotify;
                appleBtn.href = apple;

                // Show modal & Blur background
                musicModal.classList.add('open');
                document.body.classList.add('modal-open');
            });
        });

        // Close logic
        if (closeMusicBtn) {
            closeMusicBtn.addEventListener('click', () => {
                musicModal.classList.remove('open');
                document.body.classList.remove('modal-open');
            });
        }

        musicModal.addEventListener('click', (e) => {
            if (e.target === musicModal) {
                musicModal.classList.remove('open');
                document.body.classList.remove('modal-open');
            }
        });
    }
});

// PARALLAX ENGINE
let parallaxActive = false;
let parallaxItems = [];
let parallaxTicking = false;

function initParallax() {
    parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));

    if (!parallaxItems.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (reducedMotion || isMobile) return;

    parallaxActive = true;
}

function destroyParallax() {
    parallaxActive = false;

    parallaxItems.forEach(el => {
        el.style.transform = 'translate3d(0,0,0)';
    });
}

function onParallaxScroll() {
    if (!parallaxActive || parallaxTicking) return;

    parallaxTicking = true;

    requestAnimationFrame(() => {
        const vh = window.innerHeight;

        parallaxItems.forEach(el => {
            const speed = parseFloat(el.dataset.speed || '0.2');
            const rect = el.getBoundingClientRect();
            const progress = (rect.top + rect.height) / (vh + rect.height);
            const offset = (0.5 - progress) * speed * 120;

            el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });

        parallaxTicking = false;
    });
}
// MAGAZINE PAGE SLIDE
const pages = Array.from(document.querySelectorAll('.mag-page'));
let currentPage = 0;

function updatePages(index) {
    pages.forEach((page, i) => {
        page.classList.remove('active', 'previous');

        if (i === index) page.classList.add('active');
        if (i < index) page.classList.add('previous');
    });
}

updatePages(0);

function onScrollIntent(e) {
    if (!document.body.classList.contains('mode-fun')) return;

    e.preventDefault();

    const delta = e.deltaY || e.wheelDelta || -e.detail;
    if (Math.abs(delta) < 20) return;

    if (delta > 0 && currentPage < pages.length - 1) {
        currentPage++;
    } else if (delta < 0 && currentPage > 0) {
        currentPage--;
    }

    updatePages(currentPage);
}

document.addEventListener('wheel', onScrollIntent, { passive: false });
document.addEventListener('touchmove', onScrollIntent, { passive: false });
