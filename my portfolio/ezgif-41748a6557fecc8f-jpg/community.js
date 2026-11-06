/**
 * Developer Community System
 * Handles: Registration, Sharing, Member Directory Filtering,
 * Collaborations, and Admin Moderation.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'nanati_community_members';

  const DEFAULT_MEMBERS = [
    {
      id: 'mem-1',
      name: 'Nanati Abdisa',
      githubUsername: 'nanati-abdisa',
      githubUrl: 'https://github.com/nanati-abdisa',
      email: 'nanatiabdisa@gmail.com',
      areaOfInterest: 'Web Development',
      consent: true,
      joinedAt: '2026-10-01T10:00:00.000Z',
      bio: 'Founder & Student Developer passionate about building modern web applications.'
    },
    {
      id: 'mem-2',
      name: 'Dawit Tadesse',
      githubUsername: 'dawittad',
      githubUrl: 'https://github.com/dawittad',
      email: 'dawit.dev@example.com',
      areaOfInterest: 'AI & Machine Learning',
      consent: true,
      joinedAt: '2026-10-18T14:30:00.000Z',
      bio: 'Exploring neural networks, computer vision, and building AI-driven solutions.'
    },
    {
      id: 'mem-3',
      name: 'Selamawit Bekele',
      githubUsername: 'selam-bekele',
      githubUrl: 'https://github.com/selam-bekele',
      email: 'selam.sec@example.com',
      areaOfInterest: 'Cybersecurity',
      consent: true,
      joinedAt: '2026-10-24T09:15:00.000Z',
      bio: 'Ethical hacking enthusiast, web security researcher, and CTF solver.'
    },
    {
      id: 'mem-4',
      name: 'Yohannes Haile',
      githubUsername: 'yohannes-h',
      githubUrl: 'https://github.com/yohannes-h',
      email: 'yohannes.mobile@example.com',
      areaOfInterest: 'Mobile Development',
      consent: true,
      joinedAt: '2026-11-02T16:45:00.000Z',
      bio: 'Flutter and Android developer crafting fluid, accessible mobile experiences.'
    }
  ];

  class CommunityManager {
    constructor() {
      this.members = [];
      this.activeFilter = 'All';
      this.searchQuery = '';
      this.pendingDeleteId = null;
      this.init();
    }

    async init() {
      this.loadFromStorage();
      await this.syncWithServer();
      this.renderDirectory();
      this.initInviteUrls();
      this.bindEvents();
      this.extendAdminDashboard();
    }

    // ------------------------------------------------------------------------
    // Storage & Sync
    // ------------------------------------------------------------------------
    loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.members = JSON.parse(stored);
        } else {
          this.members = [...DEFAULT_MEMBERS];
          this.saveToStorage(this.members);
        }
      } catch (e) {
        this.members = [...DEFAULT_MEMBERS];
      }
    }

    saveToStorage(members) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
      } catch (e) {}
    }

    async syncWithServer() {
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const serverMembers = await res.json();
          if (Array.isArray(serverMembers) && serverMembers.length > 0) {
            this.members = serverMembers;
            this.saveToStorage(this.members);
          }
        }
      } catch (e) {}
    }

    async persistMembers() {
      this.saveToStorage(this.members);
      this.renderDirectory();
      this.renderAdminMembers();

      try {
        await fetch('/api/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.members)
        });
      } catch (e) {}
    }

    // ------------------------------------------------------------------------
    // Member Directory Rendering
    // ------------------------------------------------------------------------
    renderDirectory() {
      const grid = document.getElementById('comm-members-grid');
      const countBadge = document.getElementById('comm-members-count');
      if (!grid) return;

      const consented = this.members.filter(m => m.consent === true);

      if (countBadge) {
        countBadge.textContent = `${consented.length} Developer${consented.length !== 1 ? 's' : ''}`;
      }

      const filtered = consented.filter(m => {
        const matchesFilter = (this.activeFilter === 'All') || (m.areaOfInterest === this.activeFilter);
        const q = this.searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
          m.name.toLowerCase().includes(q) ||
          m.githubUsername.toLowerCase().includes(q) ||
          m.areaOfInterest.toLowerCase().includes(q) ||
          (m.bio && m.bio.toLowerCase().includes(q))
        );
        return matchesFilter && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
            No developers found matching the criteria. Be the first to join in this category!
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(m => {
        const initials = m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const avatarUrl = `https://avatars.githubusercontent.com/${encodeURIComponent(m.githubUsername)}?size=96`;

        return `
          <div class="comm-member-card" data-id="${m.id}">
            <div>
              <div class="comm-member-top">
                <div class="comm-member-avatar-wrap">
                  <img src="${avatarUrl}" alt="${escapeHtml(m.name)}" class="comm-member-avatar"
                       onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\'><rect width=\\'48\\' height=\\'48\\' fill=\\'%23260822\\'/><text x=\\'24\\' y=\\'30\\' fill=\\'%23ff75a0\\' font-size=\\'18\\' font-family=\\'sans-serif\\' text-anchor=\\'middle\\'>${initials}</text></svg>';" />
                </div>
                <div class="comm-member-details">
                  <div class="comm-member-name">${escapeHtml(m.name)}</div>
                  <a href="${m.githubUrl}" target="_blank" rel="noopener noreferrer" class="comm-member-github">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                    <span>@${escapeHtml(m.githubUsername)}</span>
                  </a>
                </div>
              </div>

              <div class="comm-member-badge">${escapeHtml(m.areaOfInterest)}</div>
              <p class="comm-member-bio">${escapeHtml(m.bio || 'Passionate programmer collaborating and learning new technologies.')}</p>
            </div>

            <button class="comm-btn-collab btn-collab-trigger" data-id="${m.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Connect / Collaborate</span>
            </button>
          </div>
        `;
      }).join('');
    }

    // ------------------------------------------------------------------------
    // Sharing & Invite Links
    // ------------------------------------------------------------------------
    getInvitationUrl() {
      const base = window.location.origin + window.location.pathname;
      return base.replace(/\/+$/, '') + '/#community?ref=invite';
    }

    initInviteUrls() {
      const inviteUrl = this.getInvitationUrl();
      const linkEl = document.getElementById('comm-invite-url-text');
      if (linkEl) linkEl.textContent = inviteUrl;

      // WhatsApp
      const waBtn = document.getElementById('btn-share-whatsapp');
      if (waBtn) {
        const text = encodeURIComponent(`Join Nanati Abdisa's Developer Community! Connect with developers, collaborate on projects, and build together: ${inviteUrl}`);
        waBtn.href = `https://api.whatsapp.com/send?text=${text}`;
      }

      // Telegram
      const tgBtn = document.getElementById('btn-share-telegram');
      if (tgBtn) {
        const text = encodeURIComponent(`Join our Developer Community! Let's build and code together 🚀`);
        tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${text}`;
      }

      // LinkedIn
      const liBtn = document.getElementById('btn-share-linkedin');
      if (liBtn) {
        liBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`;
      }
    }

    // ------------------------------------------------------------------------
    // Registration Form
    // ------------------------------------------------------------------------
    async handleRegistration(e) {
      e.preventDefault();

      const name = document.getElementById('comm-input-name').value.trim();
      let username = document.getElementById('comm-input-github').value.trim().replace(/^@/, '');
      const profileUrl = document.getElementById('comm-input-url').value.trim() || `https://github.com/${username}`;
      const email = document.getElementById('comm-input-email').value.trim();
      const area = document.getElementById('comm-select-area').value;
      const bio = document.getElementById('comm-input-bio').value.trim();
      const consent = document.getElementById('comm-check-consent').checked;

      if (!name || !username) {
        showToast('Please provide your name and GitHub username', 'error');
        return;
      }

      if (!consent) {
        showToast('Please check the consent box to display your profile', 'error');
        return;
      }

      // Check if username already exists
      const existing = this.members.find(m => m.githubUsername.toLowerCase() === username.toLowerCase());
      if (existing) {
        showToast(`@${username} is already part of the community! ✨`);
        return;
      }

      const newMember = {
        id: 'mem-' + Date.now(),
        name,
        githubUsername: username,
        githubUrl: profileUrl,
        email,
        areaOfInterest: area || 'Web Development',
        consent: true,
        bio: bio || 'Passionate programmer collaborating and learning new technologies.',
        joinedAt: new Date().toISOString()
      };

      this.members.unshift(newMember);
      await this.persistMembers();

      document.getElementById('comm-registration-form').reset();
      showToast(`Welcome to the community, ${name}! 🎉`);

      // Scroll to member directory to see new card
      const dir = document.getElementById('comm-members-directory');
      if (dir) dir.scrollIntoView({ behavior: 'smooth' });
    }

    // ------------------------------------------------------------------------
    // Collaboration Modal
    // ------------------------------------------------------------------------
    openCollabModal(memberId) {
      const member = this.members.find(m => m.id === memberId);
      if (!member) return;

      const modal = document.getElementById('modal-collaborate');
      if (!modal) return;

      document.getElementById('collab-modal-name').textContent = member.name;
      document.getElementById('collab-modal-handle').textContent = '@' + member.githubUsername;
      document.getElementById('collab-modal-area').textContent = member.areaOfInterest;
      document.getElementById('collab-modal-bio').textContent = member.bio || 'Excited to collaborate on software projects.';

      const ghLink = document.getElementById('collab-modal-github-link');
      if (ghLink) ghLink.href = member.githubUrl;

      const mailLink = document.getElementById('collab-modal-email-link');
      if (mailLink) {
        if (member.email) {
          const subject = encodeURIComponent(`Collaboration Inquiry from Nanati's Developer Community`);
          const body = encodeURIComponent(`Hi ${member.name},\n\nI discovered your profile on Nanati Abdisa's Developer Community and would love to collaborate with you on a project!\n\nBest,\n`);
          mailLink.href = `mailto:${member.email}?subject=${subject}&body=${body}`;
          mailLink.style.display = 'inline-flex';
        } else {
          mailLink.style.display = 'none';
        }
      }

      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    closeCollabModal() {
      const modal = document.getElementById('modal-collaborate');
      if (!modal) return;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // ------------------------------------------------------------------------
    // Admin Integration
    // ------------------------------------------------------------------------
    extendAdminDashboard() {
      // Injects Community tab into existing Admin Dashboard modal
      const modalHeader = document.querySelector('#modal-admin-dashboard .pms-modal-header');
      if (!modalHeader) return;

      if (!document.getElementById('admin-tabs-bar')) {
        const tabsBar = document.createElement('div');
        tabsBar.id = 'admin-tabs-bar';
        tabsBar.className = 'pms-admin-tabs';
        tabsBar.innerHTML = `
          <button class="pms-tab-btn active" id="tab-btn-projects">📁 Portfolio Projects</button>
          <button class="pms-tab-btn" id="tab-btn-community">👥 Community Members (<span id="admin-comm-badge">${this.members.length}</span>)</button>
        `;
        modalHeader.parentNode.insertBefore(tabsBar, modalHeader.nextSibling);

        const modalBody = document.querySelector('#modal-admin-dashboard .pms-modal-body');
        if (modalBody) {
          const commPanel = document.createElement('div');
          commPanel.id = 'admin-community-panel';
          commPanel.style.display = 'none';
          commPanel.innerHTML = `
            <div class="pms-admin-topbar">
              <div class="pms-stats">
                <span class="pms-stat-pill">Total Members: <strong id="admin-member-total">${this.members.length}</strong></span>
                <span class="pms-stat-pill">Moderation: <strong>Active</strong></span>
              </div>
            </div>
            <div class="pms-admin-list" id="admin-community-list">
              <!-- Rendered dynamically -->
            </div>
          `;
          modalBody.appendChild(commPanel);
        }
      }

      this.renderAdminMembers();
    }

    renderAdminMembers() {
      const list = document.getElementById('admin-community-list');
      const badge = document.getElementById('admin-comm-badge');
      const totalEl = document.getElementById('admin-member-total');

      if (badge) badge.textContent = this.members.length;
      if (totalEl) totalEl.textContent = this.members.length;
      if (!list) return;

      if (this.members.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--pms-text-muted);">No community members registered yet.</div>`;
        return;
      }

      list.innerHTML = this.members.map(m => {
        const avatarUrl = `https://avatars.githubusercontent.com/${encodeURIComponent(m.githubUsername)}?size=48`;
        return `
          <div class="pms-admin-item" data-id="${m.id}">
            <div class="pms-item-left">
              <img src="${avatarUrl}" class="pms-item-thumb" style="border-radius: 50%;" alt="${escapeHtml(m.name)}"
                   onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\'><rect width=\\'48\\' height=\\'48\\' fill=\\'%23ff2d78\\'/></svg>';" />
              <div class="pms-item-info">
                <div class="pms-item-title">${escapeHtml(m.name)} <span style="font-size: 0.82rem; font-weight: normal; color: var(--comm-light);">(@${escapeHtml(m.githubUsername)})</span></div>
                <div class="pms-item-meta">
                  <span style="color: #ce93d8;">${escapeHtml(m.areaOfInterest)}</span>
                  ${m.email ? `<span>•</span><span>${escapeHtml(m.email)}</span>` : ''}
                  <span>•</span>
                  <span>Joined ${new Date(m.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div class="pms-item-actions">
              <a href="${m.githubUrl}" target="_blank" class="btn btn-glass pms-btn-sm" style="text-decoration: none;">GitHub</a>
              <button class="btn btn-danger pms-btn-sm btn-delete-member" data-id="${m.id}">
                🗑 Remove
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    promptDeleteMember(memberId) {
      const member = this.members.find(m => m.id === memberId);
      if (!member) return;

      if (confirm(`Are you sure you want to remove "${member.name}" (@${member.githubUsername}) from the community?`)) {
        this.members = this.members.filter(m => m.id !== memberId);
        this.persistMembers();
        showToast(`Member @${member.githubUsername} removed. 🗑️`);
      }
    }

    // ------------------------------------------------------------------------
    // Event Binding
    // ------------------------------------------------------------------------
    bindEvents() {
      // Auto-fill profile URL when typing GitHub username
      const ghInput = document.getElementById('comm-input-github');
      const urlInput = document.getElementById('comm-input-url');
      if (ghInput && urlInput) {
        ghInput.addEventListener('input', (e) => {
          const val = e.target.value.trim().replace(/^@/, '');
          if (val) {
            urlInput.value = `https://github.com/${val}`;
          }
        });
      }

      // Registration Form
      const regForm = document.getElementById('comm-registration-form');
      if (regForm) {
        regForm.addEventListener('submit', (e) => this.handleRegistration(e));
      }

      // Copy invite link
      const copyBtn = document.getElementById('btn-copy-invite-link');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          const url = this.getInvitationUrl();
          try {
            await navigator.clipboard.writeText(url);
            showToast('Invitation link copied to clipboard! 📋');
          } catch (e) {
            // Fallback
            const temp = document.createElement('textarea');
            temp.value = url;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast('Invitation link copied! 📋');
          }
        });
      }

      // Native Web Share API
      const nativeShareBtn = document.getElementById('btn-native-share');
      if (nativeShareBtn) {
        nativeShareBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const inviteUrl = this.getInvitationUrl();
          if (navigator.share) {
            try {
              await navigator.share({
                title: "Nanati Abdisa's Developer Community",
                text: "Join our developer community to connect with other programmers, share projects, and collaborate!",
                url: inviteUrl
              });
            } catch (err) {}
          } else {
            // Fallback to copy
            copyBtn.click();
          }
        });
      }

      // Filter Chips
      const chips = document.querySelectorAll('.comm-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.activeFilter = chip.dataset.filter || 'All';
          this.renderDirectory();
        });
      });

      // Member Search
      const search = document.getElementById('comm-search-input');
      if (search) {
        search.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          this.renderDirectory();
        });
      }

      // Member card action: Connect / Collaborate
      const directory = document.getElementById('comm-members-grid');
      if (directory) {
        directory.addEventListener('click', (e) => {
          const btn = e.target.closest('.btn-collab-trigger');
          if (btn) {
            const id = btn.dataset.id;
            this.openCollabModal(id);
          }
        });
      }

      // Close Collaborate modal
      const closeCollabBtn = document.getElementById('btn-close-collab-modal');
      if (closeCollabBtn) {
        closeCollabBtn.addEventListener('click', () => this.closeCollabModal());
      }

      // Admin Tab switching
      document.addEventListener('click', (e) => {
        if (e.target.id === 'tab-btn-projects') {
          document.getElementById('tab-btn-projects').classList.add('active');
          document.getElementById('tab-btn-community').classList.remove('active');
          document.querySelector('#modal-admin-dashboard .pms-admin-topbar').parentElement.children[2].style.display = 'block'; // projects list
          document.querySelector('#modal-admin-dashboard .pms-admin-topbar').style.display = 'flex';
          const commPanel = document.getElementById('admin-community-panel');
          if (commPanel) commPanel.style.display = 'none';
        }

        if (e.target.id === 'tab-btn-community') {
          document.getElementById('tab-btn-community').classList.add('active');
          document.getElementById('tab-btn-projects').classList.remove('active');
          document.querySelector('#modal-admin-dashboard .pms-admin-topbar').style.display = 'none';
          document.querySelector('#modal-admin-dashboard .pms-admin-topbar').parentElement.children[2].style.display = 'none';
          const commPanel = document.getElementById('admin-community-panel');
          if (commPanel) commPanel.style.display = 'block';
          this.renderAdminMembers();
        }

        const deleteMemberBtn = e.target.closest('.btn-delete-member');
        if (deleteMemberBtn) {
          const id = deleteMemberBtn.dataset.id;
          this.promptDeleteMember(id);
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('pms-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'pms-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pms-toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.communityManager = new CommunityManager();
    });
  } else {
    window.communityManager = new CommunityManager();
  }
})();
