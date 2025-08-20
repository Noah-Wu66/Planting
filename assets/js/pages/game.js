import { formulas } from '../shared/math.js';

export function Game(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>植树小游戏（MVP）</h2>
      <p>规则：在限定时间内，拖动滑块设置树间距 d，使得恰好能整除路长 L，形成正确的棵数。正确即得分。</p>
      <div class="controls">
        <div class="input"><label>路长 L</label><input id="L" type="range" min="40" max="200" value="100"></div>
        <div class="input"><label>树间距 d</label><input id="d" type="range" min="4" max="40" value="10"></div>
        <div class="input"><label>场景</label>
          <select id="mode">
            <option value="both">两端都栽</option>
            <option value="none">两端不栽</option>
            <option value="one">一端栽</option>
            <option value="circle">环形</option>
          </select>
        </div>
        <button class="btn primary" id="start">开始挑战</button>
      </div>
      <p class="badge" id="status">点击开始挑战</p>
      <div class="canvas-wrap"><canvas id="cv" class="canvas"></canvas></div>
    </div>
  `;

  setTimeout(()=>{
    const $=(id)=>el.querySelector(id);
    const cv=$('#cv'); const ctx = cv.getContext('2d');
    function resize(){ const r=cv.parentElement.getBoundingClientRect(); cv.width=r.width; cv.height=r.height; }
    resize(); window.addEventListener('resize', resize);

    let score=0, timeLeft=30, timer=null, running=false;

    function updateStatus(txt){ $('#status').textContent = `分数 ${score} · 倒计时 ${timeLeft}s · ${txt}` }

    function drawOK(){
      const w=cv.width,h=cv.height; ctx.clearRect(0,0,w,h);
      ctx.fillStyle='#7ee787'; ctx.font='24px system-ui'; ctx.fillText('✅ 正确！+1 分', 20, 40);
    }

    function tick(){
      if(!running) return;
      timeLeft--; updateStatus('进行中');
      if(timeLeft<=0){ running=false; clearInterval(timer); updateStatus('结束'); }
    }

    function check(){
      const L=parseInt($('#L').value,10); const d=parseInt($('#d').value,10); const mode=$('#mode').value;
      const n = formulas.computeTreeCount({L,d,mode});
      if(Number.isFinite(n)){ score++; drawOK(); updateStatus('答对啦！'); }
      else { updateStatus('未能整除，再试一次'); }
    }

    $('#start').addEventListener('click',()=>{
      score=0; timeLeft=30; running=true; updateStatus('进行中');
      clearInterval(timer); timer=setInterval(tick,1000);
    });

    // 当滑块停止 300ms 后自动判定一次
    let debounce=null;
    ['L','d','mode'].forEach(id=>{
      $('#'+id).addEventListener('input', ()=>{
        if(!running) return; updateStatus('调整参数中');
        clearTimeout(debounce); debounce=setTimeout(check, 300);
      });
    });
  },0);

  return el;
}

