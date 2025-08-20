export function Lessons(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>循序渐进课程</h2>
      <ol style="margin:0 0 0 1em;">
        <li>认识间隔与树棵数的关系</li>
        <li>直线两端都栽与不栽的对比</li>
        <li>一端栽一端不栽的场景</li>
        <li>环形植树与等分思想</li>
        <li>综合应用与易错点总结</li>
      </ol>
      <p style="color:#9fb3c8">后续将补充每一课的动画步骤与互动检查点。</p>
    </div>
  `;
  return el;
}

