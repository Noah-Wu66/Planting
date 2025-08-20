import { formulas, generatePositions } from '../shared/math.js';

const items = [
  {
    key: 'both',
    title: '🌳 小路两头都种树',
    idea: '想象一下，小朋友们手拉手站成一排，如果有5个小朋友，他们之间就有4个空隙。种树也是一样的道理！',
    formula: '树的数量 = 路长 ÷ 树间距 + 1',
    emoji: '🌳🌳🌳🌳🌳',
    story: '小兔子要在小路两端都种上美丽的树！'
  },
  {
    key: 'none',
    title: '🌿 小路两头都不种',
    idea: '这次小路的两头不种树，就像小朋友们排队时，队伍前后都留出空间一样。',
    formula: '树的数量 = 路长 ÷ 树间距 - 1',
    emoji: '🌿🌳🌳🌳🌿',
    story: '小熊想让小路两端保持空旷，方便大家通行！'
  },
  {
    key: 'one',
    title: '🌲 一头种一头不种',
    idea: '这种情况就像排队时，队伍只有一个起点，树的间隔数正好等于树的数量。',
    formula: '树的数量 = 路长 ÷ 树间距',
    emoji: '🌲🌳🌳🌳🌿',
    story: '小鹿决定只在小路的一端种树！'
  },
  {
    key: 'circle',
    title: '🎡 圆形花园种树',
    idea: '在圆形花园里种树，就像小朋友们围成圆圈做游戏，每个人之间的距离都相等。',
    formula: '树的数量 = 圆周长 ÷ 树间距',
    emoji: '🌳🌳🌳🌳',
    story: '小猴子要在圆形花园里种出漂亮的树圈！'
  },
];

