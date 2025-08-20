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

    <div id="q-container"></div>

    <!-- 顺序出题：每次只显示一道题，答对后自动进入下一题 -->
  `;

  setTimeout(()=>{
    let completedCount = 0;
    let index = 0; // 当前题目索引

    // 更新进度显示
    function updateProgress() {
      const progressEl = el.querySelector('#progress');
      if (progressEl) {
        progressEl.textContent = `${completedCount}/6`;
        if (completedCount === 6) {
          progressEl.parentElement.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
            <p style="margin: 0; color: var(--success); font-weight: 600;">已全部完成，太棒了！</p>
          `;
        }
      }
    }

    // 渲染当前题目
    function renderCurrent(){
      const container = el.querySelector('#q-container');
      const q = qs[index];
      if(!q){
        container.innerHTML = `<div class="badge success" style="font-size:16px; padding:16px 24px;">全部完成！可以刷新获得新题。</div>`;
        return;
      }
      container.innerHTML = `
        <div class="card" data-id="${q.id}" style="border-left: 4px solid var(--accent-2);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
              ${index+1}
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
      `;

      const card = container.querySelector('.card');
      const msg = card.querySelector('[data-role="msg"]');

      card.querySelector('[data-role="tip"]').addEventListener('click',()=>{
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
        const n = formulas.computeTreeCount({L:q.L,d:q.d,mode:q.mode});
        if(val===n){
          msg.innerHTML = `正确：需要 <strong>${n}</strong> 棵树。`;
          msg.className = 'badge success';
          msg.style.background = 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(59,130,246,0.12))';
          completedCount++;
          updateProgress();
          // 300ms 后切到下一题
          setTimeout(()=>{ index++; renderCurrent(); }, 300);
        } else {
          msg.innerHTML = `不正确。参考解：<strong>${n}</strong> 棵。`;
          msg.className = 'badge error';
          msg.style.background = 'linear-gradient(135deg, rgba(220,38,38,0.15), rgba(59,130,246,0.12))';
        }
      });
    }

    // 初始化渲染第一题
    renderCurrent();
  },0);

  return el;
}
