import { formulas } from '../shared/math.js';

const bank = [
  { id: 1, stem: '一条长 L=120 米的小路，两端都栽，树间距 d=10 米，应栽多少棵？', mode:'both', L:120, d:10, ans: 13 },
  { id: 2, stem: '一条长 L=120 米的小路，两端不栽，树间距 d=10 米，应栽多少棵？', mode:'none', L:120, d:10, ans: 11 },
  { id: 3, stem: '一条长 L=120 米的小路，一端栽一端不栽，树间距 d=10 米，应栽多少棵？', mode:'one', L:120, d:10, ans: 12 },
  { id: 4, stem: '一个环形广场周长 C=60 米，树间距 d=5 米，应栽多少棵？', mode:'circle', L:60, d:5, ans: 12 },
];

function pick(n=3){
  const shuffled=[...bank].sort(()=>Math.random()-0.5);
  return shuffled.slice(0,n);
}

export function Practice(){
  const qs = pick(4);
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>练习题</h2>
      <p>做题时可回忆“间隔 × 间距 = 总长度”的思路。</p>
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
        if(val===n){ msg.textContent = '✅ 正确！做得好。'; msg.style.color = '#7ee787'; }
        else { msg.textContent = `❌ 再想想：本题应为 ${n} 棵。`; msg.style.color = '#ff6b6b'; }
      });
    });
  },0);

  return el;
}

