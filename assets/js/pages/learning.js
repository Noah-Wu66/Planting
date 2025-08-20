import { formulas, generatePositions } from '../shared/math.js';

const items = [
  { key: 'both', title: '直线两端都栽', idea: 'n 棵树有 n-1 个间隔，路长 L = (n-1)*d', formula: 'n = L/d + 1' },
  { key: 'none', title: '直线两端不栽', idea: 'n 棵树形成 n+1 个间隔，路长 L = (n+1)*d', formula: 'n = L/d - 1' },
  { key: 'one', title: '一端栽一端不栽', idea: 'n 棵树形成 n 个间隔，路长 L = n*d', formula: 'n = L/d' },
  { key: 'circle', title: '环形植树', idea: 'n 棵树有 n 个间隔，周长 C = n*d', formula: 'n = C/d' },
];

export function Learning(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <!-- 概念讲解部分 -->
    <div class="card">
      <h2>植树问题的基本概念</h2>
      <p>我们将用统一的"树间距 d、树棵数 n、路长/周长 L 或 C"的方式来理解四类场景。</p>
    </div>
    <div class="grid" style="margin-top:12px;">
      ${items.map(it => `
        <div class="card" style="grid-column:span 6;">
          <h3 style="margin:0 0 8px 0;">${it.title}</h3>
          <p>${it.idea}</p>
          <p><strong>公式：</strong>${it.formula}</p>
        </div>
      `).join('')}
    </div>
    
    <!-- 课程内容部分 -->
    <div class="card" style="margin-top:12px;">
      <h2>循序渐进课程</h2>
      <ol style="margin:0 0 0 1em;">
        <li>认识间隔与树棵数的关系</li>
        <li>直线两端都栽与不栽的对比</li>
        <li>一端栽一端不栽的场景</li>
        <li>环形植树与等分思想</li>
        <li>综合应用与易错点总结</li>
      </ol>
      <p style="color:#9fb3c8">通过下方的可视化演示和公式计算来深入理解每个概念。</p>
    </div>
    
    <!-- 统一公式推导部分 -->
    <div class="card" style="margin-top:12px;">
      <h2>统一公式推导</h2>
      <p>用"间隔数 × 间距 = 总长度"的思想：直线两端都栽时，间隔数为 n-1；两端不栽为 n+1；一端栽为 n；环形为 n。</p>
      <div class="controls">
        <div class="input"><label>路长/周长 L 或 C（米）</label><input id="len" type="number" value="100" min="1"></div>
        <div class="input"><label>树间距 d（米）</label><input id="d" type="number" value="10" min="1"></div>
        <div class="input"><label>场景</label>
          <select id="mode">
            <option value="both">两端都栽</option>
            <option value="none">两端不栽</option>
            <option value="one">一端栽一端不栽</option>
            <option value="circle">环形</option>
          </select>
        </div>
        <button class="btn primary" id="calc">计算 n</button>
        <button class="btn" id="visualize">可视化演示</button>
      </div>
      <p id="out" class="badge">结果将在这里显示</p>
    </div>
    
    <!-- 可视化演示部分 -->
    <div class="card" style="margin-top:12px;">
      <h2>交互式可视化演示</h2>
      <p id="vis-result" class="badge">请设置参数后点击"可视化演示"</p>
      <div class="canvas-wrap"><canvas id="canvas" class="canvas"></canvas></div>
    </div>
  `;

  setTimeout(() => {
    const $ = (id)=>el.querySelector(id);
    
    // 公式计算功能
    $('#calc').addEventListener('click', () => {
      const L = parseFloat($('#len').value || '0');
      const d = parseFloat($('#d').value || '1');
      const mode = $('#mode').value;
      const n = formulas.computeTreeCount({ L, d, mode });
      const text = Number.isFinite(n) ? `应栽 ${n} 棵树` : '输入不合法或无法整除，请调整参数';
      $('#out').textContent = text;
    });
    
    // 可视化功能
    const ctx = $('#canvas').getContext('2d');

    function resize(){
      const c = $('#canvas');
      const r = c.parentElement.getBoundingClientRect();
      c.width = Math.floor(r.width);
      c.height = Math.floor(r.height);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(mode, L, d){
      const n = formulas.computeTreeCount({L,d,mode});
      const c = $('#canvas');
      const w=c.width,h=c.height;
      ctx.clearRect(0,0,w,h);

      if(!Number.isFinite(n) || n<=0){
        $('#vis-result').textContent = '参数无法整除或不合理，请调整 L 与 d。';
        return;
      }
      $('#vis-result').textContent = `场景：${label(mode)} · 应栽 ${n} 棵树`;

      // 动画绘制
      const positions = generatePositions({mode, n});
      let t = 0; // 0..1 动画进度
      const startTime = performance.now();

      function loop(now){
        const elapsed = now - startTime;
        t = Math.min(1, elapsed/1200);
        ctx.clearRect(0,0,w,h);
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#315987';
        ctx.fillStyle = '#58c4dc';

        if(mode === 'circle'){
          const R = Math.min(w,h)*0.32;
          const cx = w/2, cy = h/2;
          ctx.beginPath();
          ctx.arc(cx,cy,R,0,Math.PI*2);
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
          positions.forEach((ang,i)=>{
            if(i/positions.length > t) return;
            const x = cx + R*Math.cos(ang);
            const y = cy + R*Math.sin(ang);
            drawTree(x,y, ang);
          });
        } else {
          // 线段
          const pad = 40;
          const x0 = pad, x1 = w - pad;
          const y = h*0.6;
          ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y); ctx.stroke();
          positions.forEach((p,i)=>{
            if(i/positions.length > t) return;
            const x = x0 + (x1-x0)*p;
            drawTree(x,y-4, -Math.PI/2);
          });
        }
        ctx.restore();
        if(t<1) requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }

    function drawTree(x,y, ang){
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(ang);
      // trunk
      ctx.fillStyle = '#8f6a3a';
      ctx.fillRect(-2,0,4,20);
      // crown
      const grad = ctx.createRadialGradient(0,0,2,0,0,12);
      grad.addColorStop(0,'#7ee787');
      grad.addColorStop(1,'rgba(126,231,135,0.05)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function label(mode){
      return ({both:'两端都栽',none:'两端不栽',one:'一端栽',circle:'环形'})[mode]||mode
    }

    $('#visualize').addEventListener('click',()=>{
      const mode = $('#mode').value;
      const L = parseFloat($('#len').value||'0');
      const d = parseFloat($('#d').value||'1');
      draw(mode,L,d);
    });
  }, 0);

  return el;
}
