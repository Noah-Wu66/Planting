import { formulas } from '../shared/math.js';

// 随机生成练习题，保证四种场景覆盖且有整数解
const modes = ['both','none','one','circle'];
const modeLabel = {
  both:'两端都种树',
  none:'两端都不种',
  one:'一端种，一端不种',
  circle:'环形（圆形）种树'
};

const modeEmojis = {
  both: '🌳',
  none: '🌿',
  one: '🌲',
  circle: '🎡'
};

const storyCharacters = ['小兔子', '小熊', '小鹿', '小猴子', '小松鼠', '小狐狸'];
const storyPlaces = ['美丽的小花园', '神奇的森林', '可爱的公园', '梦幻的庭院', '童话小镇', '彩虹村庄'];

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

function generateQuestion(mode, id){
  // 为了保证整数解：先随机 n 和 d，再用 lengthFrom 反推 L/C
  // 控制范围：n 5-30，d 2-20，最终 L 不超过 500
  let tries=0;
  while(tries++<100){
    const n = randInt(5, 30);
    const d = randInt(2, 20);
    const L = formulas.lengthFrom({ n, d, mode });
    if(Number.isFinite(L) && L>0 && L<=500){
      const character = storyCharacters[randInt(0, storyCharacters.length-1)];
      const place = storyPlaces[randInt(0, storyPlaces.length-1)];

      const stem = mode==='circle'
        ? `${modeEmojis[mode]} 在${place}中有一处圆形路径，周长为 ${L} 米。若每隔 ${d} 米设置一棵树，按“${modeLabel[mode]}”计算，共需多少棵树？`
        : `${modeEmojis[mode]} 在${place}中有一条长度为 ${L} 米的小路。若每隔 ${d} 米设置一棵树，按“${modeLabel[mode]}”计算，共需多少棵树？`;

      const ans = formulas.computeTreeCount({ L, d, mode });
      if(Number.isFinite(ans) && ans>0){
        return { id, stem, mode, L, d, ans, character, place };
      }
    }
  }
  // 兜底：退回到一个固定可解问题
  const L=120,d=10;
  const character = storyCharacters[0];
  const place = storyPlaces[0];
  const ans=formulas.computeTreeCount({L,d,mode});

  const stem = mode==='circle'
    ? `${modeEmojis[mode]} 在${place}中有一处圆形路径，周长为 ${L} 米。若每隔 ${d} 米设置一棵树，按“${modeLabel[mode]}”计算，共需多少棵树？`
    : `${modeEmojis[mode]} 在${place}中有一条长度为 ${L} 米的小路。若每隔 ${d} 米设置一棵树，按“${modeLabel[mode]}”计算，共需多少棵树？`;

  return { id, stem, mode, L, d, ans, character, place };
}

function generateSet(count=6){
  const list=[]; const used=new Set(); let id=1;
  // 先保证四类各出一题
  modes.forEach(m=>{ const q=generateQuestion(m, id++); const key=`${q.mode}-${q.L}-${q.d}`; if(!used.has(key)){ used.add(key); list.push(q);} });
  // 剩余随机补足
  while(list.length<count){
    const m = modes[randInt(0, modes.length-1)];
    const q = generateQuestion(m, id++);
    const key = `${q.mode}-${q.L}-${q.d}`;
    if(!used.has(key)){ used.add(key); list.push(q); }
  }
  return list;
}

