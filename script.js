const projects = [
  {
    category: "Ferramenta web",
    title: "Divisor de PDF",
    status: "Publicado",
    description:
      "Ferramenta web para enviar PDFs, comprimir e dividir em partes menores, com download do resultado em PDF único ou ZIP.",
    problem:
      "Arquivos PDF grandes demais para anexar ou enviar, exigindo divisão e compressão manual e trabalhosa.",
    solution:
      "Processamento assíncrono que comprime e divide os PDFs por tamanho, com acompanhamento de progresso e download direto do resultado.",
    tags: ["Python", "Django", "Celery", "Ghostscript"],
    coverImage: "divisor-pdf.png",
    liveUrl: "https://divisor.stolben.com/",
    githubUrl: "https://github.com/rigst/divisor_pdf"
  },
  {
    category: "Sistema web",
    title: "Sistema de Orçamentos",
    status: "Publicado",
    description:
      "Plataforma web para gestão de orçamentos, com foco em produtividade, organização de processos e experiência de uso simples.",
    problem:
      "Processo de orçamento fragmentado, com pouca padronização e retrabalho operacional.",
    solution:
      "Fluxo centralizado para criação, acompanhamento e evolução de orçamentos em ambiente web.",
    tags: ["Python", "Django", "PostgreSQL", "Nginx"],
    coverImage: "sistema-orcamentos.png",
    liveUrl: "https://orcamentos.stolben.com/",
    githubUrl: "https://github.com/rigst/sistema_orcamentos"
  },
  {
    category: "Sistema web",
    title: "Sistema Finanças",
    status: "Publicado",
    description:
      "Sistema voltado ao controle financeiro, organização de lançamentos e acompanhamento objetivo da operação.",
    problem:
      "Gestão financeira dispersa, com baixa visibilidade sobre lançamentos, organização e acompanhamento diário.",
    solution:
      "Centralização das rotinas financeiras em uma interface web clara, com foco em controle, rastreabilidade e produtividade.",
    tags: ["Python", "Django", "PostgreSQL"],
    coverImage: "sistema-financas.png",
    liveUrl: "https://financas.stolben.com/",
    githubUrl: "https://github.com/rigst/sistema_financas"
  },
  {
    category: "Aplicação web",
    title: "Sistema Vetorial",
    status: "Em desenvolvimento",
    description:
      "Aplicação web estruturada para organizar fluxos específicos de operação, com interface objetiva e navegação simples.",
    problem:
      "Processos operacionais com necessidade de maior padronização, clareza de uso e acompanhamento contínuo.",
    solution:
      "Estruturação do processo em sistema web com foco em consistência de uso, fluidez operacional e base pronta para evolução.",
    tags: ["Python", "Django", "Web"],
    liveUrl: "https://vetorial.stolben.com/",
    githubUrl: "https://github.com/rigst/sistema_vetorial"
  }
];

const header = document.getElementById("siteHeader");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const yearEl = document.getElementById("year");
const projectsGrid = document.getElementById("projectsGrid");
const contactForm = document.getElementById("contactForm");

yearEl.textContent = new Date().getFullYear();

function renderProjects() {
  projectsGrid.innerHTML = projects
    .map(
      (project) => {
        const isInDevelopment = project.status === "Em desenvolvimento";
        // Projetos em desenvolvimento não exibem print real: usam um placeholder com ícone.
        const useImage = Boolean(project.coverImage) && !isInDevelopment;
        const coverClass = useImage
          ? "project-cover with-image"
          : isInDevelopment
            ? "project-cover is-placeholder"
            : "project-cover";
        const coverStyle = useImage
          ? ` style="background-image: url('${encodeURI(project.coverImage)}');"`
          : "";
        const coverContent = isInDevelopment
          ? `<div class="project-cover-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>Em desenvolvimento</span>
            </div>`
          : "";
        const cardClass = isInDevelopment ? "project-card reveal is-development" : "project-card reveal";
        const links = [
          project.liveUrl && project.liveUrl !== "#"
            ? `<a href="${project.liveUrl}" target="_blank" rel="noreferrer">Ver projeto ↗</a>`
            : "",
          project.githubUrl && project.githubUrl !== "#"
            ? `<a href="${project.githubUrl}" target="_blank" rel="noreferrer">GitHub ↗</a>`
            : ""
        ]
          .filter(Boolean)
          .join("");

        return `
        <article class="${cardClass}" data-live-url="${project.liveUrl}" role="link" tabindex="0">
          <div class="${coverClass}"${coverStyle}>${coverContent}</div>

          <div class="project-body">
            <div class="project-top">
              <h3 class="project-title">${project.title}</h3>
              <span class="project-status">${project.status}</span>
            </div>

            <p class="project-description">${project.description}</p>

            <dl class="project-case">
              <div>
                <dt>Problema</dt>
                <dd>${project.problem}</dd>
              </div>
              <div>
                <dt>Solução</dt>
                <dd>${project.solution}</dd>
              </div>
            </dl>

            <ul class="tags">
              ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
            </ul>

            <div class="project-links">${links}</div>
          </div>
        </article>
      `;
      }
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

function setupProjectCardNavigation() {
  projectsGrid.addEventListener("click", (event) => {
    const clickedInteractive = event.target.closest("a, button");
    if (clickedInteractive) return;

    const card = event.target.closest(".project-card");
    if (!card) return;

    const liveUrl = card.dataset.liveUrl;
    if (liveUrl && liveUrl !== "#") {
      window.open(liveUrl, "_blank", "noopener,noreferrer");
    }
  });

  projectsGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".project-card");
    if (!card) return;

    event.preventDefault();
    const liveUrl = card.dataset.liveUrl;
    if (liveUrl && liveUrl !== "#") {
      window.open(liveUrl, "_blank", "noopener,noreferrer");
    }
  });
}

function setupContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nome = (formData.get("nome") || "").toString().trim();
    const contexto = (formData.get("contexto") || "").toString().trim();
    const prazo = (formData.get("prazo") || "").toString().trim();

    const subject = encodeURIComponent("Quero conversar sobre um projeto");
    const body = encodeURIComponent(
      `Nome: ${nome}\n\nContexto e objetivo:\n${contexto}\n\nPrazo desejado: ${prazo}`
    );

    window.location.href = `mailto:rodrigo.stolben@gmail.com?subject=${subject}&body=${body}`;
  });
}

renderProjects();
setupRevealObserver();
setupSectionObserver();
setupProjectCardNavigation();
setupContactForm();
window.addEventListener("scroll", onScrollHeader);
onScrollHeader();
