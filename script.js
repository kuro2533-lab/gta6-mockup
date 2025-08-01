document.addEventListener("DOMContentLoaded", () => {
    // --- STATE & CONSTANTS ---
    const state = {
        audio: { hasInteracted: false, isPlaying: false },
        cursor: { x: 0, y: 0, outlineX: 0, outlineY: 0 },
    };

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const audioEl = document.getElementById("background-music");

    // --- MOCK DATA (Global) ---
    // IMAGE UPDATE: Replaced placeholder URLs with your new edition covers
    const editionsData = [
        {
            name: "Standard Edition",
            price: "$69.99",
            art: "standard-edition.png",
            features: ["Base Game", "Pre-Order Bonus Content"],
        },
        {
            name: "Deluxe Edition",
            price: "$89.99",
            art: "deluxe-edition.png",
            features: [
                "Base Game",
                "Digital Artbook & Soundtrack",
                "Pre-Order Bonus Content",
                "Vice City Style Pack",
                "3 Days Early Access",
            ],
        },
        {
            name: "Collector's Edition",
            price: "$149.99",
            art: "collectors-edition.png",
            features: [
                "Base Game",
                "Digital Artbook & Soundtrack",
                "Vice City Style Pack",
                "3 Days Early Access",
                "Pre-Order Bonus Content",
                "Steelbook Case",
                "Physical Vice City Map",
                "Collectible Figurine",
            ],
        },
    ];
    const mapHotspots = [
        {
            id: 1,
            name: "Vice Beach",
            position: { top: "75%", left: "85%" },
            teaser: "Sun, sand, and sin. The iconic heart of Vice City's vibrant, and often dangerous, coastline.",
        },
        {
            id: 2,
            name: "Gator Keys",
            position: { top: "80%", left: "30%" },
            teaser: "A sprawling swampland where nature is just as treacherous as the locals. Watch your step.",
        },
        {
            id: 3,
            name: "Kelly County",
            position: { top: "25%", left: "45%" },
            teaser: "The rural heartland of Leonida. Small towns with big secrets and even bigger guns.",
        },
        {
            id: 4,
            name: "Downtown Vice",
            position: { top: "40%", left: "60%" },
            teaser: "The concrete jungle where corporate greed meets street-level crime. High-rises and low-lives.",
        },
    ];
    const galleryImages = [
        "neon-nights.png",
        "swamp-showdown.png",
        "freeway-fury.png",
        "beach-vibes.png",
        "downtown-dealings.png",
    ];
    const hypeWallData = [
        {
            type: "tweet",
            user: "SynthwaveSteve",
            handle: "@VCSynth",
            text: "Rockstar just dropped the trailer and my boss is wondering why I'm crying at my desk. #GTAVI #ViceCity",
            pfp: "unnamed.png",
            verified: true,
        },
        {
            type: "comment",
            user: "GatorGlider",
            text: "I've literally booked the next 3 years off work for this.",
            pfp: "florida.jpg",
        },
        {
            type: "comment",
            user: "80sPowerBallad",
            text: "Take my money, my car, and my kidney.",
            pfp: "tts.jpg",
        },
        {
            type: "tweet",
            user: "RockstarGames",
            handle: "@RockstarGames",
            text: "Watch the first trailer for Grand Theft Auto VI. See you in Leonida.",
            pfp: "rockstar.png",
            verified: true,
        },
        {
            type: "comment",
            user: "NeonNinja",
            text: "NGL, even after an year long wait the hype for GTA VI is still MASSIVE",
            pfp: "LTF.jpg",
        },
        {
            type: "comment",
            user: "FloridaManActual",
            text: "Finally, a game that understands my lifestyle. #GatorKeys",
            pfp: "snek.jpg",
        },
    ];

    // --- PAGE-SPECIFIC INITIALIZERS ---
    function initHomePage() {
        const countdownTimerEl = document.getElementById("countdown-timer");
        const typingTextEl = document.getElementById("typing-text");
        const prebookBtn = document.getElementById("prebook-btn");
        if (!countdownTimerEl || !typingTextEl || !prebookBtn) return;

        const engineSound = new Audio(
            "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
        );
        engineSound.volume = 0.2;
        prebookBtn.addEventListener("mouseenter", () => {
            engineSound.currentTime = 0;
            engineSound.play().catch((e) => {});
        });

        const calculateTimeLeft = () => {
            const difference = +new Date("2025-10-17T09:00:00") - +new Date();
            return difference > 0
                ? {
                      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                      minutes: Math.floor((difference / 1000 / 60) % 60),
                      seconds: Math.floor((difference / 1000) % 60),
                  }
                : { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        setInterval(() => {
            const timeLeft = calculateTimeLeft();
            countdownTimerEl.innerHTML = Object.entries(timeLeft)
                .map(
                    ([interval, value]) => `
                <div class="flex flex-col items-center p-2 md:p-4 bg-black bg-opacity-60 rounded-lg backdrop-blur-sm border border-cyan-500/20">
                    <div class="text-3xl md:text-6xl font-bold text-cyan-400" style="text-shadow: 0 0 8px #00FFFF;">${String(value).padStart(2, "0")}</div>
                    <div class="text-xs md:text-sm uppercase text-pink-500 tracking-widest">${interval}</div>
                </div>`,
                )
                .join("");
        }, 1000);

        let displayedText = "",
            isDeleting = false,
            fullText = "WELCOME TO LEONIDA...";
        const type = () => {
            displayedText = isDeleting
                ? fullText.substring(0, displayedText.length - 1)
                : fullText.substring(0, displayedText.length + 1);
            typingTextEl.innerHTML = `> ${displayedText}<span class="animate-ping">|</span>`;
            if (!isDeleting && displayedText === fullText)
                setTimeout(() => (isDeleting = true), 3000);
            else if (isDeleting && displayedText === "") isDeleting = false;
            setTimeout(type, isDeleting ? 100 : 150);
        };
        setTimeout(type, 150);
    }

    function initPreBookingPage() {
        const form = document.getElementById("prebook-form");
        const confirmationSplash = document.getElementById(
            "confirmation-splash",
        );
        const platformSelector = document.getElementById("platform-selector");
        if (!form || !confirmationSplash || !platformSelector) return;

        let selectedPlatform = "ps5";
        platformSelector.innerHTML = ["ps5", "xbox", "pc"]
            .map(
                (p) =>
                    `<button type="button" data-platform="${p}" class="platform-btn p-4 rounded-lg border-2 transition-all duration-200 ${selectedPlatform === p ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(0,255,255,0.5)]" : "border-gray-700 bg-gray-900/50 hover:border-cyan-600"}"><span class="text-white font-bold uppercase">${p}</span></button>`,
            )
            .join("");

        platformSelector.addEventListener("click", (e) => {
            const btn = e.target.closest(".platform-btn");
            if (!btn) return;
            selectedPlatform = btn.dataset.platform;
            platformSelector.querySelectorAll(".platform-btn").forEach((b) => {
                const isActive = b.dataset.platform === selectedPlatform;
                b.classList.toggle("border-cyan-400", isActive);
                b.classList.toggle("bg-cyan-400/20", isActive);
                b.classList.toggle(
                    "shadow-[0_0_15px_rgba(0,255,255,0.5)]",
                    isActive,
                );
                b.classList.toggle("border-gray-700", !isActive);
                b.classList.toggle("bg-gray-900/50", !isActive);
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            confirmationSplash.classList.remove("hidden");
            confirmationSplash.style.display = "flex";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 4000);
        });
    }

    function initEditionsPage() {
        const cardsContainer = document.getElementById(
            "editions-cards-container",
        );
        const compareBtn = document.getElementById("compare-btn");
        const tableContainer = document.getElementById(
            "comparison-table-container",
        );
        if (!cardsContainer || !compareBtn || !tableContainer) return;

        let showCompareTable = false;
        cardsContainer.innerHTML = editionsData
            .map(
                (edition) => `
            <div class="group perspective-1000">
                <div class="relative w-full h-[450px] transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 group-hover:scale-105">
                    <div class="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_30px_rgba(255,0,229,0.3)] flex flex-col justify-end p-6 bg-cover bg-center" style="background-image: url('${edition.art}')">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div class="relative z-10"><h3 class="text-3xl font-bold text-white">${edition.name}</h3><p class="text-xl text-pink-400 font-mono">${edition.price}</p></div>
                    </div>
                    <div class="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.4)] bg-gray-900/90 backdrop-blur-xl rotate-y-180 p-6 text-left">
                        <h3 class="text-2xl font-bold text-cyan-400 mb-4">${edition.name}</h3>
                        <ul class="space-y-3">${edition.features.map((feature) => `<li class="flex items-start"><i data-lucide="chevrons-right" class="text-pink-500 w-5 h-5 mr-2 mt-1 flex-shrink-0"></i><span class="text-white">${feature}</span></li>`).join("")}</ul>
                    </div>
                </div>
            </div>`,
            )
            .join("");

        const allFeatures = [
            ...new Set(editionsData.flatMap((e) => e.features)),
        ];
        tableContainer.innerHTML = `<table class="w-full text-left text-white bg-black/60 backdrop-blur-sm rounded-lg">
                <thead><tr class="border-b border-pink-500/50"><th class="p-4 font-bold uppercase tracking-wider">Feature</th>${editionsData.map((e) => `<th class="p-4 font-bold uppercase tracking-wider text-pink-400">${e.name}</th>`).join("")}</tr></thead>
                <tbody>${allFeatures.map((feature) => `<tr class="border-b border-gray-800"><td class="p-4">${feature}</td>${editionsData.map((e) => `<td class="p-4 text-center">${e.features.includes(feature) ? `<span class="text-cyan-400 text-2xl" style="text-shadow: 0 0 8px #00FFFF;">✓</span>` : `<span class="text-gray-600 text-2xl">✗</span>`}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>`;

        compareBtn.addEventListener("click", () => {
            showCompareTable = !showCompareTable;
            tableContainer.classList.toggle("hidden", !showCompareTable);
            compareBtn.textContent = showCompareTable
                ? "Hide Comparison"
                : "Compare Editions";
        });
    }

    function initMapPage() {
        const mapContainer = document.getElementById("map-container");
        const modal = document.getElementById("map-modal");
        if (!mapContainer || !modal) return;

        const modalTitle = document.getElementById("modal-title");
        const modalText = document.getElementById("modal-text");
        const modalCloseBtn = document.getElementById("modal-close-btn");

        const hotspotsHTML = mapHotspots
            .map(
                (hotspot) =>
                    `<button data-id="${hotspot.id}" class="hotspot-btn absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2" style="top: ${hotspot.position.top}; left: ${hotspot.position.left};"><div class="w-full h-full rounded-full bg-pink-500 animate-pulse"></div><div class="absolute inset-0 rounded-full bg-pink-500/50 scale-150 animate-ping"></div></button>`,
            )
            .join("");
        mapContainer.insertAdjacentHTML("beforeend", hotspotsHTML);

        mapContainer.addEventListener("click", (e) => {
            const btn = e.target.closest(".hotspot-btn");
            if (!btn) return;
            const hotspot = mapHotspots.find((h) => h.id == btn.dataset.id);
            if (hotspot) {
                modalTitle.textContent = hotspot.name;
                modalText.textContent = hotspot.teaser;
                modal.classList.remove("hidden");
                modal.style.display = "flex";
            }
        });

        const closeModal = () => {
            modal.classList.add("hidden");
            modal.style.display = "none";
        };
        modal.addEventListener("click", closeModal);
        modal
            .querySelector("div")
            .addEventListener("click", (e) => e.stopPropagation());
        modalCloseBtn.addEventListener("click", closeModal);
    }

    function initGalleryPage() {
        const wrapper = document.getElementById("gallery-wrapper"),
            track = document.getElementById("carousel-track"),
            dotsContainer = document.getElementById("carousel-dots");
        if (!wrapper || !track || !dotsContainer) return;

        const title = document.getElementById("gallery-title"),
            toggleBtn = document.getElementById("light-dark-toggle");
        let currentIndex = 0,
            isDarkMode = true;

        track.innerHTML = galleryImages
            .map(
                (src) =>
                    `<img src="${src}" class="w-full h-full object-cover flex-shrink-0" />`,
            )
            .join("");
        dotsContainer.innerHTML = galleryImages
            .map(
                (_, i) =>
                    `<button data-index="${i}" class="carousel-dot w-3 h-3 rounded-full transition-all"></button>`,
            )
            .join("");

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dotsContainer
                .querySelectorAll(".carousel-dot")
                .forEach((dot, i) => {
                    dot.classList.toggle("bg-pink-500", i === currentIndex);
                    dot.classList.toggle("scale-125", i === currentIndex);
                    dot.classList.toggle("bg-white/50", i !== currentIndex);
                });
        };

        document
            .getElementById("carousel-next")
            .addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % galleryImages.length;
                updateCarousel();
            });
        document
            .getElementById("carousel-prev")
            .addEventListener("click", () => {
                currentIndex =
                    (currentIndex - 1 + galleryImages.length) %
                    galleryImages.length;
                updateCarousel();
            });
        dotsContainer.addEventListener("click", (e) => {
            if (e.target.matches(".carousel-dot")) {
                currentIndex = parseInt(e.target.dataset.index);
                updateCarousel();
            }
        });

        toggleBtn.addEventListener("click", () => {
            isDarkMode = !isDarkMode;
            wrapper.classList.toggle("bg-black", isDarkMode);
            wrapper.classList.toggle("bg-gray-200", !isDarkMode);
            title.classList.toggle("text-white", isDarkMode);
            title.classList.toggle("text-black", !isDarkMode);
            title.style.textShadow = isDarkMode ? "0 0 15px #FF00E5" : "none";
            toggleBtn.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
        });

        updateCarousel();
    }

    function initHypeWallPage() {
        const container = document.getElementById("hype-wall-container");
        if (!container) return;
        // STYLE FIX: Changed img to a div with background-image for perfect circles
        container.innerHTML = hypeWallData
            .map(
                (item) => `
            <div class="break-inside-avoid p-5 bg-gray-900/80 backdrop-blur-md rounded-xl border border-cyan-500/30 text-left">
                <div class="flex items-center mb-3">
                    <div style="background-image: url('${item.pfp}')" class="w-12 h-12 rounded-full mr-4 border-2 border-pink-500 bg-cover bg-center flex-shrink-0"></div>
                    <div>
                        <p class="font-bold text-white flex items-center">${item.user} ${item.verified ? '<i data-lucide="check-circle" class="w-4 h-4 ml-1 text-cyan-400"></i>' : ""}</p>
                        ${item.type === "tweet" ? `<p class="text-sm text-gray-400">${item.handle}</p>` : ""}
                    </div>
                </div>
                <p class="text-white">${item.text}</p>
            </div>`,
            )
            .join("");
    }

    // --- GLOBAL INITIALIZATION ---
    function initAudioPlayer() {
        const playBtn = document.getElementById("audio-play-btn");
        const muteBtn = document.getElementById("audio-mute-btn");
        if (!audioEl || !playBtn || !muteBtn) return;

        audioEl.volume = 0.1;

        const updatePlayIcon = () => {
            playBtn.innerHTML = audioEl.paused
                ? '<i data-lucide="play"></i>'
                : '<i data-lucide="pause"></i>';
            lucide.createIcons();
        };

        const updateMuteIcon = () => {
            muteBtn.innerHTML = audioEl.muted
                ? '<i data-lucide="volume-x"></i>'
                : '<i data-lucide="volume-2"></i>';
            lucide.createIcons();
        };

        const startAudioOnInteraction = () => {
            if (state.audio.hasInteracted) return;
            state.audio.hasInteracted = true;
            sessionStorage.setItem("gtaAudioInteracted", "true");
            if (sessionStorage.getItem("gtaAudioIsPlaying") !== "false") {
                audioEl
                    .play()
                    .catch((e) =>
                        console.log("Audio play failed on first interaction."),
                    );
            }
        };
        document.body.addEventListener("click", startAudioOnInteraction, {
            once: true,
        });

        const togglePlay = () => {
            if (audioEl.paused) {
                audioEl
                    .play()
                    .catch((e) => console.error("Audio play failed:", e));
            } else {
                audioEl.pause();
            }
        };

        audioEl.onplay = () => {
            sessionStorage.setItem("gtaAudioIsPlaying", "true");
            updatePlayIcon();
        };
        audioEl.onpause = () => {
            sessionStorage.setItem("gtaAudioIsPlaying", "false");
            updatePlayIcon();
        };
        audioEl.ontimeupdate = () => {
            sessionStorage.setItem("gtaAudioTime", audioEl.currentTime);
        };

        const toggleMute = () => {
            audioEl.muted = !audioEl.muted;
            sessionStorage.setItem("gtaAudioIsMuted", audioEl.muted);
            updateMuteIcon();
        };

        playBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlay();
        });
        muteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMute();
        });

        const savedTime = sessionStorage.getItem("gtaAudioTime");
        if (savedTime) {
            audioEl.currentTime = parseFloat(savedTime);
        }
        const isMuted = sessionStorage.getItem("gtaAudioIsMuted") === "true";
        audioEl.muted = isMuted;
        updateMuteIcon();

        if (
            sessionStorage.getItem("gtaAudioInteracted") === "true" &&
            sessionStorage.getItem("gtaAudioIsPlaying") === "true"
        ) {
            audioEl.play().catch((e) => {
                console.log("Autoplay between pages was prevented.");
                sessionStorage.setItem("gtaAudioIsPlaying", "false");
                updatePlayIcon();
            });
        }
        updatePlayIcon();
    }

    function initCursor() {
        window.addEventListener("mousemove", (e) => {
            state.cursor.x = e.clientX;
            state.cursor.y = e.clientY;
            cursorDot.style.left = `${state.cursor.x}px`;
            cursorDot.style.top = `${state.cursor.y}px`;
        });
        const animateOutline = () => {
            state.cursor.outlineX +=
                (state.cursor.x - state.cursor.outlineX) * 0.1;
            state.cursor.outlineY +=
                (state.cursor.y - state.cursor.outlineY) * 0.1;
            cursorOutline.style.left = `${state.cursor.outlineX}px`;
            cursorOutline.style.top = `${state.cursor.outlineY}px`;
            requestAnimationFrame(animateOutline);
        };
        animateOutline();
    }

    function initNav() {
        const navLinks = [
            "home",
            "pre-book",
            "editions",
            "map",
            "gallery",
            "hype",
        ];
        const desktopNav = document.getElementById("desktop-nav");
        const mobileNav = document.getElementById("mobile-nav");
        const pageName = document.body.id.replace("page-", "");

        desktopNav.innerHTML = navLinks
            .map((link) => {
                const pageFile =
                    link === "home" ? "index.html" : `${link}.html`;
                const isActive = link === pageName;
                return `<a href="${pageFile}" class="capitalize font-semibold text-sm transition-all duration-300 ${isActive ? "text-pink-500" : "text-gray-300 hover:text-white"}">${link.replace("-", " ")}</a>`;
            })
            .join("");

        mobileNav.innerHTML = navLinks
            .map((link) => {
                const pageFile =
                    link === "home" ? "index.html" : `${link}.html`;
                const isSelected = link === pageName;
                return `<option value="${pageFile}" ${isSelected ? "selected" : ""}>${link.replace("-", " ").toUpperCase()}</option>`;
            })
            .join("");

        mobileNav.addEventListener("change", (e) => {
            window.location.href = e.target.value;
        });
    }

    function init() {
        const pageId = document.body.id;
        if (pageId === "page-home") initHomePage();
        else if (pageId === "page-pre-book") initPreBookingPage();
        else if (pageId === "page-editions") initEditionsPage();
        else if (pageId === "page-map") initMapPage();
        else if (pageId === "page-gallery") initGalleryPage();
        else if (pageId === "page-hype") initHypeWallPage();

        initNav();
        initAudioPlayer();
        initCursor();
        lucide.createIcons();
        document.getElementById("footer-year").textContent =
            new Date().getFullYear();
    }

    init();
});
