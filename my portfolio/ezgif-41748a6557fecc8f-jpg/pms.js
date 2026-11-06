/**
 * Project Management System (PMS)
 * Handles: Project Storage, Admin Authentication, CRUD Operations,
 * Image Uploads, and Dynamic Portfolio Rendering.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "nanati_projects";
  const AUTH_KEY = "nanati_admin_auth";

  // Default fallback projects matching reference design
  const DEFAULT_PROJECTS = [
    {
      id: "proj-1",
      title: "DormLink",
      description:
        "A smart dorm management system for Ethiopian university students featuring room allocation, maintenance requests, and digital announcements.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      githubUrl: "https://github.com/nanati-abdisa/dormlink",
      liveUrl: "https://dormlink-demo.netlify.app",
      screenshot:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='600' height='360' fill='%23120612'/><rect x='20' y='20' width='560' height='320' rx='12' fill='%231c0a1b' stroke='%23ff2d78' stroke-opacity='0.4'/><circle cx='45' cy='45' r='6' fill='%23ff2d78'/><circle cx='65' cy='45' r='6' fill='%23ff75a0'/><circle cx='85' cy='45' r='6' fill='%234caf50'/><rect x='110' y='38' width='220' height='14' rx='7' fill='%23ffffff' fill-opacity='0.15'/><rect x='40' y='75' width='160' height='240' rx='8' fill='%23280c25'/><rect x='215' y='75' width='345' height='70' rx='8' fill='%23ff2d78' fill-opacity='0.12' stroke='%23ff2d78' stroke-opacity='0.3'/><text x='235' y='115' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff'>DormLink • Management System</text><rect x='215' y='160' width='165' height='155' rx='8' fill='%23280c25'/><rect x='395' y='160' width='165' height='155' rx='8' fill='%23280c25'/><circle cx='120' cy='150' r='36' fill='%23ff2d78' fill-opacity='0.25'/><path d='M105 155 L120 135 L135 155 Z' fill='%23ff75a0'/><rect x='60' y='210' width='120' height='10' rx='5' fill='%23ffffff' fill-opacity='0.2'/><rect x='75' y='230' width='90' height='8' rx='4' fill='%23ff75a0' fill-opacity='0.4'/></svg>",
      createdAt: "2026-10-15T10:00:00.000Z",
    },
    {
      id: "proj-2",
      title: "University Budget App",
      description:
        "Comprehensive financial planning and expense tracking system to monitor university budgets, departmental grants, and expense categories.",
      technologies: ["Java", "OOP", "MySQL", "JavaFX"],
      githubUrl: "https://github.com/nanati-abdisa/university-budget-app",
      liveUrl: "https://budget-tracker-preview.netlify.app",
      screenshot:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='600' height='360' fill='%23080e1a'/><rect x='20' y='20' width='560' height='320' rx='12' fill='%230e1628' stroke='%2300d8ff' stroke-opacity='0.4'/><circle cx='45' cy='45' r='6' fill='%23ff5252'/><circle cx='65' cy='45' r='6' fill='%23ffd740'/><circle cx='85' cy='45' r='6' fill='%2300e676'/><rect x='40' y='75' width='520' height='60' rx='8' fill='%2300d8ff' fill-opacity='0.12' stroke='%2300d8ff' stroke-opacity='0.3'/><text x='60' y='110' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff'>University Budget Tracker • Analytics</text><rect x='40' y='150' width='245' height='165' rx='8' fill='%23141e34'/><rect x='305' y='150' width='255' height='165' rx='8' fill='%23141e34'/><path d='M60 270 L110 230 L160 250 L210 190 L260 210' fill='none' stroke='%2300d8ff' stroke-width='4'/><circle cx='210' cy='190' r='6' fill='%2300d8ff'/><rect x='330' y='180' width='200' height='16' rx='8' fill='%2300d8ff' fill-opacity='0.25'/><rect x='330' y='210' width='160' height='16' rx='8' fill='%23ff2d78' fill-opacity='0.25'/><rect x='330' y='240' width='180' height='16' rx='8' fill='%2300e676' fill-opacity='0.25'/></svg>",
      createdAt: "2026-10-20T10:00:00.000Z",
    },
    {
      id: "proj-3",
      title: "Student Registration",
      description:
        "A simple and responsive student registration web portal with live input validation, dynamic student records storage, and printable receipts.",
      technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      githubUrl: "https://github.com/nanati-abdisa/student-registration",
      liveUrl: "https://student-registration-web.netlify.app",
      screenshot:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='600' height='360' fill='%23120612'/><rect x='20' y='20' width='560' height='320' rx='12' fill='%231c0a1b' stroke='%23ff75a0' stroke-opacity='0.4'/><circle cx='45' cy='45' r='6' fill='%23ff2d78'/><circle cx='65' cy='45' r='6' fill='%23ff75a0'/><circle cx='85' cy='45' r='6' fill='%234caf50'/><rect x='40' y='80' width='250' height='230' rx='8' fill='%23280c25'/><rect x='310' y='80' width='250' height='230' rx='8' fill='%23280c25'/><text x='60' y='115' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23ffffff'>Student Information</text><rect x='60' y='135' width='210' height='26' rx='6' fill='%23ffffff' fill-opacity='0.1'/><rect x='60' y='175' width='210' height='26' rx='6' fill='%23ffffff' fill-opacity='0.1'/><rect x='60' y='215' width='210' height='26' rx='6' fill='%23ffffff' fill-opacity='0.1'/><rect x='60' y='255' width='120' height='32' rx='16' fill='%23ff2d78'/><text x='330' y='115' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23ffffff'>Registered Records</text><rect x='330' y='135' width='210' height='40' rx='6' fill='%23ff2d78' fill-opacity='0.15'/><rect x='330' y='185' width='210' height='40' rx='6' fill='%23ffffff' fill-opacity='0.08'/><rect x='330' y='235' width='210' height='40' rx='6' fill='%23ffffff' fill-opacity='0.08'/></svg>",
      createdAt: "2026-10-25T10:00:00.000Z",
    },
  ];

  class ProjectManager {
    constructor() {
      this.projects = [];
      this.activeEditingId = null;
      this.pendingDeleteId = null;
      this.uploadedImageData = null;
      this.init();
    }

    async init() {
      this.loadFromStorage();
      await this.syncWithServer();
      this.renderPublicProjects();
      this.bindEvents();
      this.checkUrlHash();
    }

    // ------------------------------------------------------------------------
    // Storage & Synchronization
    // ------------------------------------------------------------------------
    loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.projects = JSON.parse(stored);
        } else {
          this.projects = [...DEFAULT_PROJECTS];
          this.saveToStorage(this.projects);
        }
      } catch (e) {
        console.error("Failed to parse localStorage projects:", e);
        this.projects = [...DEFAULT_PROJECTS];
      }
    }

    saveToStorage(projects) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      } catch (e) {
        console.warn("LocalStorage quota or storage error:", e);
      }
    }

    async syncWithServer() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const serverProjects = await res.json();
          if (Array.isArray(serverProjects) && serverProjects.length > 0) {
            this.projects = serverProjects;
            this.saveToStorage(this.projects);
          }
        }
      } catch (err) {
        // Offline or standalone mode - localStorage handles it seamlessly
      }
    }

    async persistProjects() {
      this.saveToStorage(this.projects);
      this.renderPublicProjects();
      this.renderAdminProjects();
      this.renderModalProjects();

      // Background sync to server if running
      try {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.projects),
        });
      } catch (e) {
        // Handled silently
      }
    }

    // ------------------------------------------------------------------------
    // Public Portfolio Rendering
    // ------------------------------------------------------------------------
    getTagClass(tech) {
      const t = tech.toLowerCase();
      if (t.includes("react")) return "tag-react";
      if (t.includes("node")) return "tag-node";
      if (t.includes("mongo")) return "tag-mongo";
      if (t.includes("java") && !t.includes("script")) return "tag-java";
      if (t.includes("oop")) return "tag-oop";
      if (t.includes("html")) return "tag-html";
      if (t.includes("css")) return "tag-css";
      if (t.includes("js") || t.includes("javascript")) return "tag-js";
      return "";
    }

    renderCardHtml(proj) {
      const tagsHtml = proj.technologies
        .map(
          (t) =>
            `<span class="tag ${this.getTagClass(t)}">${escapeHtml(t)}</span>`,
        )
        .join("");

      const fallbackImg =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='600' height='360' fill='%23120612'/><text x='300' y='180' fill='%23ff2d78' font-size='20' font-family='sans-serif' text-anchor='middle'>Project Screenshot</text></svg>";
      const imgSrc = proj.screenshot || fallbackImg;

      return `
        <div class="project-card" data-id="${proj.id}">
          <div class="project-thumb-container">
            <img src="${imgSrc}" alt="${escapeHtml(proj.title)}" class="project-thumb" loading="lazy" />
          </div>
          <div class="project-info">
            <h4 class="project-title">${escapeHtml(proj.title)}</h4>
            <p class="project-desc">${escapeHtml(proj.description)}</p>
            <div class="project-tags">
              ${tagsHtml}
            </div>
          </div>
          <div class="project-card-actions">
            <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-glass project-action-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary project-action-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Live Demo</span>
            </a>
          </div>
        </div>
      `;
    }

    renderPublicProjects() {
      const container = document.getElementById("projects-grid");
      if (!container) return;

      if (this.projects.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--pms-text-muted);">No projects added yet. Click Admin to add your first project!</div>`;
        return;
      }

      // On home page, display up to first 3 projects or all
      const displayList = this.projects.slice(0, 3);
      container.innerHTML = displayList
        .map((p) => this.renderCardHtml(p))
        .join("");
    }

    // ------------------------------------------------------------------------
    // "View All Projects" Modal
    // ------------------------------------------------------------------------
    openAllProjectsModal() {
      const modal = document.getElementById("modal-all-projects");
      if (!modal) return;
      this.renderModalProjects();
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    closeAllProjectsModal() {
      const modal = document.getElementById("modal-all-projects");
      if (!modal) return;
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    renderModalProjects(filter = "") {
      const grid = document.getElementById("all-projects-grid");
      const countBadge = document.getElementById("modal-projects-count");
      if (!grid) return;

      const f = filter.toLowerCase().trim();
      const filtered = this.projects.filter((p) => {
        if (!f) return true;
        return (
          p.title.toLowerCase().includes(f) ||
          p.description.toLowerCase().includes(f) ||
          p.technologies.some((t) => t.toLowerCase().includes(f))
        );
      });

      if (countBadge) {
        countBadge.textContent = `${this.projects.length} Project${this.projects.length !== 1 ? "s" : ""}`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--pms-text-muted);">No matching projects found for "${escapeHtml(filter)}".</div>`;
        return;
      }

      grid.innerHTML = filtered.map((p) => this.renderCardHtml(p)).join("");
    }

    // ------------------------------------------------------------------------
    // Admin Authentication
    // ------------------------------------------------------------------------
    isAdminLoggedIn() {
      return sessionStorage.getItem(AUTH_KEY) === "true";
    }

    openAdminPortal() {
      if (this.isAdminLoggedIn()) {
        this.openAdminDashboard();
      } else {
        this.openAdminLogin();
      }
    }

    openAdminLogin() {
      const modal = document.getElementById("modal-admin-login");
      if (!modal) return;
      const pwdInput = document.getElementById("admin-password-input");
      const errorDiv = document.getElementById("admin-login-error");
      if (pwdInput) pwdInput.value = "";
      if (errorDiv) errorDiv.textContent = "";
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      if (pwdInput) setTimeout(() => pwdInput.focus(), 100);
    }

    closeAdminLogin() {
      const modal = document.getElementById("modal-admin-login");
      if (!modal) return;
      modal.classList.remove("is-open");
      if (!document.querySelector(".pms-modal-backdrop.is-open")) {
        document.body.style.overflow = "";
      }
    }

    async handleAdminLogin(password) {
      const errorDiv = document.getElementById("admin-login-error");
      if (!password) {
        if (errorDiv) errorDiv.textContent = "Please enter password";
        return;
      }

      let success = false;
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (res.ok) {
          const data = await res.json();
          success = data.success;
        } else {
          success = password === "admin123";
        }
      } catch (err) {
        // Fallback local check
        success = password === "admin123";
      }

      if (success) {
        sessionStorage.setItem(AUTH_KEY, "true");
        this.closeAdminLogin();
        this.openAdminDashboard();
        showToast("Admin logged in successfully! 🔐");
      } else {
        if (errorDiv) errorDiv.textContent = "Incorrect password. Try again.";
      }
    }

    handleAdminLogout() {
      sessionStorage.removeItem(AUTH_KEY);
      this.closeAdminDashboard();
      showToast("Logged out of admin.");
      if (window.location.hash === "#admin") {
        history.replaceState(null, "", " ");
      }
    }

    // ------------------------------------------------------------------------
    // Admin Dashboard
    // ------------------------------------------------------------------------
    openAdminDashboard() {
      const modal = document.getElementById("modal-admin-dashboard");
      if (!modal) return;
      this.renderAdminProjects();
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    closeAdminDashboard() {
      const modal = document.getElementById("modal-admin-dashboard");
      if (!modal) return;
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    renderAdminProjects() {
      const list = document.getElementById("admin-projects-list");
      const countEl = document.getElementById("admin-total-count");
      if (!list) return;

      if (countEl) countEl.textContent = this.projects.length;

      if (this.projects.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--pms-text-muted);">No projects in database. Click "+ Add New Project" to create one.</div>`;
        return;
      }

      list.innerHTML = this.projects
        .map((p) => {
          const fallbackImg =
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='40' viewBox='0 0 60 40'><rect width='60' height='40' fill='%23120612'/></svg>";
          const imgSrc = p.screenshot || fallbackImg;
          return `
          <div class="pms-admin-item" data-id="${p.id}">
            <div class="pms-item-left">
              <img src="${imgSrc}" class="pms-item-thumb" alt="${escapeHtml(p.title)}" />
              <div class="pms-item-info">
                <div class="pms-item-title">${escapeHtml(p.title)}</div>
                <div class="pms-item-meta">
                  <span>${p.technologies.slice(0, 3).join(", ")}${p.technologies.length > 3 ? "..." : ""}</span>
                  <span>•</span>
                  <a href="${p.githubUrl}" target="_blank" style="color: var(--pms-light); text-decoration: none;">GitHub</a>
                  <span>•</span>
                  <a href="${p.liveUrl}" target="_blank" style="color: #00d8ff; text-decoration: none;">Live</a>
                </div>
              </div>
            </div>
            <div class="pms-item-actions">
              <button class="btn btn-glass pms-btn-sm btn-edit-project" data-id="${p.id}">
                ✏ Edit
              </button>
              <button class="btn btn-danger pms-btn-sm btn-delete-project" data-id="${p.id}">
                🗑 Delete
              </button>
            </div>
          </div>
        `;
        })
        .join("");
    }

    // ------------------------------------------------------------------------
    // Add / Edit Project Form
    // ------------------------------------------------------------------------
    openProjectForm(projectId = null) {
      const modal = document.getElementById("modal-project-form");
      const modalTitle = document.getElementById("form-modal-title");
      const form = document.getElementById("pms-project-form");
      if (!modal || !form) return;

      form.reset();
      this.activeEditingId = projectId;
      this.uploadedImageData = null;

      const previewBox = document.getElementById("pms-preview-box");
      const previewImg = document.getElementById("pms-preview-img");

      if (projectId) {
        // Edit Mode
        const proj = this.projects.find((p) => p.id === projectId);
        if (proj) {
          if (modalTitle) modalTitle.textContent = "Edit Project";
          document.getElementById("form-proj-title").value = proj.title || "";
          document.getElementById("form-proj-desc").value =
            proj.description || "";
          document.getElementById("form-proj-tech").value =
            proj.technologies.join(", ") || "";
          document.getElementById("form-proj-github").value =
            proj.githubUrl || "";
          document.getElementById("form-proj-live").value = proj.liveUrl || "";

          if (proj.screenshot) {
            this.uploadedImageData = proj.screenshot;
            if (previewImg) previewImg.src = proj.screenshot;
            if (previewBox) previewBox.style.display = "block";
          } else {
            if (previewBox) previewBox.style.display = "none";
          }
        }
      } else {
        // Add Mode
        if (modalTitle) modalTitle.textContent = "Add New Project";
        if (previewBox) previewBox.style.display = "none";
      }

      modal.classList.add("is-open");
    }

    closeProjectForm() {
      const modal = document.getElementById("modal-project-form");
      if (!modal) return;
      modal.classList.remove("is-open");
      this.activeEditingId = null;
      this.uploadedImageData = null;
    }

    handleImageUpload(file) {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Please upload a valid image file", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImageData = e.target.result;
        const previewBox = document.getElementById("pms-preview-box");
        const previewImg = document.getElementById("pms-preview-img");
        if (previewImg) previewImg.src = this.uploadedImageData;
        if (previewBox) previewBox.style.display = "block";
        showToast("Screenshot loaded! 🖼️");
      };
      reader.readAsDataURL(file);
    }

    async handleFormSubmit(e) {
      e.preventDefault();

      const title = document.getElementById("form-proj-title").value.trim();
      const description = document
        .getElementById("form-proj-desc")
        .value.trim();
      const techInput = document.getElementById("form-proj-tech").value.trim();
      const githubUrl = document
        .getElementById("form-proj-github")
        .value.trim();
      const liveUrl = document.getElementById("form-proj-live").value.trim();

      if (!title || !description || !techInput || !githubUrl || !liveUrl) {
        showToast("Please fill out all required fields", "error");
        return;
      }

      const technologies = techInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Default fallback thumbnail if none uploaded
      let screenshot = this.uploadedImageData;
      if (!screenshot) {
        screenshot = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='600' height='360' fill='%23120612'/><rect x='20' y='20' width='560' height='320' rx='12' fill='%231c0a1b' stroke='%23ff2d78' stroke-opacity='0.4'/><text x='300' y='180' fill='%23ff75a0' font-size='22' font-weight='bold' font-family='sans-serif' text-anchor='middle'>${escapeHtml(title)}</text></svg>`;
      }

      if (this.activeEditingId) {
        // Update existing project
        const index = this.projects.findIndex(
          (p) => p.id === this.activeEditingId,
        );
        if (index !== -1) {
          this.projects[index] = {
            ...this.projects[index],
            title,
            description,
            technologies,
            githubUrl,
            liveUrl,
            screenshot,
            updatedAt: new Date().toISOString(),
          };
          showToast(`Project "${title}" updated! 💾`);
        }
      } else {
        // Add new project
        const newProject = {
          id: "proj-" + Date.now(),
          title,
          description,
          technologies,
          githubUrl,
          liveUrl,
          screenshot,
          createdAt: new Date().toISOString(),
        };
        this.projects.unshift(newProject);
        showToast(`Project "${title}" added! ✨`);
      }

      await this.persistProjects();
      this.closeProjectForm();
    }

    // ------------------------------------------------------------------------
    // Delete Project Workflow
    // ------------------------------------------------------------------------
    promptDelete(projectId) {
      const proj = this.projects.find((p) => p.id === projectId);
      if (!proj) return;

      this.pendingDeleteId = projectId;
      const modal = document.getElementById("modal-delete-confirm");
      const text = document.getElementById("delete-confirm-text");
      if (text) {
        text.innerHTML = `Are you sure you want to permanently delete <strong>"${escapeHtml(proj.title)}"</strong>? This action cannot be undone.`;
      }
      if (modal) modal.classList.add("is-open");
    }

    closeDeleteModal() {
      const modal = document.getElementById("modal-delete-confirm");
      if (!modal) return;
      modal.classList.remove("is-open");
      this.pendingDeleteId = null;
    }

    async confirmDelete() {
      if (!this.pendingDeleteId) return;
      const proj = this.projects.find((p) => p.id === this.pendingDeleteId);
      const title = proj ? proj.title : "Project";

      this.projects = this.projects.filter(
        (p) => p.id !== this.pendingDeleteId,
      );
      await this.persistProjects();
      this.closeDeleteModal();
      showToast(`"${title}" deleted. 🗑️`);
    }

    // ------------------------------------------------------------------------
    // Event Binding
    // ------------------------------------------------------------------------
    bindEvents() {
      // "View All Projects" triggers
      const viewAllBtn = document.getElementById("btn-view-all-projects");
      if (viewAllBtn) {
        viewAllBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.openAllProjectsModal();
        });
      }

      const closeAllBtn = document.getElementById("btn-close-all-projects");
      if (closeAllBtn) {
        closeAllBtn.addEventListener("click", () =>
          this.closeAllProjectsModal(),
        );
      }

      // Live search filter in All Projects modal
      const searchInput = document.getElementById("projects-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.renderModalProjects(e.target.value);
        });
      }

      // Admin portal triggers
      const openAdminBtn = document.getElementById("btn-open-admin");
      if (openAdminBtn) {
        openAdminBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.openAdminPortal();
        });
      }

      // Admin login form
      const loginForm = document.getElementById("admin-login-form");
      if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const pwd = document.getElementById("admin-password-input").value;
          this.handleAdminLogin(pwd);
        });
      }

      const closeLoginBtn = document.getElementById("btn-close-admin-login");
      if (closeLoginBtn) {
        closeLoginBtn.addEventListener("click", () => this.closeAdminLogin());
      }

      // Admin dashboard controls
      const closeDashboardBtn = document.getElementById(
        "btn-close-admin-dashboard",
      );
      if (closeDashboardBtn) {
        closeDashboardBtn.addEventListener("click", () =>
          this.closeAdminDashboard(),
        );
      }

      const logoutBtn = document.getElementById("btn-admin-logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => this.handleAdminLogout());
      }

      const addNewBtn = document.getElementById("btn-add-new-project");
      if (addNewBtn) {
        addNewBtn.addEventListener("click", () => this.openProjectForm(null));
      }

      // Delegated events for Edit / Delete buttons in Admin List
      const adminList = document.getElementById("admin-projects-list");
      if (adminList) {
        adminList.addEventListener("click", (e) => {
          const editBtn = e.target.closest(".btn-edit-project");
          if (editBtn) {
            const id = editBtn.dataset.id;
            this.openProjectForm(id);
            return;
          }

          const deleteBtn = e.target.closest(".btn-delete-project");
          if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            this.promptDelete(id);
            return;
          }
        });
      }

      // Project Form Submit & Cancel
      const projectForm = document.getElementById("pms-project-form");
      if (projectForm) {
        projectForm.addEventListener("submit", (e) => this.handleFormSubmit(e));
      }

      const cancelFormBtn = document.getElementById("btn-cancel-project-form");
      if (cancelFormBtn) {
        cancelFormBtn.addEventListener("click", () => this.closeProjectForm());
      }

      const closeFormBtn = document.getElementById("btn-close-project-form");
      if (closeFormBtn) {
        closeFormBtn.addEventListener("click", () => this.closeProjectForm());
      }

      // Image upload dropzone & file picker
      const dropzone = document.getElementById("pms-upload-dropzone");
      const fileInput = document.getElementById("form-proj-file");

      if (dropzone && fileInput) {
        dropzone.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", (e) => {
          if (e.target.files && e.target.files[0]) {
            this.handleImageUpload(e.target.files[0]);
          }
        });

        dropzone.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropzone.classList.add("dragover");
        });

        dropzone.addEventListener("dragleave", () => {
          dropzone.classList.remove("dragover");
        });

        dropzone.addEventListener("drop", (e) => {
          e.preventDefault();
          dropzone.classList.remove("dragover");
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.handleImageUpload(e.dataTransfer.files[0]);
          }
        });
      }

      // Remove preview image
      const removePreviewBtn = document.getElementById("btn-remove-preview");
      if (removePreviewBtn) {
        removePreviewBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.uploadedImageData = null;
          const previewBox = document.getElementById("pms-preview-box");
          if (previewBox) previewBox.style.display = "none";
          if (fileInput) fileInput.value = "";
        });
      }

      // Delete confirmation modal actions
      const confirmDeleteBtn = document.getElementById("btn-confirm-delete");
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => this.confirmDelete());
      }

      const cancelDeleteBtn = document.getElementById("btn-cancel-delete");
      if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () =>
          this.closeDeleteModal(),
        );
      }

      const closeDeleteModalBtn = document.getElementById(
        "btn-close-delete-modal",
      );
      if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener("click", () =>
          this.closeDeleteModal(),
        );
      }

      // Close modal on backdrop click
      document.querySelectorAll(".pms-modal-backdrop").forEach((backdrop) => {
        backdrop.addEventListener("click", (e) => {
          if (e.target === backdrop) {
            backdrop.classList.remove("is-open");
            if (!document.querySelector(".pms-modal-backdrop.is-open")) {
              document.body.style.overflow = "";
            }
          }
        });
      });

      // Keyboard shortcuts: ESC to close modals, Ctrl+Shift+A for Admin
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          document
            .querySelectorAll(".pms-modal-backdrop.is-open")
            .forEach((m) => {
              m.classList.remove("is-open");
            });
          document.body.style.overflow = "";
        }

        if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
          e.preventDefault();
          this.openAdminPortal();
        }
      });
    }

    checkUrlHash() {
      if (window.location.hash === "#admin") {
        setTimeout(() => this.openAdminPortal(), 200);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Utility Functions
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message, type = "success") {
    let container = document.getElementById("pms-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "pms-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "pms-toast";
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 20);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  // Initialize PMS when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.projectManager = new ProjectManager();
    });
  } else {
    window.projectManager = new ProjectManager();
  }
})();
