const navLinks = [
  { href: '#/', label: '首页' },
  { href: '#/concepts', label: '概念讲解' },
  { href: '#/visualizer', label: '可视化演示' },
  { href: '#/lessons', label: '课程' },
  { href: '#/practice', label: '练习' },
  { href: '#/game', label: '小游戏' },
  { href: '#/progress', label: '进度' },
];

export function renderHeader(container){
  const header = document.createElement('div');
  header.className = 'navbar';
  header.innerHTML = `
    <div class="navbar-inner">
      <div class="brand">
        <div class="logo" aria-hidden="true"></div>
        <span>植树问题智能课堂</span>
      </div>
      <nav class="nav" aria-label="主导航">
        ${navLinks.map(l => `<a href="${l.href}" data-href="${l.href}">${l.label}</a>`).join('')}
      </nav>
    </div>
  `;
  container.innerHTML = '';
  container.appendChild(header);

  const setActive = () => {
    header.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('data-href') === (window.location.hash || '#/')) a.classList.add('active');
      else a.classList.remove('active');
    });
  };
  setActive();
  window.addEventListener('hashchange', setActive);
}

