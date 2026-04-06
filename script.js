const projects = [
  {
    category: "Projeto web",
    title: "Nome do Projeto 1",
    status: "Publicado",
    description:
      "Descreva em uma frase o que esse projeto faz, para quem ele serve e por que ele é interessante.",
    tags: ["HTML", "CSS", "JavaScript"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    category: "Python",
    title: "Nome do Projeto 2",
    status: "Publicado",
    description:
      "Use esse espaço para explicar o problema resolvido e o que você aprendeu construindo a aplicação.",
    tags: ["Python", "Flask", "API"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    category: "Dados",
    title: "Nome do Projeto 3",
    status: "Publicado",
    description:
      "Pode ser dashboard, automação, visualização ou qualquer projeto já publicado que mereça vitrine.",
    tags: ["Python", "Pandas", "Streamlit"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    category: "Experimento",
    title: "Nome do Projeto 4",
    status: "Publicado",
    description:
      "Troque este card por outro projeto, ou remova tudo que não estiver publicado para manter o portfólio afiado.",
    tags: ["JavaScript", "UI", "Responsivo"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

const header = document.getElementById("siteHeader");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const yearEl = document.getElementById("year");
const projectsGrid = document.getElementById("projectsGrid");

yearEl.textContent = new Date().getFullYear();

function renderProjects() {
  projectsGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal">
          <div class="project-cover">
            <span class="project-pill">${project.category}</span>
          </div>

          <div class="project-body">
            <div class="project-top">
              <h3 class="project-title">${project.title}</h3>
              <span class="project-status">${project.status}</span>
            </div>

            <p class="project-description">${project.description}</p>

            <ul class="tags">
              ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
            </ul>

            <div class="project-links">
              <a href="${project.liveUrl}" target="_blank" rel="noreferrer">Ver projeto ↗</a>
              <a href="${project.githubUrl}" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function onScrollHeader() {
  if (window.scrollY > 12) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function setupRevealObserver() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14
    }
  );

  revealElements.forEach((item) => revealObserver.observe(item));
}

function setupSectionObserver() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    {
      rootMargin: "-40% 0px -45% 0px",
      threshold: 0.01
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

renderProjects();
setupRevealObserver();
setupSectionObserver();
window.addEventListener("scroll", onScrollHeader);
onScrollHeader();
