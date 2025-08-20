import { router } from './router.js';
import { renderHeader } from './components/header.js';

function mount() {
  renderHeader(document.getElementById('app-header'));
  router.init();
}

window.addEventListener('DOMContentLoaded', mount);

