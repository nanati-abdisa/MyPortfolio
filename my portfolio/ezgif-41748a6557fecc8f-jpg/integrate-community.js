const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Link community.css
if (!html.includes('community.css')) {
  html = html.replace('</head>', '  <link rel="stylesheet" href="community.css">\n</head>');
}

// 2. Add Community link to navigation
if (!html.includes('href="#community"')) {
  html = html.replace(
    '<a href="#contact" class="nav-link">Contact</a>',
    '<a href="#community" class="nav-link">Community</a>\n        <a href="#contact" class="nav-link">Contact</a>'
  );
}

// 3. Update sections array in scroll-spy script
html = html.replace(
  "const sections = ['home', 'about', 'skills', 'projects', 'contact'];",
  "const sections = ['home', 'about', 'skills', 'projects', 'community', 'contact'];"
);

// 4. Community Section Markup to insert before #contact section (or before bento-grid-bot)
const communitySectionMarkup = `
    <!-- ====================================================================
         Developer Community Section
         ==================================================================== -->
    <section id="community" class="animate-on-scroll" style="margin-bottom: 40px;">
      <div class="community-section-header">
        <div class="community-pill">
          <span>🚀</span>
          <span>Developer Ecosystem</span>
        </div>
        <h2 class="community-title">Let's Build a Developer Community Together!</h2>
        <p class="community-intro-text">
          Technology grows when we learn and build together. Join our developer community to connect with other programmers, share your projects, exchange ideas, learn new technologies, and collaborate on exciting projects.
        </p>
      </div>

      <!-- Top Community Grid: Join Form + Share & Invite -->
      <div class="community-top-grid">
        <!-- Join Community Card -->
        <div class="glass-card comm-form-card animate-on-scroll">
          <h3 class="card-title">
            <span class="card-title-icon">👥</span>
            <span>Join Our Community</span>
          </h3>
          <form id="comm-registration-form">
            <div class="comm-form-grid">
              <div class="pms-form-group">
                <label class="pms-label" for="comm-input-name">Full Name *</label>
                <input type="text" id="comm-input-name" class="pms-input" placeholder="e.g. Alex Chen" required />
              </div>

              <div class="pms-form-group">
                <label class="pms-label" for="comm-input-github">GitHub Username *</label>
                <input type="text" id="comm-input-github" class="pms-input" placeholder="e.g. alexchen" required />
              </div>

              <div class="pms-form-group comm-form-full">
                <label class="pms-label" for="comm-input-url">GitHub Profile URL <span>(Auto-generated)</span></label>
                <input type="url" id="comm-input-url" class="pms-input" placeholder="https://github.com/alexchen" />
              </div>

              <div class="pms-form-group">
                <label class="pms-label" for="comm-input-email">Email Address <span>(Optional)</span></label>
                <input type="email" id="comm-input-email" class="pms-input" placeholder="For direct collaboration invites" />
              </div>

              <div class="pms-form-group">
                <label class="pms-label" for="comm-select-area">Area of Interest *</label>
                <select id="comm-select-area" class="pms-input" style="cursor: pointer;" required>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="AI &amp; Machine Learning">AI &amp; Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud &amp; DevOps">Cloud &amp; DevOps</option>
                </select>
              </div>

              <div class="pms-form-group comm-form-full">
                <label class="pms-label" for="comm-input-bio">Short Bio / What are you building? <span>(Optional)</span></label>
                <input type="text" id="comm-input-bio" class="pms-input" placeholder="e.g. Building full-stack React apps and learning Rust" />
              </div>
            </div>

            <!-- Consent Checkbox -->
            <div class="comm-consent-box">
              <input type="checkbox" id="comm-check-consent" required />
              <label class="comm-consent-label" for="comm-check-consent">
                I agree to have my name, GitHub profile, and area of interest displayed in the community directory and allow other developers to connect with me for collaboration.
              </label>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 13px;">
              <span>🚀 Join the Community</span>
            </button>
          </form>
        </div>

        <!-- Share & Invite Card -->
        <div class="glass-card comm-share-card animate-on-scroll delay-1">
          <div>
            <h3 class="card-title">
              <span class="card-title-icon">📢</span>
              <span>Share &amp; Invite Friends</span>
            </h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
              Invite fellow programmers, classmates, and tech enthusiasts to join the community and build open-source projects together.
            </p>

            <!-- Invitation Link Box -->
            <div class="comm-invite-box">
              <span class="comm-invite-link" id="comm-invite-url-text">Loading invitation link...</span>
              <button type="button" class="comm-btn-copy" id="btn-copy-invite-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
              </button>
            </div>

            <!-- Social Share Buttons -->
            <div class="comm-share-buttons">
              <button type="button" class="comm-share-btn btn-native-share" id="btn-native-share">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Share Community</span>
              </button>

              <a href="#" target="_blank" rel="noopener noreferrer" class="comm-share-btn btn-whatsapp" id="btn-share-whatsapp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.78 14.04c-.24.68-1.2 1.26-1.72 1.34-.48.07-1.1.1-3.21-.77-2.69-1.12-4.41-3.87-4.54-4.05-.13-.18-1.09-1.45-1.09-2.77 0-1.31.69-1.96.93-2.22.25-.26.54-.33.72-.33.18 0 .36 0 .52.01.17.01.4.06.62.54.24.51.8 1.96.87 2.1.07.15.12.33.02.53-.1.2-.15.33-.3.51-.15.17-.31.39-.44.52-.15.14-.3.3-.13.6.17.29.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.15.47.13.64-.07.18-.21.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1.18 1.77.89 2.12.2.1.34.15.39.23.05.08.05.47-.19 1.15z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              <a href="#" target="_blank" rel="noopener noreferrer" class="comm-share-btn btn-telegram" id="btn-share-telegram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                </svg>
                <span>Telegram</span>
              </a>

              <a href="#" target="_blank" rel="noopener noreferrer" class="comm-share-btn btn-linkedin-share" id="btn-share-linkedin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <!-- Community Founder Reference -->
          <div class="comm-creator-badge">
            <div class="comm-creator-left">
              <img src="https://avatars.githubusercontent.com/nanati-abdisa" alt="Nanati Abdisa" class="comm-creator-avatar"
                   onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'36\\' height=\\'36\\'><rect width=\\'36\\' height=\\'36\\' fill=\\'%23ff2d78\\'/></svg>';" />
              <div>
                <div class="comm-creator-name">Nanati Abdisa</div>
                <div class="comm-creator-role">Community Organizer &amp; Student Developer</div>
              </div>
            </div>
            <a href="https://github.com/nanati-abdisa" target="_blank" rel="noopener noreferrer" class="btn btn-glass pms-btn-sm" style="text-decoration: none;">
              Follow on GitHub
            </a>
          </div>
        </div>
      </div>

      <!-- Community Members Directory Card -->
      <div class="glass-card comm-directory-card animate-on-scroll" id="comm-members-directory">
        <div class="card-header-action" style="margin-bottom: 16px;">
          <h3 class="card-title" style="margin-bottom: 0;">
            <span class="card-title-icon">🌐</span>
            <span>Community Directory</span>
            <span class="pms-badge" id="comm-members-count">4 Developers</span>
          </h3>
          <input type="text" id="comm-search-input" class="pms-search-input" placeholder="Search members..." style="width: 220px;" />
        </div>

        <!-- Filter Chips -->
        <div class="comm-filter-bar">
          <div class="comm-filter-chips">
            <button type="button" class="comm-chip active" data-filter="All">All Areas</button>
            <button type="button" class="comm-chip" data-filter="Web Development">Web Development</button>
            <button type="button" class="comm-chip" data-filter="Mobile Development">Mobile</button>
            <button type="button" class="comm-chip" data-filter="AI &amp; Machine Learning">AI &amp; ML</button>
            <button type="button" class="comm-chip" data-filter="Cybersecurity">Cybersecurity</button>
            <button type="button" class="comm-chip" data-filter="Data Science">Data Science</button>
            <button type="button" class="comm-chip" data-filter="Cloud &amp; DevOps">Cloud &amp; DevOps</button>
          </div>
        </div>

        <!-- Members Grid -->
        <div class="comm-members-grid" id="comm-members-grid">
          <!-- Dynamically populated from Community System -->
        </div>
      </div>
    </section>
`;

