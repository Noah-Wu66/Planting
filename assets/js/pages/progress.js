export function Progress(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>学习进度（本地模拟）</h2>
      <p>由于未接入后端，这里使用浏览器本地存储记录：最近一次练习时间、小游戏最高分等。</p>
      <div class="controls">
        <button class="btn primary" id="save">模拟保存一次练习</button>
        <button class="btn" id="clear">清空</button>
      </div>
      <p class="badge" id="out">尚无记录</p>
    </div>
  `;

  setTimeout(()=>{
    const $=(id)=>el.querySelector(id);
    const key='planting-progress';
    function load(){ try{ return JSON.parse(localStorage.getItem(key)||'{}'); } catch{ return {}; } }
    function show(){ const d=load(); $('#out').textContent = Object.keys(d).length? JSON.stringify(d, null, 0) : '尚无记录'; }
    $('#save').addEventListener('click',()=>{
      const d=load(); d.lastPracticeAt=new Date().toLocaleString(); localStorage.setItem(key, JSON.stringify(d)); show();
    });
    $('#clear').addEventListener('click',()=>{ localStorage.removeItem(key); show(); });
    show();
  },0);

  return el;
}

