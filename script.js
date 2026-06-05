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

const ARROW_UP_RIGHT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';

function tagsMarkup(project) {
  return project.tags.map((tag) => `<li>${tag}</li>`).join("");
}

function linksMarkup(project) {
  return [
    project.liveUrl && project.liveUrl !== "#"
      ? `<a href="${project.liveUrl}" target="_blank" rel="noreferrer">Ver projeto ${ARROW_UP_RIGHT}</a>`
      : "",
    project.githubUrl && project.githubUrl !== "#"
      ? `<a href="${project.githubUrl}" target="_blank" rel="noreferrer">GitHub ${ARROW_UP_RIGHT}</a>`
      : ""
  ]
    .filter(Boolean)
    .join("");
}

function featuredCard(project) {
  const bg = project.coverImage
    ? `<div class="pc-media"><img src="${encodeURI(project.coverImage)}" alt="${project.title}" loading="lazy" /></div>`
    : "";
  return `
    <article class="project-card project-featured reveal" data-live-url="${project.liveUrl}" role="link" tabindex="0">
      ${bg}
      <div class="pc-content">
        <div class="pc-badges">
          <span class="badge badge-pub-dark"><span class="dot"></span> ${project.status}</span>
          <span class="pc-kicker">Destaque</span>
        </div>
        <div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <ul class="pc-tags">${tagsMarkup(project)}</ul>
          <div class="project-links">${linksMarkup(project)}</div>
        </div>
      </div>
    </article>`;
}

function mediumCard(project) {
  const media = project.coverImage
    ? `<div class="pc-media"><img src="${encodeURI(project.coverImage)}" alt="${project.title}" loading="lazy" /></div>`
    : "";
  return `
    <article class="project-card project-medium reveal" data-live-url="${project.liveUrl}" role="link" tabindex="0">
      ${media}
      <div class="pc-body">
        <div class="pc-head">
          <h3>${project.title}</h3>
          <span class="badge badge-pub">${project.status}</span>
        </div>
        <p>${project.description}</p>
        <ul class="pc-tags">${tagsMarkup(project)}</ul>
        <div class="project-links">${linksMarkup(project)}</div>
      </div>
    </article>`;
}

function devCard(project) {
  return `
    <article class="project-card project-dev reveal" data-live-url="${project.liveUrl}" role="link" tabindex="0">
      <div class="glow" aria-hidden="true"></div>
      <div class="pc-main">
        <span class="badge badge-dev"><span class="dot"></span> ${project.status}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <div class="pc-side">
        <ul class="pc-tags">${tagsMarkup(project)}</ul>
        <span class="pc-arrow" aria-hidden="true">${ARROW_UP_RIGHT}</span>
      </div>
    </article>`;
}

function renderProjects() {
  let featuredUsed = false;
  projectsGrid.innerHTML = projects
    .map((project) => {
      if (project.status === "Em desenvolvimento") return devCard(project);
      if (!featuredUsed) {
        featuredUsed = true;
        return featuredCard(project);
      }
      return mediumCard(project);
    })
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
