import { formulas, generatePositions } from '../shared/math.js';

const items = [
  {
    key: 'both',
    title: '两端都种树',
    idea: '若一条长为 L 的小路上，每隔 d 米种一棵树，且两端都种，则间隔数为 L/d，树棵数为间隔数加 1。',
    formula: '树的数量 = 路长 ÷ 树间距 + 1',
    emoji: '🌳',
    story: '两端均设置树木标记，首尾都算一棵。'
  },
  {
    key: 'none',
    title: '两端都不种',
    idea: '两端不种时，间隔数比树棵数多 1，因此树棵数 = L/d - 1。',
    formula: '树的数量 = 路长 ÷ 树间距 - 1',
    emoji: '🌿',
    story: '两端留空，不在起止点种树。'
  },
  {
    key: 'one',
    title: '一端种，一端不种',
    idea: '只在一端种树时，树棵数正好等于间隔数：L/d。',
    formula: '树的数量 = 路长 ÷ 树间距',
    emoji: '🌲',
    story: '仅在起点（或终点）放置一棵树。'
  },
  {
    key: 'circle',
    title: '环形（圆形）种树',
    idea: '沿圆周每隔 d 米种一棵，首尾相接，不会多出或缺少端点。树棵数 = 周长 ÷ 间距。',
    formula: '树的数量 = 圆周长 ÷ 树间距',
    emoji: '⭕',
    story: '围成一圈，等距放置树木。'
  },
];

