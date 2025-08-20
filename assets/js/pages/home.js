export function Home(){
  const wrap = document.createElement('div');
  wrap.className = 'container';
  wrap.innerHTML = `
    <section class="hero card">
      <div>
        <span class="badge">五年级数学 · 植树问题</span>
        <h1>从概念到应用：用可视化与游戏学会植树问题</h1>
        <p>支持触摸与交互的智能课堂：概念讲解 · 公式推导 · 动画演示 · 练习题库 · 小游戏 · 进度追踪</p>
        <div class="controls" role="group" aria-label="快速入口">
          <a class="btn primary" href="#/concepts">开始学习</a>
          <a class="btn" href="#/visualizer">打开可视化</a>
        </div>
      </div>
    </section>
    <section class="grid" style="margin-top:12px;">
      <div class="card" style="grid-column:span 6;">
        <h2>核心内容</h2>
        <p>两端都栽 / 两端不栽 / 一端栽一端不栽 / 环形植树；分步指导与公式推导，配合动态演示。</p>
      </div>
      <div class="card" style="grid-column:span 6;">
        <h2>游戏化</h2>
        <p>积分、关卡与挑战，让练习更有动力。</p>
      </div>
    </section>
  `;
  return wrap;
}

