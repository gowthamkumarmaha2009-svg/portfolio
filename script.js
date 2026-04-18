const roles = ["Data Scientist", "ML Engineer", "Full Stack Builder"];
const typingTarget = document.getElementById("typing");
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navLinksContainer = document.querySelector(".nav-links");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section, main header")];
const heroVisual = document.querySelector(".hero-visual");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTyping() {
    const currentRole = roles[roleIndex];
    typingTarget.textContent = currentRole.slice(0, charIndex);

    if (!isDeleting && charIndex < currentRole.length) {
        charIndex += 1;
    } else if (isDeleting && charIndex > 0) {
        charIndex -= 1;
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    const delay = isDeleting ? 55 : 105;
    const pause = charIndex === currentRole.length && !isDeleting ? 1100 : 0;
    setTimeout(runTyping, delay + pause);
}

function setMenuState(open) {
    document.body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
}

function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${progress})`;
}

function updateActiveNav() {
    let currentId = "home";

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        const isActive = link.getAttribute("href") === `#${currentId}`;
        link.classList.toggle("is-active", isActive);
    });
}

function formatName(name) {
    return name.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(value) {
    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function inferTag(repo) {
    const combined = `${repo.name} ${repo.description || ""}`.toLowerCase();

    if (combined.includes("ml") || combined.includes("ai") || combined.includes("model")) {
        return "Machine Learning";
    }

    if (combined.includes("web") || combined.includes("react") || combined.includes("portfolio")) {
        return "Web Experience";
    }

    if (combined.includes("data") || combined.includes("analytics")) {
        return "Data Project";
    }

    return "Engineering Build";
}

function createProjectCard(repo) {
    const card = document.createElement("article");
    card.className = "glass-card project-card reveal";
    card.tabIndex = 0;

    card.innerHTML = `
        <div class="project-top">
            <span class="project-tag">${inferTag(repo)}</span>
            <h3>${formatName(repo.name)}</h3>
            <p>${repo.description || "A focused build that demonstrates practical engineering, thoughtful problem solving, and clear execution."}</p>
        </div>
        <div class="project-bottom">
            <span class="project-link">View Repository</span>
            <span class="project-updated">Updated ${formatDate(repo.updated_at)}</span>
        </div>
    `;

    const openRepo = () => window.open(repo.html_url, "_blank", "noopener,noreferrer");
    card.addEventListener("click", openRepo);
    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openRepo();
        }
    });

    return card;
}

async function loadProjects() {
    const container = document.getElementById("repo-container");
    container.innerHTML = `
        <article class="glass-card project-card">
            <div class="project-top">
                <span class="project-tag">Loading</span>
                <h3>Fetching latest work</h3>
                <p>Pulling project data from GitHub to populate this section with the most recent repositories.</p>
            </div>
        </article>
    `;

    try {
        const response = await fetch("https://api.github.com/users/gowthamkumarmaha2009-svg/repos");
        const repos = await response.json();

        if (!Array.isArray(repos)) {
            throw new Error("Unexpected GitHub response");
        }

        const curated = repos
            .filter(repo => !repo.fork && repo.name !== "portfolio")
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6);

        container.innerHTML = "";

        curated.forEach(repo => {
            container.appendChild(createProjectCard(repo));
        });

        observeReveals();
    } catch (error) {
        container.innerHTML = `
            <article class="glass-card project-card">
                <div class="project-top">
                    <span class="project-tag">Unavailable</span>
                    <h3>Projects could not load</h3>
                    <p>GitHub data is not reachable right now. The rest of the portfolio remains available.</p>
                </div>
            </article>
        `;
    }
}

const revealItems = new Set();

function observeReveals() {
    document.querySelectorAll(".reveal").forEach(item => revealItems.add(item));
    revealObserver.disconnect();
    revealItems.forEach(item => revealObserver.observe(item));
}

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.16
});

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 720) {
            setMenuState(false);
        }
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
        setMenuState(false);
    }
});

window.addEventListener("scroll", () => {
    updateScrollProgress();
    updateActiveNav();
}, { passive: true });

window.addEventListener("pointermove", event => {
    if (!heroVisual || window.innerWidth < 981) {
        return;
    }

    const x = (event.clientX / window.innerWidth - 0.5) * 16;
    const y = (event.clientY / window.innerHeight - 0.5) * 16;
    heroVisual.style.transform = `translate3d(${x * 0.45}px, ${y * 0.45}px, 0)`;
});

window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        setMenuState(false);
    }
});

observeReveals();
updateScrollProgress();
updateActiveNav();
loadProjects();
runTyping();

window.requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
});
