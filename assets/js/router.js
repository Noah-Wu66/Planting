import { Home } from './pages/home.js';
import { Concepts } from './pages/concepts.js';
import { Visualizer } from './pages/visualizer.js';
import { Lessons } from './pages/lessons.js';
import { Practice } from './pages/practice.js';
import { Game } from './pages/game.js';
import { Progress } from './pages/progress.js';

const routes = {
  '': Home,
  '#/': Home,
  '#/concepts': Concepts,
  '#/visualizer': Visualizer,
  '#/lessons': Lessons,
  '#/practice': Practice,
  '#/game': Game,
  '#/progress': Progress,
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
      const Component = routes[hash] || Home;
      render(Component);
    };
    window.addEventListener('hashchange', onRoute);
    onRoute();
  }
};

