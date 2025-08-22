import { themeManager } from '../shared/theme.js';

const navLinks = [
  { href: '#/ai-learning', label: 'AI学习', emoji: '🤖' },
  { href: '#/ai-practice', label: 'AI练习', emoji: '🏆' },
];

export function renderHeader(container){
  const currentTheme = themeManager.getCurrentTheme();
  const header = document.createElement('div');
  header.className = 'navbar';
  header.innerHTML = `
    <div class="navbar-inner">
      <div class="brand">
        <div class="logo" aria-hidden="true"></div>
        <span>植树问题学习平台</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="menu-toggle" id="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="打开或收起主菜单">☰</button>
        <nav class="nav" id="main-nav" aria-label="主导航">
          ${navLinks.map(l => `<a href="${l.href}" data-href="${l.href}">${l.label}</a>`).join('')}
        </nav>
        <button class="theme-toggle" id="theme-toggle" title="${themeManager.getThemeName(currentTheme)}">
          ${themeManager.getThemeIcon(currentTheme)}
        </button>
      </div>
    </div>
  `;
  container.innerHTML = '';
  container.appendChild(header);

  const setActive = () => {
    const currentHash = window.location.hash || '#/';
    header.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('data-href');
      // 默认路由 '#/' 对应AI学习页面
      if ((currentHash === '#/' && href === '#/ai-learning') || href === currentHash) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  };
  setActive();
  window.addEventListener('hashchange', setActive);

  // 主题切换功能
  const themeToggle = header.querySelector('#theme-toggle');
  const updateThemeButton = () => {
    const currentTheme = themeManager.getCurrentTheme();
    themeToggle.innerHTML = themeManager.getThemeIcon(currentTheme);
    themeToggle.title = themeManager.getThemeName(currentTheme);
  };

  themeToggle.addEventListener('click', () => {
    themeManager.toggleTheme();
    updateThemeButton();
  });

  // 移动端菜单切换
  const menuToggle = header.querySelector('#menu-toggle');
  const nav = header.querySelector('#main-nav');
  const navbarInner = header.querySelector('.navbar-inner');

  const closeMenu = () => {
    navbarInner.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  // 初始收起
  closeMenu();

  menuToggle.addEventListener('click', () => {
    const isOpen = navbarInner.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // 路由变化自动收起
  window.addEventListener('hashchange', closeMenu);
}