export function Exercises(){
  const qs = generateSet(6);
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <!-- 欢迎区域 -->
    <div class="hero">
      <h1>练习与挑战</h1>
      <p>完成以下练习，巩固对不同情形公式的理解与应用。</p>
    </div>

    <!-- 练习题部分 -->
    <div class="card fun-decoration">
      <h2>练习题</h2>
      <p>建议先判断端点条件，再结合 L÷d 的值确定公式。</p>

      <div style="background: rgba(37,99,235,0.06); padding: 12px; border-radius: 12px; margin: 16px 0; text-align: center;">
        <p style="margin: 0; color: var(--accent); font-weight: 600;">完成进度：<span id="progress">0/6</span></p>
      </div>
    </div>

    ${qs.map((q,i)=>`
      <div class="card" data-id="${q.id}" style="border-left: 4px solid var(--accent-2);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
            ${i+1}
          </div>
          <div style="flex: 1;">
            <div style="font-size: 16px; line-height: 1.7; color: var(--text);">${q.stem}</div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.5); padding: 16px; border-radius: 12px; margin: 16px 0;">
          <div class="controls" style="margin: 0;">
            <div class="input" style="flex: 1; max-width: 200px;">
              <label>你的答案（棵）</label>
              <input type="number" min="0" step="1" data-role="ans" placeholder="输入数字">
            </div>
            <button class="btn" data-role="tip" style="background: rgba(37,99,235,0.08); border-color: rgba(17,24,39,0.12);">提示</button>
            <button class="btn primary" data-role="check">提交</button>
          </div>
        </div>

        <div class="badge" data-role="msg" style="font-size: 16px; padding: 12px 20px;">
          输入后点击“提交”。
        </div>
      </div>
    `).join('')}
    
    <!-- 小游戏部分 -->
    <div class="card" style="margin-top:20px;">
      <h2>30 秒参数挑战</h2>
      <p>在 30 秒内多次找到能产生有效排布的参数组合。</p>

      <div style="background: linear-gradient(135deg, rgba(255,107,157,0.1), rgba(78,205,196,0.1)); padding: 20px; border-radius: 15px; margin: 16px 0;">
        <h3 style="color: var(--accent); margin-top: 0;">控制台</h3>
        <div class="controls">
          <div class="input">
            <label>路的长度</label>
            <input id="L" type="range" min="40" max="200" value="100">
            <div style="text-align: center; color: var(--muted); font-size: 14px; margin-top: 4px;">
              <span id="L-value">100</span> 米
            </div>
          </div>
          <div class="input">
            <label>树的间距</label>
            <input id="d" type="range" min="4" max="40" value="10">
            <div style="text-align: center; color: var(--muted); font-size: 14px; margin-top: 4px;">
              <span id="d-value">10</span> 米
            </div>
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
          <button class="btn primary" id="start" style="font-size: 18px; padding: 16px 32px;">
            开始
          </button>
        </div>
      </div>

      <div style="text-align: center; margin: 16px 0;">
        <div class="badge" id="status" style="font-size: 18px; padding: 16px 24px;">
          点击“开始”，挑战 30 秒内尽可能多地得到有效排布
        </div>
      </div>

      <div class="canvas-wrap">
        <canvas id="cv" class="canvas"></canvas>
        <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 10px; font-size: 12px; color: var(--muted);">
          🎮 超级植树游戏
        </div>
      </div>

      <div style="text-align: center; margin-top: 16px; color: var(--muted); font-size: 14px;">
        💡 游戏提示：调整滑块让数字能够整除，小树们就会排列整齐！
      </div>
    </div>
  `;

  setTimeout(()=>{
    let completedCount = 0;

    // 更新进度显示
    function updateProgress() {
      const progressEl = el.querySelector('#progress');
      if (progressEl) {
        progressEl.textContent = `${completedCount}/6`;
        if (completedCount === 6) {
          progressEl.parentElement.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
            <p style="margin: 0; color: var(--success); font-weight: 600;">已全部完成，继续巩固可进入挑战模式。</p>
          `;
        }
      }
    }

    // 练习题功能
    el.querySelectorAll('.card[data-id]').forEach(card=>{
      const msg = card.querySelector('[data-role="msg"]');
      const getQ = () => qs.find(x=> String(x.id)===card.getAttribute('data-id'));
      let isCompleted = false;

      card.querySelector('[data-role="tip"]').addEventListener('click',()=>{
        const q = getQ();
        const tipMessages = {
          'both': '💡 小贴士：小路两头都种树时，树的数量比间隔数多1哦！',
          'none': '💡 小贴士：小路两头都不种时，间隔数比树的数量多1呢！',
          'one': '💡 小贴士：一头种一头不种时，树的数量正好等于间隔数！',
          'circle': '💡 小贴士：圆形花园里，树的数量等于间隔数，因为是围成圆圈的！'
        };
        msg.innerHTML = tipMessages[q.mode] || '💡 小贴士：先算出路长除以间距，再根据种树方式调整！';
        msg.className = 'badge';
        msg.style.background = 'linear-gradient(135deg, rgba(255,230,109,0.2), rgba(255,107,157,0.2))';
      });

      card.querySelector('[data-role="check"]').addEventListener('click',()=>{
        const val = parseInt(card.querySelector('[data-role="ans"]').value||'NaN',10);
        const q = getQ();
        const n = formulas.computeTreeCount({L:q.L,d:q.d,mode:q.mode});

        if(val===n){
          msg.innerHTML = `正确：需要 <strong>${n}</strong> 棵树。`;
          msg.className = 'badge success';
          msg.style.background = 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(59,130,246,0.12))';

          if (!isCompleted) {
            completedCount++;
            isCompleted = true;
            updateProgress();

            // 添加庆祝动画
            card.style.animation = 'none';
            setTimeout(() => {
              card.style.animation = 'pulse 0.6s ease-in-out';
            }, 10);
          }
        } else {
          msg.innerHTML = `不正确。参考解：<strong>${n}</strong> 棵。`;
          msg.className = 'badge error';
          msg.style.background = 'linear-gradient(135deg, rgba(220,38,38,0.15), rgba(59,130,246,0.12))';
        }
      });
    });

    // 小游戏功能
    const $=(id)=>el.querySelector(id);
    const cv=$('#cv'); const ctx = cv.getContext('2d');
    function resize(){ const r=cv.parentElement.getBoundingClientRect(); cv.width=r.width; cv.height=r.height; }
    resize(); window.addEventListener('resize', resize);

    let score=0, timeLeft=30, timer=null, running=false;

    // 更新滑块显示值
    $('#L').addEventListener('input', (e) => {
      $('#L-value').textContent = e.target.value;
    });

    $('#d').addEventListener('input', (e) => {
      $('#d-value').textContent = e.target.value;
    });

    function updateStatus(txt){
      $('#status').innerHTML = `得分: <strong>${score}</strong> · 倒计时: <strong>${timeLeft}</strong> 秒 · ${txt}`;
    }

    function drawOK(){
      const w=cv.width,h=cv.height;
      ctx.clearRect(0,0,w,h);

      // 绘制庆祝背景
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/2);
      grad.addColorStop(0, 'rgba(126,231,135,0.3)');
      grad.addColorStop(1, 'rgba(126,231,135,0.05)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 绘制成功信息
      ctx.fillStyle='#16A34A';
      ctx.font='bold 24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('+1 分', w/2, h/2 - 6);

      ctx.fillStyle='#059669';
      ctx.font='16px system-ui';
      ctx.fillText('成功生成有效排布', w/2, h/2 + 18);
    }

    function drawFail(){
      const w=cv.width,h=cv.height;
      ctx.clearRect(0,0,w,h);

      ctx.fillStyle='#D97706';
      ctx.font='bold 22px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('再试一次', w/2, h/2 - 8);

      ctx.fillStyle='#92400E';
      ctx.font='14px system-ui';
      ctx.fillText('调整参数，寻找可行解', w/2, h/2 + 16);
    }

    function tick(){
      if(!running) return;
      timeLeft--;
      updateStatus('🎮 游戏进行中');
      if(timeLeft<=0){
        running=false;
        clearInterval(timer);
        $('#status').innerHTML = `结束！最终得分 <strong style="color: var(--accent); font-size: 20px;">${score}</strong> 分。`;

        // 绘制结束画面
        const w=cv.width,h=cv.height;
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = '#2563EB';
        ctx.font='bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('挑战结束', w/2, h/2);
      }
    }

    function check(){
      const L=parseInt($('#L').value,10);
      const d=parseInt($('#d').value,10);
      const mode=$('#mode').value;
      const n = formulas.computeTreeCount({L,d,mode});

      if(Number.isFinite(n) && n > 0){
        score++;
        drawOK();
        updateStatus('🎉 答对啦！继续挑战');

        // 随机改变参数增加挑战性
        setTimeout(() => {
          $('#L').value = Math.floor(Math.random() * 160) + 40;
          $('#d').value = Math.floor(Math.random() * 36) + 4;
          $('#L-value').textContent = $('#L').value;
          $('#d-value').textContent = $('#d').value;
        }, 1000);
      } else {
        drawFail();
        updateStatus('🤔 再试试看');
      }
    }

    $('#start').addEventListener('click',()=>{
      score=0;
      timeLeft=30;
      running=true;
      updateStatus('🚀 游戏开始！快调整参数');
      clearInterval(timer);
      timer=setInterval(tick,1000);

      // 清空画布，显示开始信息
      const w=cv.width,h=cv.height;
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='#2563EB';
      ctx.font='bold 22px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('开始', w/2, h/2 - 8);
      ctx.fillStyle='#059669';
      ctx.font='14px system-ui';
      ctx.fillText('调整滑块，寻找可行解', w/2, h/2 + 14);
    });

    // 当滑块停止 500ms 后自动判定一次
    let debounce=null;
    ['L','d','mode'].forEach(id=>{
      $('#'+id).addEventListener('input', ()=>{
        if(!running) return;
        updateStatus('🎯 正在调整参数');
        clearTimeout(debounce);
        debounce=setTimeout(check, 500);
      });
    });
  },0);

  return el;
}
