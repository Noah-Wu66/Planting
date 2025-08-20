import { router } from './router.js';
import { renderHeader } from './components/header.js';
import { themeManager } from './shared/theme.js';

function mount() {
  // 初始化主题
  themeManager.init();

  renderHeader(document.getElementById('app-header'));
  router.init();
}

window.addEventListener('DOMContentLoaded', mount);

