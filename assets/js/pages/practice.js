import { formulas } from '../shared/math.js';

// 随机生成练习题，保证四种场景覆盖且有整数解
const modes = ['both','none','one','circle'];
const modeLabel = { both:'两端都栽', none:'两端不栽', one:'一端栽一端不栽', circle:'环形' };

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
      const stem = mode==='circle'
        ? `一个${modeLabel[mode]}广场周长 C=${L} 米，树间距 d=${d} 米，应栽多少棵？`
        : `一条长 L=${L} 米的小路，${modeLabel[mode]}，树间距 d=${d} 米，应栽多少棵？`;
      const ans = formulas.computeTreeCount({ L, d, mode });
      if(Number.isFinite(ans) && ans>0){
        return { id, stem, mode, L, d, ans };
      }
    }
  }
  // 兜底：退回到一个固定可解问题
  const L=120,d=10; const ans=formulas.computeTreeCount({L,d,mode});
  const stem = mode==='circle'
    ? `一个${modeLabel[mode]}广场周长 C=${L} 米，树间距 d=${d} 米，应栽多少棵？`
    : `一条长 L=${L} 米的小路，${modeLabel[mode]}，树间距 d=${d} 米，应栽多少棵？`;
  return { id, stem, mode, L, d, ans };
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

export function Practice(){
  const qs = generateSet(6);
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>练习题</h2>
      <p>做题时可回忆“间隔 × 间距 = 总长度”的思路。题目会覆盖四种典型场景，并随机生成参数。</p>
    </div>
    ${qs.map((q,i)=>`
      <div class="card" data-id="${q.id}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
          <div style="flex:1 1 300px;">${i+1}. ${q.stem}</div>
          <div class="controls">
            <div class="input"><label>你的答案（棵）</label><input type="number" min="0" step="1" data-role="ans"></div>
            <button class="btn" data-role="tip">提示</button>
            <button class="btn primary" data-role="check">提交</button>
          </div>
        </div>
        <p class="badge" data-role="msg">等待作答...</p>
      </div>
    `).join('')}
  `;

  setTimeout(()=>{
    el.querySelectorAll('.card[data-id]').forEach(card=>{
      const msg = card.querySelector('[data-role="msg"]');
      const getQ = () => qs.find(x=> String(x.id)===card.getAttribute('data-id'));
      card.querySelector('[data-role="tip"]').addEventListener('click',()=>{
        msg.textContent = '提示：先计算 L/d，注意不同场景的 +1/-1。';
      });
      card.querySelector('[data-role="check"]').addEventListener('click',()=>{
        const val = parseInt(card.querySelector('[data-role="ans"]').value||'NaN',10);
        const q = getQ();
        const n = formulas.computeTreeCount({L:q.L,d:q.d,mode:q.mode});
        if(val===n){ msg.textContent = '✅ 正确！做得好。'; msg.style.color = '#34c759'; }
        else { msg.textContent = `❌ 再想想：本题应为 ${n} 棵。`; msg.style.color = '#ff3b30'; }
      });
    });
  },0);

  return el;
}