export function Learning(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <!-- 欢迎区域 -->
    <div class="hero">
      <h1>植树问题：核心概念与方法</h1>
      <p>本页将系统梳理植树问题的四种常见情形与对应公式，配合直观可视化，帮助五年级同学构建清晰的数学模型。</p>
    </div>

    <!-- 概念讲解部分 -->
    <div class="card fun-decoration">
      <h2>四种典型情形</h2>
      <p>关键量包括：<strong>路长/周长</strong>、<strong>间距</strong>、<strong>树的数量</strong>。不同端点边界条件对应不同公式。</p>
    </div>

    <div class="grid" style="margin-top:20px;">
      ${items.map(it => `
        <div class="card" style="grid-column:span 6;">
          <h3>${it.title}</h3>
          <div style="font-size: 20px; text-align: left; margin: 8px 0; padding: 8px 12px; background: rgba(37,99,235,0.06); border-left: 4px solid var(--accent); border-radius: 8px;">
            示例图标：${it.emoji}
          </div>
          <p style="color: var(--muted); font-size: 14px;">${it.story}</p>
          <p>${it.idea}</p>
          <div style="background: rgba(37,99,235,0.06); padding: 10px 12px; border-left: 4px solid var(--accent-2); border-radius: 8px; margin-top: 10px;">
            <strong>公式：</strong> <span style="font-size: 16px; color: var(--accent);">${it.formula}</span>
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- 学习步骤部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>学习路径</h2>
      <div style="background: rgba(37,99,235,0.06); padding: 16px; border-radius: 12px;">
        <ol style="margin: 0 0 0 20px; padding: 0; line-height: 1.8;">
          <li>理解“间距、路长（或周长）、树棵数”的关系</li>
          <li>区分三种直线路径的端点条件与一个环形情形</li>
          <li>将 L÷d 的整数性与边界条件结合，快速确定公式</li>
          <li>用可视化验证结论并反思极端值</li>
        </ol>
      </div>
      <p style="color: var(--muted); text-align: center; margin-top: 16px;">提示：在下方“计算与可视化”中试一试不同参数。</p>
    </div>
    
    <!-- 神奇计算器部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>计算与可视化</h2>
      <p>输入参数，快速得到树棵数，并用动画验证排布是否与公式一致。</p>

      <div style="background: linear-gradient(135deg, rgba(255,107,157,0.05), rgba(78,205,196,0.05)); padding: 20px; border-radius: 15px; margin: 16px 0;">
        <h3 style="color: var(--accent-2); margin-top: 0;">参数设置</h3>
        <div class="controls">
          <div class="input">
            <label>路的长度（米）</label>
            <input id="len" type="number" value="100" min="1" max="1000" step="1">
            <small style="color: var(--muted);">例如：100</small>
          </div>
          <div class="input">
            <label>树的间距（米）</label>
            <input id="d" type="number" value="10" min="1" max="50" step="1">
            <small style="color: var(--muted);">例如：10</small>
          </div>
          <div class="input">
            <label>种树方式</label>
            <select id="mode">
              <option value="both">两端都种树</option>
              <option value="none">两端都不种</option>
              <option value="one">一端种，一端不种</option>
              <option value="circle">环形（圆形）</option>
            </select>
          </div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <button class="btn primary" id="calc" style="margin-right: 12px;">计算</button>
          <button class="btn" id="visualize">可视化</button>
        </div>
      </div>

      <div id="out" class="badge" style="font-size: 16px; padding: 16px 24px;">设置参数后点击“计算”，查看结果。</div>
    </div>
    
    <!-- 可视化演示部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>排布动画</h2>
      <p>观察不同情形下树木的排列，验证理解。</p>

      <div style="text-align: center; margin: 16px 0;">
        <div id="vis-result" class="badge" style="font-size: 16px; padding: 16px 24px; display: inline-block;">
          设置好参数后点击“可视化”，即可看到排布过程。
        </div>
      </div>

      <div class="canvas-wrap">
        <canvas id="canvas" class="canvas"></canvas>
        <div style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 10px; font-size: 12px; color: var(--muted);">
          可视化演示
        </div>
      </div>

      <div style="text-align: center; margin-top: 16px; color: var(--muted); font-size: 14px;">
        提示：关注“是否含端点”对数量计算的影响。
      </div>
    </div>
  `;

  setTimeout(() => {
    const $ = (id)=>el.querySelector(id);
    
    // 公式计算 + 可视化（合并动作）
    function runCalcAndDraw(){
      const L = parseFloat($('#len').value || '0');
      const d = parseFloat($('#d').value || '1');
      const mode = $('#mode').value;
      const n = formulas.computeTreeCount({ L, d, mode });

      if (Number.isFinite(n) && n > 0) {
        $('#out').innerHTML = `结果：按照“${label(mode)}”方式，需要 <strong style="color: var(--accent); font-size: 20px;">${n}</strong> 棵树。`;
        $('#out').className = 'badge success';
      } else {
        $('#out').innerHTML = `参数不合理，请调整路长或间距。`;
        $('#out').className = 'badge error';
      }
      // 同步触发动画演示
      draw(mode, L, d);
    }
    
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
        $('#vis-result').innerHTML = '参数当前无法生成有效排布，请调整。';
        $('#vis-result').className = 'badge error';
        return;
      }

      const modeEmojis = {
        'both': '🌳',
        'none': '🌿',
        'one': '🌲',
        'circle': '⭕'
      };

      $('#vis-result').innerHTML = `${modeEmojis[mode]} ${label(mode)}：共 <strong>${n}</strong> 棵树。`;
      $('#vis-result').className = 'badge success';

      // 动画绘制
      const positions = generatePositions({mode, n});
      let t = 0; // 0..1 动画进度
      const startTime = performance.now();

      function loop(now){
        const elapsed = now - startTime;
        t = Math.min(1, elapsed/1200);
        ctx.clearRect(0,0,w,h);
        ctx.save();
        ctx.lineWidth = 4;

        if(mode === 'circle'){
          const R = Math.min(w,h)*0.32;
          const cx = w/2, cy = h/2;

          // 绘制美丽的花园边界
          const pathGrad = ctx.createLinearGradient(cx-R, cy-R, cx+R, cy+R);
          pathGrad.addColorStop(0, '#2563EB');
          pathGrad.addColorStop(0.5, '#059669');
          pathGrad.addColorStop(1, '#F59E0B');
          ctx.strokeStyle = pathGrad;

          ctx.beginPath();
          ctx.arc(cx,cy,R,0,Math.PI*2);
          ctx.globalAlpha = 0.8;
          ctx.stroke();

          // 添加花园装饰
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = 'rgba(255,230,109,0.2)';
          ctx.fill();
          ctx.globalAlpha = 1;

          // 绘制小树
          positions.forEach((ang,i)=>{
            if(i/positions.length > t) return;
            const x = cx + R*Math.cos(ang);
            const y = cy + R*Math.sin(ang);
            drawTree(x,y, ang, i * 0.1, t); // 添加延迟动画
          });

          // 绘制中心装饰
          if(t > 0.5) {
            ctx.fillStyle = '#93C5FD';
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI*2);
            ctx.fill();
          }
        } else {
          // 绘制美丽的小路
          const pad = 40;
          const x0 = pad, x1 = w - pad;
          const y = h*0.6;

          // 小路渐变
          const pathGrad = ctx.createLinearGradient(x0, y, x1, y);
          pathGrad.addColorStop(0, '#2563EB');
          pathGrad.addColorStop(0.5, '#059669');
          pathGrad.addColorStop(1, '#F59E0B');
          ctx.strokeStyle = pathGrad;

          ctx.beginPath();
          ctx.moveTo(x0,y);
          ctx.lineTo(x1,y);
          ctx.stroke();

          // 辅助线
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(37,99,235,0.25)';
          ctx.beginPath();
          ctx.moveTo(x0,y-8);
          ctx.lineTo(x1,y-8);
          ctx.moveTo(x0,y+8);
          ctx.lineTo(x1,y+8);
          ctx.stroke();

          // 绘制小树
          positions.forEach((p,i)=>{
            if(i/positions.length > t) return;
            const x = x0 + (x1-x0)*p;
            drawTree(x,y-4, 0, i * 0.1, t);
          });

          // 绘制路标
          if(t > 0.3) {
            ctx.fillStyle = '#374151';
            ctx.fillRect(x0-4, y+10, 8, 20);
            ctx.fillStyle = '#6B7280';
            ctx.font = '12px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText('起点', x0, y+45);

            if(mode === 'both' || mode === 'one') {
              ctx.fillRect(x1-4, y+10, 8, 20);
              ctx.fillText('终点', x1, y+45);
            }
          }
        }
        ctx.restore();
        if(t<1) requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }

    function drawTree(x,y, ang, delay = 0, t = 1){
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(ang);

      // 计算动画进度（考虑延迟）；动画结束时统一大小
      const isFinalFrame = t >= 0.999;
      const animProgress = isFinalFrame ? 1 : Math.max(0, Math.min(1, (t - delay) * 2));
      if (animProgress <= 0) {
        ctx.restore();
        return;
      }

      // 树的缩放动画
      const scale = 0.3 + 0.7 * animProgress;
      ctx.scale(scale, scale);

      // 树干 - 更可爱的棕色
      ctx.fillStyle = '#D2691E';
      ctx.fillRect(-3,0,6,25);

      // 树干纹理
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(-1,5,2,3);
      ctx.fillRect(-1,12,2,3);
      ctx.fillRect(-1,19,2,3);

      // 树根装饰
      ctx.fillStyle = '#A0522D';
      ctx.beginPath();
      ctx.ellipse(0, 25, 8, 3, 0, 0, Math.PI*2);
      ctx.fill();

      // 树冠 - 绿色渐变（更克制）
      const grad = ctx.createRadialGradient(0,-5,2,0,-5,15);
      grad.addColorStop(0,'#34D399');
      grad.addColorStop(0.8,'#059669');
      grad.addColorStop(1,'rgba(5,150,105,0.25)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0,-5,15,0,Math.PI*2);
      ctx.fill();

      // 添加轻微的摇摆动画
      const swayTime = (performance.now() / 2000) % (Math.PI * 2);
      const sway = Math.sin(swayTime + delay * 10) * 0.02;
      ctx.rotate(sway);

      ctx.restore();
    }

    function label(mode){
      return ({
        both:'两端都种树',
        none:'两端都不种',
        one:'一端种，一端不种',
        circle:'环形（圆形）种树'
      })[mode] || mode;
    }

    // 将两个按钮都绑定为“计算 + 动画”
    $('#calc').addEventListener('click', runCalcAndDraw);
    $('#visualize').addEventListener('click', runCalcAndDraw);
  }, 0);

  return el;
}
