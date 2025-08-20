import { formulas, generatePositions } from '../shared/math.js';

export function Visualizer(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>交互式可视化 · 植树场景</h2>
      <div class="controls">
        <div class="input"><label>场景</label>
          <select id="mode">
            <option value="both">两端都栽</option>
            <option value="none">两端不栽</option>
            <option value="one">一端栽一端不栽</option>
            <option value="circle">环形</option>
          </select>
        </div>
        <div class="input"><label>路长/周长 L（米）</label><input id="len" type="number" value="100" min="1"></div>
        <div class="input"><label>树间距 d（米）</label><input id="d" type="number" value="10" min="1"></div>
        <button class="btn" id="solve">计算并可视化</button>
      </div>
      <p id="result" class="badge">请设置参数后点击“计算并可视化”</p>
      <div class="canvas-wrap"><canvas id="canvas" class="canvas"></canvas></div>
    </div>
  `;

  setTimeout(()=>{
    const $ = (id)=> el.querySelector(id);
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
        $('#result').textContent = '参数无法整除或不合理，请调整 L 与 d。';
        return;
      }
      $('#result').textContent = `场景：${label(mode)} · 应栽 ${n} 棵树`;

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

    $('#solve').addEventListener('click',()=>{
      const mode = $('#mode').value;
      const L = parseFloat($('#len').value||'0');
      const d = parseFloat($('#d').value||'1');
      draw(mode,L,d);
    });
  },0);

  return el;
}

