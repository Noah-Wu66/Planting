// 主题管理模块
export const themeManager = {
  // 获取当前主题
  getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
  },

  // 设置主题
  setTheme(theme) {
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  },

  // 应用主题
  applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  },

  // 切换主题
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  },

  // 初始化主题
  init() {
    const savedTheme = this.getCurrentTheme();
    this.applyTheme(savedTheme);
  },

  // 获取主题图标
  getThemeIcon(theme) {
    return theme === 'dark' ? '☀️' : '🌙';
  },

  // 获取主题名称
  getThemeName(theme) {
    return theme === 'dark' ? '浅色模式' : '暗黑模式';
  }
};
