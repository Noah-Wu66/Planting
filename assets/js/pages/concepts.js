import { formulas } from '../shared/math.js';

const items = [
  { key: 'both', title: '直线两端都栽', idea: 'n 棵树有 n-1 个间隔，路长 L = (n-1)*d', formula: 'n = L/d + 1' },
  { key: 'none', title: '直线两端不栽', idea: 'n 棵树形成 n+1 个间隔，路长 L = (n+1)*d', formula: 'n = L/d - 1' },
  { key: 'one', title: '一端栽一端不栽', idea: 'n 棵树形成 n 个间隔，路长 L = n*d', formula: 'n = L/d' },
  { key: 'circle', title: '环形植树', idea: 'n 棵树有 n 个间隔，周长 C = n*d', formula: 'n = C/d' },
];

export function Concepts(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>植树问题的基本概念</h2>
      <p>我们将用统一的“树间距 d、树棵数 n、路长/周长 L 或 C”的方式来理解四类场景。</p>
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
    <div class="card" style="margin-top:12px;">
      <h2>统一公式推导</h2>
      <p>用“间隔数 × 间距 = 总长度”的思想：直线两端都栽时，间隔数为 n-1；两端不栽为 n+1；一端栽为 n；环形为 n。</p>
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
      </div>
      <p id="out" class="badge">结果将在这里显示</p>
    </div>
  `;

  setTimeout(() => {
    const $ = (id)=>el.querySelector(id);
    $('#calc').addEventListener('click', () => {
      const L = parseFloat($('#len').value || '0');
      const d = parseFloat($('#d').value || '1');
      const mode = $('#mode').value;
      const n = formulas.computeTreeCount({ L, d, mode });
      const text = Number.isFinite(n) ? `应栽 ${n} 棵树` : '输入不合法或无法整除，请调整参数';
      $('#out').textContent = text;
    });
  }, 0);

  return el;
}

