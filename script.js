// Typing Effect
const roles = ["Data Scientist", "Web Developer", "ML Engineer"];
let i = 0, j = 0, current = "", deleting = false;

function type() {
    current = roles[i];
    document.getElementById("typing").textContent = current.substring(0, j);

    if (!deleting && j < current.length) j++;
    else if (deleting && j > 0) j--;
    else {
        deleting = !deleting;
        if (!deleting) i = (i + 1) % roles.length;
    }

    setTimeout(type, deleting ? 50 : 100);
}
type();


// 🔥 FETCH YOUR GITHUB PROJECTS
fetch("https://api.github.com/users/gowthamkumarmaha2009-svg/repos")
.then(res => res.json())
.then(data => {
    const container = document.getElementById("repo-container");

    data
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .forEach(repo => {

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description available"}</p>
                <p>⭐ ${repo.stargazers_count}</p>
            `;

            card.onclick = () => {
                window.open(repo.html_url, "_blank");
            };

            container.appendChild(card);
        });
});