export function Learning(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <!-- 欢迎区域 -->
    <div class="hero">
      <h1>🌳 神奇的植树王国 🌳</h1>
      <p>欢迎来到植树王国！在这里，我们要学会如何聪明地种树。每种种树方法都有自己的小秘密哦！</p>
    </div>

    <!-- 概念讲解部分 -->
    <div class="card fun-decoration">
      <h2>🎯 植树的四大秘诀</h2>
      <p>小朋友们，种树其实很简单！我们只需要知道三个好朋友：<strong>🌳树的间距</strong>、<strong>📏路的长度</strong>、<strong>🔢树的数量</strong>。让我们一起来认识四种神奇的种树方法吧！</p>
    </div>

    <div class="grid" style="margin-top:20px;">
      ${items.map(it => `
        <div class="card" style="grid-column:span 6;">
          <h3>${it.title}</h3>
          <div style="font-size: 24px; text-align: center; margin: 16px 0; padding: 12px; background: linear-gradient(135deg, rgba(255,107,157,0.1), rgba(78,205,196,0.1)); border-radius: 15px;">
            ${it.emoji}
          </div>
          <p style="color: var(--accent-2); font-weight: 600; font-style: italic;">${it.story}</p>
          <p>${it.idea}</p>
          <div style="background: linear-gradient(135deg, rgba(255,230,109,0.2), rgba(255,107,157,0.2)); padding: 12px; border-radius: 12px; margin-top: 12px;">
            <strong>🧮 神奇公式：</strong><br>
            <span style="font-size: 18px; color: var(--accent);">${it.formula}</span>
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- 学习步骤部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>🎓 小小植树专家养成记</h2>
      <div style="background: linear-gradient(135deg, rgba(78,205,196,0.1), rgba(255,230,109,0.1)); padding: 20px; border-radius: 15px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🤝</div>
            <h4 style="color: var(--accent); margin: 8px 0;">第一步</h4>
            <p style="margin: 0; font-size: 14px;">认识小树之间的距离</p>
          </div>
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
            <h4 style="color: var(--accent); margin: 8px 0;">第二步</h4>
            <p style="margin: 0; font-size: 14px;">比较不同的种树方法</p>
          </div>
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
            <h4 style="color: var(--accent); margin: 8px 0;">第三步</h4>
            <p style="margin: 0; font-size: 14px;">学会特殊情况处理</p>
          </div>
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🎡</div>
            <h4 style="color: var(--accent); margin: 8px 0;">第四步</h4>
            <p style="margin: 0; font-size: 14px;">掌握圆形花园种树</p>
          </div>
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🏆</div>
            <h4 style="color: var(--accent); margin: 8px 0;">第五步</h4>
            <p style="margin: 0; font-size: 14px;">成为植树小专家</p>
          </div>
        </div>
      </div>
      <p style="color: var(--muted); text-align: center; margin-top: 16px;">💡 小贴士：通过下方的神奇计算器和动画演示来练习每个概念哦！</p>
    </div>
    
    <!-- 神奇计算器部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>🧮 神奇的植树计算器</h2>
      <p>小朋友们，现在我们来用神奇的计算器算一算需要种多少棵树吧！记住我们的小秘诀：<strong>先算间隔，再算树的数量</strong>。</p>

      <div style="background: linear-gradient(135deg, rgba(255,107,157,0.05), rgba(78,205,196,0.05)); padding: 20px; border-radius: 15px; margin: 16px 0;">
        <h3 style="color: var(--accent-2); margin-top: 0;">🎯 设置参数</h3>
        <div class="controls">
          <div class="input">
            <label>📏 路的长度（米）</label>
            <input id="len" type="number" value="100" min="1" max="1000" step="1">
            <small style="color: var(--muted);">小路有多长呢？</small>
          </div>
          <div class="input">
            <label>🌳 树之间的距离（米）</label>
            <input id="d" type="number" value="10" min="1" max="50" step="1">
            <small style="color: var(--muted);">小树们要隔多远？</small>
          </div>
          <div class="input">
            <label>🎨 种树的方式</label>
            <select id="mode">
              <option value="both">🌳 小路两头都种树</option>
              <option value="none">🌿 小路两头都不种</option>
              <option value="one">🌲 一头种一头不种</option>
              <option value="circle">🎡 圆形花园种树</option>
            </select>
          </div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <button class="btn primary" id="calc" style="margin-right: 12px;">🔢 开始计算</button>
          <button class="btn" id="visualize">🎬 看动画演示</button>
        </div>
      </div>

      <div id="out" class="badge" style="font-size: 16px; padding: 16px 24px;">🤔 设置好参数后，点击"开始计算"看看结果吧！</div>
    </div>
    
    <!-- 可视化演示部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>🎬 神奇的植树动画剧场</h2>
      <p>哇！让我们一起看看小树们是怎么排队的吧！动画会告诉我们每种种树方法的小秘密。</p>

      <div style="text-align: center; margin: 16px 0;">
        <div id="vis-result" class="badge" style="font-size: 16px; padding: 16px 24px; display: inline-block;">
          🎭 设置好参数后，点击"看动画演示"，小树们就会跳舞给你看！
        </div>
      </div>

      <div class="canvas-wrap">
        <canvas id="canvas" class="canvas"></canvas>
        <div style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 10px; font-size: 12px; color: var(--muted);">
          🎨 植树动画剧场
        </div>
      </div>

      <div style="text-align: center; margin-top: 16px; color: var(--muted); font-size: 14px;">
        💡 小贴士：仔细观察小树们的排列规律，你会发现种树的奥秘！
      </div>
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

      const modeNames = {
        'both': '小路两头都种树',
        'none': '小路两头都不种',
        'one': '一头种一头不种',
        'circle': '圆形花园种树'
      };

      if (Number.isFinite(n) && n > 0) {
        $('#out').innerHTML = `🎉 太棒了！按照"${modeNames[mode]}"的方法，我们需要种 <strong style="color: var(--accent); font-size: 20px;">${n}</strong> 棵小树！`;
        $('#out').className = 'badge success';

        // 添加庆祝动画
        $('#out').style.animation = 'none';
        setTimeout(() => {
          $('#out').style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
      } else {
        $('#out').innerHTML = `🤔 哎呀，这个数字不太对哦！试试调整一下路的长度或树的间距吧！`;
        $('#out').className = 'badge error';
      }
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
        $('#vis-result').innerHTML = '🤔 小树们排不整齐呢！试试调整一下数字吧！';
        $('#vis-result').className = 'badge error';
        return;
      }

      const modeEmojis = {
        'both': '🌳',
        'none': '🌿',
        'one': '🌲',
        'circle': '🎡'
      };

      $('#vis-result').innerHTML = `${modeEmojis[mode]} 哇！${label(mode)}的方法需要种 <strong>${n}</strong> 棵小树！快看它们排队的样子！`;
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
          pathGrad.addColorStop(0, '#FF6B9D');
          pathGrad.addColorStop(0.5, '#4ECDC4');
          pathGrad.addColorStop(1, '#FFE66D');
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
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText('🌸', cx, cy + 6);
          }
        } else {
          // 绘制美丽的小路
          const pad = 40;
          const x0 = pad, x1 = w - pad;
          const y = h*0.6;

          // 小路渐变
          const pathGrad = ctx.createLinearGradient(x0, y, x1, y);
          pathGrad.addColorStop(0, '#FF6B9D');
          pathGrad.addColorStop(0.5, '#4ECDC4');
          pathGrad.addColorStop(1, '#FFE66D');
          ctx.strokeStyle = pathGrad;

          ctx.beginPath();
          ctx.moveTo(x0,y);
          ctx.lineTo(x1,y);
          ctx.stroke();

          // 小路装饰边框
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(255,107,157,0.3)';
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
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x0-5, y+10, 10, 20);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText('起点', x0, y+45);

            if(mode === 'both' || mode === 'one') {
              ctx.fillRect(x1-5, y+10, 10, 20);
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

      // 计算动画进度（考虑延迟）
      const animProgress = Math.max(0, Math.min(1, (t - delay) * 2));
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

      // 树冠 - 更鲜艳的绿色渐变
      const grad = ctx.createRadialGradient(0,-5,2,0,-5,15);
      grad.addColorStop(0,'#32CD32');
      grad.addColorStop(0.7,'#228B22');
      grad.addColorStop(1,'rgba(34,139,34,0.3)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0,-5,15,0,Math.PI*2);
      ctx.fill();

      // 树冠装饰 - 小亮点（随动画出现）
      if (animProgress > 0.5) {
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.arc(-5,-8,2,0,Math.PI*2);
        ctx.arc(6,-3,1.5,0,Math.PI*2);
        ctx.arc(2,-12,1,0,Math.PI*2);
        ctx.fill();
      }

      // 可爱的小花朵装饰（最后出现）
      if (animProgress > 0.8) {
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(4,-6,1,0,Math.PI*2);
        ctx.arc(-3,-2,1,0,Math.PI*2);
        ctx.fill();

        // 闪烁的小星星
        const sparkleTime = (performance.now() / 1000) % 2;
        if (sparkleTime < 1) {
          ctx.fillStyle = '#FFD700';
          ctx.font = '8px Comic Sans MS';
          ctx.textAlign = 'center';
          ctx.fillText('✨', 8, -15);
        }
      }

      // 添加轻微的摇摆动画
      const swayTime = (performance.now() / 2000) % (Math.PI * 2);
      const sway = Math.sin(swayTime + delay * 10) * 0.02;
      ctx.rotate(sway);

      ctx.restore();
    }

    function label(mode){
      return ({
        both:'小路两头都种树',
        none:'小路两头都不种',
        one:'一头种一头不种',
        circle:'圆形花园种树'
      })[mode] || mode;
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
