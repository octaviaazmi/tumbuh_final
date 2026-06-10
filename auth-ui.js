(function () {
  let role = localStorage.getItem('tumbuhRole');
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const style = document.createElement('style');
  style.textContent = `
    .role-chip{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;min-height:38px;padding:.48rem 1rem;border-radius:999px;background:var(--sage,#E1F5EE);color:var(--forest,#1C3A2F);font-size:.76rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;line-height:1}
    .role-chip-admin{background:#FDF3E0;color:#966800}
    .admin-only-badge{display:inline-flex;align-items:center;gap:.35rem;margin-top:.32rem;padding:.24rem .68rem;border-radius:999px;background:#FDF3E0;color:#966800;font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
    .navbar{background:rgba(245,242,236,.94);backdrop-filter:blur(18px);border-bottom:1px solid var(--border,rgba(28,58,47,.08));box-shadow:0 1px 0 var(--border,rgba(28,58,47,.08))}
    .navbar,.nav-actions,.nav-links{min-width:0}
    .navbar .nav-actions,nav .nav-actions{flex-shrink:0;gap:.7rem}
    .navbar .nav-links{gap:clamp(1rem,1.8vw,2.25rem)}
    .navbar .nav-links a{white-space:nowrap}
    .navbar .role-chip,nav .role-chip{box-shadow:none}
    body.has-dark-header .navbar:not(.scrolled){background:rgba(28,58,47,.86);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.12);box-shadow:0 10px 30px rgba(28,58,47,.12)}
    body.has-dark-header .navbar:not(.scrolled) .nav-logo{color:var(--white,#fff)}
    body.has-dark-header .navbar:not(.scrolled) .nav-links a{color:rgba(255,255,255,.76)}
    body.has-dark-header .navbar:not(.scrolled) .nav-links a:hover,
    body.has-dark-header .navbar:not(.scrolled) .nav-links a.active{color:var(--white,#fff)}
    body.has-dark-header .navbar:not(.scrolled) .nav-cart,
    body.has-dark-header .navbar:not(.scrolled) .nav-icon{background:rgba(255,255,255,.94);color:var(--forest,#1C3A2F)}
    body.has-dark-header .navbar:not(.scrolled) .nav-btn,
    body.has-dark-header .navbar:not(.scrolled) .role-chip{background:rgba(255,255,255,.94);color:var(--forest,#1C3A2F)}
    body.has-dark-header .navbar:not(.scrolled) .role-chip-admin{background:#FDF3E0;color:#966800}
    body.has-dark-header .navbar:not(.scrolled) .hamburger span{background:var(--white,#fff)}
    @media(max-width:1180px){
      .navbar{padding-left:1.5rem!important;padding-right:1.5rem!important}
      .navbar .nav-links{gap:.9rem}
      .navbar .nav-actions{gap:.5rem}
      .navbar .role-chip,nav .role-chip{padding:.45rem .75rem;font-size:.7rem}
    }
  `;
  document.head.appendChild(style);

  function setLoginLinks() {
    const loginLinks = Array.from(document.querySelectorAll('a')).filter(link => {
      const text = link.textContent.trim().toLowerCase();
      return text === 'masuk' || text === 'akun';
    });

    loginLinks.forEach(link => {
      if (role === 'admin') {
        link.href = '13-dashboard.html';
        link.textContent = 'Admin Panel';
        link.classList.add('role-chip', 'role-chip-admin');
      } else if (role === 'user') {
        link.href = '08-history.html';
        link.textContent = 'Akun User';
        link.classList.add('role-chip');
      } else {
        link.href = 'login.html';
        link.textContent = 'Masuk';
      }
    });
  }

  function addRoleNavLinks() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks || navLinks.dataset.roleReady) return;
    navLinks.dataset.roleReady = 'true';

    if (role === 'user') {
      navLinks.insertAdjacentHTML('beforeend', '<li><a href="08-history.html">History</a></li>');
    }

    if (role === 'admin') {
      navLinks.insertAdjacentHTML('beforeend', '<li><a href="13-dashboard.html">Admin</a></li>');
    }
  }

  function addMobileRoleLinks() {
    const mobileNav = document.getElementById('mobileNav');
    if (!mobileNav || mobileNav.dataset.roleReady) return;
    mobileNav.dataset.roleReady = 'true';

    const lastLink = Array.from(mobileNav.querySelectorAll('a')).find(link => link.textContent.trim().toLowerCase() === 'akun');
    if (lastLink) {
      lastLink.href = role === 'admin' ? '13-dashboard.html' : role === 'user' ? '08-history.html' : 'login.html';
      lastLink.textContent = role === 'admin' ? 'Admin Panel' : role === 'user' ? 'Akun User' : 'Masuk';
    }
  }

  function addAdminOnlyBadge() {
    const isAdminPage = /^0?9-|^10-|^11-|^12-|^13-/.test(currentPage);
    if (!isAdminPage) return;

    localStorage.setItem('tumbuhRole', 'admin');
    role = 'admin';
    const title = document.querySelector('.topbar-title');
    if (title && !document.querySelector('.admin-only-badge')) {
      title.insertAdjacentHTML('afterend', '<span class="admin-only-badge">Admin Only</span>');
    }
  }

  function addLogoutLinks() {
    const target = document.querySelector('.nav-actions') || document.querySelector('.topbar-right');
    if (!target || !role || target.querySelector('[data-logout-role]')) return;

    const link = document.createElement('a');
    link.href = 'login.html';
    link.dataset.logoutRole = 'true';
    link.textContent = 'Keluar';
    link.className = target.classList.contains('topbar-right') ? 'topbar-btn btn-ghost' : 'role-chip';
    link.addEventListener('click', () => localStorage.removeItem('tumbuhRole'));
    const hamburger = target.querySelector('.hamburger');
    if (hamburger) {
      target.insertBefore(link, hamburger);
    } else {
      target.appendChild(link);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.page-header, .art-hero')) {
      document.body.classList.add('has-dark-header');
    }
    setLoginLinks();
    addRoleNavLinks();
    addMobileRoleLinks();
    addAdminOnlyBadge();
    addLogoutLinks();
  });
})();