if (!html.includes('id="community"')) {
  // Insert right before bottom bento grid (Tools & Platforms + Contact Me)
  html = html.replace('<div class="bento-grid-bot">', `${communitySectionMarkup}\n    <div class="bento-grid-bot">`);
}

// 5. Add Collaboration Modal markup
const collabModalMarkup = `
  <!-- Collaboration Modal -->
  <div id="modal-collaborate" class="pms-modal-backdrop" aria-hidden="true">
    <div class="pms-modal" style="max-width: 480px;">
      <div class="pms-modal-header">
        <div class="pms-modal-title-group">
          <span class="card-title-icon">🤝</span>
          <h3>Collaborate on Projects</h3>
        </div>
        <button class="pms-close-btn" id="btn-close-collab-modal" aria-label="Close">✕</button>
      </div>
      <div class="pms-modal-body" style="text-align: center; padding: 28px 24px;">
        <h4 id="collab-modal-name" style="font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 4px;">Developer Name</h4>
        <div id="collab-modal-handle" style="color: var(--comm-light); font-family: monospace; font-size: 0.95rem; margin-bottom: 12px;">@github_username</div>
        <div id="collab-modal-area" class="comm-member-badge" style="margin-bottom: 16px;">Area of Interest</div>
        <p id="collab-modal-bio" style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 24px;">
          Developer bio and collaboration interests.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a id="collab-modal-github-link" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="justify-content: center; text-decoration: none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
            <span>Visit GitHub Profile &amp; Repos</span>
          </a>
          <a id="collab-modal-email-link" href="#" class="btn btn-glass" style="justify-content: center; text-decoration: none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Send Collaboration Email</span>
          </a>
        </div>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modal-collaborate"')) {
  html = html.replace('<!-- PMS Toast Container -->', `${collabModalMarkup}\n  <!-- PMS Toast Container -->`);
}

// 6. Link community.js script
if (!html.includes('src="community.js"')) {
  html = html.replace('</body>', '  <script src="community.js"></script>\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully integrated community section into index.html');
