// Typing effect
const roles = ["Data Scientist", "ML Engineer", "Web Developer"];
let i = 0, j = 0, deleting = false;

function type() {
    let text = roles[i];
    document.getElementById("typing").textContent = text.substring(0, j);

    if (!deleting && j < text.length) j++;
    else if (deleting && j > 0) j--;
    else {
        deleting = !deleting;
        if (!deleting) i = (i + 1) % roles.length;
    }

    setTimeout(type, deleting ? 50 : 100);
}
type();


// 🔥 Format repo names nicely
function formatName(name) {
    return name
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}


// 🔥 Fetch GitHub projects (clean + filtered)
fetch("https://api.github.com/users/gowthamkumarmaha2009-svg/repos")
.then(res => res.json())
.then(data => {
    const container = document.getElementById("repo-container");

    data
    .filter(repo => 
        !repo.fork &&
        repo.name !== "portfolio"
    )
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 6)
    .forEach(repo => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${formatName(repo.name)}</h3>
            <p>${repo.description || "Project showcasing development and problem-solving skills."}</p>
        `;

        card.onclick = () => window.open(repo.html_url, "_blank");

        container.appendChild(card);
    });
});


// Smooth reveal animation
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();