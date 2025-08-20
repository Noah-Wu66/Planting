import { Learning } from './pages/learning.js';
import { Exercises } from './pages/exercises.js';

const routes = {
  '': Learning,
  '#/': Learning,
  '#/learning': Learning,
  '#/exercises': Exercises,
};

function render(Component) {
  const main = document.getElementById('app-main');
  main.innerHTML = '';
  const el = Component();
  if (typeof el === 'string') {
    main.innerHTML = el;
  } else if (el instanceof HTMLElement) {
    main.appendChild(el);
  }
  main.focus();
}

export const router = {
  init() {
    const onRoute = () => {
      const hash = window.location.hash || '#/';
      const Component = routes[hash] || Learning;
      render(Component);
    };
    window.addEventListener('hashchange', onRoute);
    onRoute();
  }
};

