import { chatWithAI } from '../shared/api.js';

export function AILearning(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <!-- 欢迎区域 -->
    <div class="hero">
      <div class="mobile-cta" role="navigation" aria-label="快速入口（移动端）">
        <a class="btn primary" href="#/ai-learning">🤖 AI学习</a>
      </div>
      <h1>🤖 AI智能学习助手</h1>
      <p>设置参数后观看种树演示，与AI助手互动学习植树问题的奥秘。</p>
    </div>

    <!-- 控制面板 -->
    <div class="card" style="margin-top:20px;">
      <h2>🎛️ 参数设置</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
        <div class="input">
          <label>地面长度（米）</label>
          <input id="ground-length" type="number" value="100" min="20" max="200" step="10">
        </div>
        <div class="input">
          <label>种树间距（米）</label>
          <input id="tree-interval" type="number" value="10" min="5" max="25" step="5">
        </div>
        <div class="input">
          <label>种树模式</label>
          <select id="tree-mode">
            <option value="both">两端都种树</option>
            <option value="none">两端都不种</option>
            <option value="one">一端种，一端不种</option>
            <option value="circle">环形种树</option>
          </select>
        </div>
        <div class="input">
          <label>图形模式</label>
          <select id="shape-mode">
            <option value="line">直线</option>
            <option value="circle">圆形</option>
            <option value="triangle">三角形</option>
            <option value="square">正方形</option>
          </select>
        </div>
      </div>
      <div style="text-align: center;">
        <button class="btn" id="clear-all">🗑️ 清空重置</button>
        <button class="btn primary" id="random-generate">🎲 随机生成</button>
      </div>
    </div>

    <!-- 种树演示区域 -->
    <div class="card" style="margin-top:20px;">
      <h2>🌳 种树演示区域</h2>
      <div id="drag-area" style="position: relative; width: 100%; height: 300px; border: 2px dashed var(--accent); border-radius: 12px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); overflow: hidden;">
        <!-- 地面线段 -->
        <svg id="ground-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          <line id="ground-line" x1="50" y1="150" x2="550" y2="150" stroke="#2563eb" stroke-width="6" stroke-dasharray="8,4"/>
          <g id="snap-points"></g>
          <g id="measurements"></g>
        </svg>

        <!-- 演示说明 -->
        <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 8px; background: rgba(255,255,255,0.9); padding: 8px; border-radius: 8px; flex-wrap: wrap;">
          <span style="font-size: 12px; color: var(--muted); align-self: center;" id="demo-hint">🌳 正确的种树演示</span>
        </div>

        <!-- 状态显示 -->
        <div id="status-display" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 8px; font-size: 12px; color: var(--muted);">
          树木数量: <span id="tree-count">0</span>
        </div>
      </div>
    </div>

    <!-- AI对话区域 -->
    <div class="card" style="margin-top:20px;">
      <h2>💬 AI助手对话</h2>

      <!-- 对话历史 -->
      <div id="chat-history" style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc;">
        <div style="text-align: center; color: var(--muted); padding: 20px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🤖</div>
          <p>你好！我是你的植树问题学习助手。<br>设置参数后观看演示，然后向我提问吧！</p>
        </div>
      </div>

      <!-- 输入区域 -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <input id="chat-input" type="text" value="解读演示" placeholder="请输入你的问题..." style="flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 14px;">
        <button id="send-message" class="btn primary">发送</button>
      </div>

      <!-- 控制按钮 -->
      <div id="chat-controls" style="display: none; justify-content: center; gap: 12px;">
        <button id="continue-chat" class="btn">继续提问</button>
        <button id="new-question" class="btn primary">新的问题</button>
      </div>

      <!-- 加载状态 -->
      <div id="loading-indicator" style="display: none; text-align: center; padding: 16px; color: var(--muted);">
        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid var(--accent); border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 8px;"></div>
        AI正在思考中...
      </div>
    </div>
  `;

  // 初始化交互功能
  setTimeout(() => {
    initDemoInteraction(el);
  }, 0);

  return el;
}

// 演示交互逻辑
function initDemoInteraction(container) {
  const dragArea = container.querySelector('#drag-area');
  const groundSvg = container.querySelector('#ground-svg');
  const groundLine = container.querySelector('#ground-line');
  const snapPoints = container.querySelector('#snap-points');
  const measurements = container.querySelector('#measurements');
  const treeCountDisplay = container.querySelector('#tree-count');

  // 检测移动端
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 状态管理
  let trees = [];
  let groundConfig = {
    length: 100,
    interval: 10,
    startX: 50,
    startY: 150,
    endX: 550,
    shape: 'line' // 新增图形模式
  };
  let treeIdCounter = 0;

  // 随机生成参数
  function generateRandomParameters() {
    const lengths = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    const intervals = [5, 10, 15, 20, 25];
    const modes = ['both', 'none', 'one', 'circle'];
    const shapes = ['line', 'circle', 'triangle', 'square'];

    const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
    const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

    // 更新界面
    container.querySelector('#ground-length').value = randomLength;
    container.querySelector('#tree-interval').value = randomInterval;
    container.querySelector('#tree-mode').value = randomMode;
    container.querySelector('#shape-mode').value = randomShape;

    // 更新地面和演示
    updateGround();
    updateDemo();
  }

  // 更新演示
  function updateDemo() {
    // 清除现有树木
    trees = [];
    clearTreeElements();

    // 根据参数生成正确的树木位置
    const correctPositions = calculateCorrectTreePositions();
    
    // 创建树木元素
    correctPositions.forEach((pos, index) => {
      const tree = {
        id: `demo-tree-${++treeIdCounter}`,
        x: pos.x - 18, // 调整显示位置
        y: pos.y - 36,
        isPlaced: true
      };
      trees.push(tree);
      createDemoTreeElement(tree);
    });

    updateTreeDisplay();
  }

  // 计算正确的树木位置
  function calculateCorrectTreePositions() {
    const mode = container.querySelector('#tree-mode').value;
    const shape = container.querySelector('#shape-mode').value;
    let positions = [];

    // 根据图形模式生成不同的种植点
    switch (shape) {
      case 'line':
        positions = generateLinePoints(mode);
        break;
      case 'circle':
        positions = generateCirclePoints(mode);
        break;
      case 'triangle':
        positions = generateTrianglePoints(mode);
        break;
      case 'square':
        positions = generateSquarePoints(mode);
        break;
      default:
        positions = generateLinePoints(mode);
    }

    return positions;
  }

  // 清除所有树木元素
  function clearTreeElements() {
    const existingTrees = dragArea.querySelectorAll('.demo-tree');
    existingTrees.forEach(tree => tree.remove());
  }

  // 创建演示树木元素（不可拖拽）
  function createDemoTreeElement(tree) {
    const treeEl = document.createElement('div');
    treeEl.className = 'demo-tree';
    treeEl.id = tree.id;
    treeEl.innerHTML = '🌳';
    const treeSize = isMobile ? '32px' : '36px';
    treeEl.style.cssText = `
      position: absolute;
      left: ${tree.x}px;
      top: ${tree.y}px;
      font-size: ${treeSize};
      user-select: none;
      z-index: 10;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
      pointer-events: none;
      animation: treeAppear 0.3s ease-out;
    `;

    dragArea.appendChild(treeEl);
  }
  // 更新地面显示
  function updateGround() {
    const length = parseFloat(container.querySelector('#ground-length').value);
    const interval = parseFloat(container.querySelector('#tree-interval').value);
    const shape = container.querySelector('#shape-mode').value;

    groundConfig.length = length;
    groundConfig.interval = interval;
    groundConfig.shape = shape;

    // 计算地面在SVG中的像素长度（比例缩放）
    const maxPixelLength = dragArea.clientWidth - 100; // 留边距
    const pixelLength = Math.min(maxPixelLength, length * 4); // 4像素/米的比例

    // 使地面线段在区域中心显示
    const centerX = dragArea.clientWidth / 2;
    groundConfig.startX = centerX - pixelLength / 2;
    groundConfig.endX = centerX + pixelLength / 2;

    // 根据图形模式更新地面显示
    updateGroundShape();

    // 生成吸附点
    updateSnapPoints();
    updateMeasurements();
    
    // 自动更新演示
    updateDemo();
  }

  // 更新地面图形显示
  function updateGroundShape() {
    // 清除现有的地面图形
    const existingShapes = groundSvg.querySelectorAll('.ground-shape');
    existingShapes.forEach(shape => shape.remove());

    const centerX = (groundConfig.startX + groundConfig.endX) / 2;
    const centerY = groundConfig.startY;
    const size = Math.min((groundConfig.endX - groundConfig.startX) / 2, 100) * 0.8;

    switch (groundConfig.shape) {
      case 'line':
        // 直线模式
        groundLine.setAttribute('x1', groundConfig.startX);
        groundLine.setAttribute('x2', groundConfig.endX);
        groundLine.setAttribute('y1', groundConfig.startY);
        groundLine.setAttribute('y2', groundConfig.startY);
        groundLine.style.display = 'block';
        break;

      case 'circle':
        // 圆形模式
        groundLine.style.display = 'none';
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', size);
        circle.setAttribute('stroke', '#2563eb');
        circle.setAttribute('stroke-width', '6');
        circle.setAttribute('stroke-dasharray', '8,4');
        circle.setAttribute('fill', 'none');
        circle.classList.add('ground-shape');
        groundSvg.appendChild(circle);
        break;

      case 'triangle':
        // 三角形模式
        groundLine.style.display = 'none';
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const trianglePoints = [
          `${centerX},${centerY - size * 0.8}`,
          `${centerX - size * 0.8},${centerY + size * 0.4}`,
          `${centerX + size * 0.8},${centerY + size * 0.4}`
        ].join(' ');
        triangle.setAttribute('points', trianglePoints);
        triangle.setAttribute('stroke', '#2563eb');
        triangle.setAttribute('stroke-width', '6');
        triangle.setAttribute('stroke-dasharray', '8,4');
        triangle.setAttribute('fill', 'none');
        triangle.classList.add('ground-shape');
        groundSvg.appendChild(triangle);
        break;

      case 'square':
        // 正方形模式
        groundLine.style.display = 'none';
        const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        square.setAttribute('x', centerX - size);
        square.setAttribute('y', centerY - size);
        square.setAttribute('width', size * 2);
        square.setAttribute('height', size * 2);
        square.setAttribute('stroke', '#2563eb');
        square.setAttribute('stroke-width', '6');
        square.setAttribute('stroke-dasharray', '8,4');
        square.setAttribute('fill', 'none');
        square.classList.add('ground-shape');
        groundSvg.appendChild(square);
        break;
    }
  }

  // 更新吸附点
  function updateSnapPoints() {
    snapPoints.innerHTML = '';

    const mode = container.querySelector('#tree-mode').value;
    const shape = groundConfig.shape;

    let points = [];

    // 根据图形模式生成不同的种植点
    switch (shape) {
      case 'line':
        points = generateLinePoints(mode);
        break;
      case 'circle':
        points = generateCirclePoints(mode);
        break;
      case 'triangle':
        points = generateTrianglePoints(mode);
        break;
      case 'square':
        points = generateSquarePoints(mode);
        break;
      default:
        points = generateLinePoints(mode);
    }

    // 绘制吸附点
    points.forEach((point, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      // 修复问题4：增大吸附点显示尺寸，提高可视性
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', '#10b981');
      circle.setAttribute('stroke', '#065f46');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('opacity', '0.8');
      circle.setAttribute('data-snap-index', index);
      snapPoints.appendChild(circle);
    });

    return points;
  }

  // 生成直线种植点
  function generateLinePoints(mode) {
    const pixelInterval = (groundConfig.endX - groundConfig.startX) * groundConfig.interval / groundConfig.length;
    const numIntervals = Math.floor(groundConfig.length / groundConfig.interval);
    const scale = (groundConfig.endX - groundConfig.startX) / groundConfig.length; // 像素/米
    let points = [];

    if (mode === 'circle') {
      // 环形模式：按像素间距均匀分布在圆周上
      const centerX = (groundConfig.startX + groundConfig.endX) / 2;
      const centerY = groundConfig.startY;
      const radius = Math.min((groundConfig.endX - groundConfig.startX) / 2, 100) * 0.8;
      const circumference = 2 * Math.PI * radius;
      const pxInterval = Math.max(1, groundConfig.interval * scale);
      const numPoints = Math.max(1, Math.floor(circumference / pxInterval));

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push({ x, y });
      }
    } else {
      // 直线模式
      for (let i = 0; i <= numIntervals; i++) {
        const x = groundConfig.startX + i * pixelInterval;
        const y = groundConfig.startY;

        if (mode === 'both' ||
            (mode === 'none' && i > 0 && i < numIntervals) ||
            (mode === 'one' && i < numIntervals)) {
          points.push({ x, y });
        }
      }

      // 确保端点精确对应线段端点
      if (mode === 'both' && points.length > 1) {
        points[0] = { x: groundConfig.startX, y: groundConfig.startY };
        points[points.length - 1] = { x: groundConfig.endX, y: groundConfig.startY };
      }
    }

    return points;
  }

  // 生成圆形种植点
  function generateCirclePoints(mode) {
    const centerX = (groundConfig.startX + groundConfig.endX) / 2;
    const centerY = groundConfig.startY;
    const radius = Math.min((groundConfig.endX - groundConfig.startX) / 2, 100) * 0.8;

    // 统一使用“米→像素”的换算，保证真实间距
    const scale = (groundConfig.endX - groundConfig.startX) / groundConfig.length; // 像素/米
    const pxInterval = Math.max(1, groundConfig.interval * scale);

    // 计算圆周长和需要的点数
    const circumference = 2 * Math.PI * radius;
    const numPoints = Math.max(3, Math.floor(circumference / pxInterval));

    let points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  }

  // 生成三角形种植点
  function generateTrianglePoints(mode) {
    const centerX = (groundConfig.startX + groundConfig.endX) / 2;
    const centerY = groundConfig.startY;
    const size = Math.min((groundConfig.endX - groundConfig.startX) / 2, 100) * 0.8;

    // 等边三角形的三个顶点
    const vertices = [
      { x: centerX, y: centerY - size * 0.8 }, // 顶点
      { x: centerX - size * 0.8, y: centerY + size * 0.4 }, // 左下
      { x: centerX + size * 0.8, y: centerY + size * 0.4 }  // 右下
    ];

    const scale = (groundConfig.endX - groundConfig.startX) / groundConfig.length; // 像素/米
    const pxInterval = Math.max(1, groundConfig.interval * scale);
    let points = [];

    if (mode === 'circle') {
      // 环形：沿三条边整圈均匀分布
      for (let i = 0; i < 3; i++) {
        const start = vertices[i];
        const end = vertices[(i + 1) % 3];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const edgeLength = Math.hypot(dx, dy);
        for (let s = 0; s < edgeLength; s += pxInterval) {
          const t = s / edgeLength;
          const x = start.x + dx * t;
          const y = start.y + dy * t;
          const last = points[points.length - 1];
          if (!last || Math.hypot(last.x - x, last.y - y) > 0.5) points.push({ x, y });
        }
      }
    } else {
      // 类比直线模式的端点规则
      for (let i = 0; i < 3; i++) {
        const start = vertices[i];
        const end = vertices[(i + 1) % 3];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const edgeLength = Math.hypot(dx, dy);
        const includeStart = mode === 'both' || mode === 'one';
        const includeEnd = mode === 'both';
        const startS = (i === 0 ? (includeStart ? 0 : pxInterval) : pxInterval);
        for (let s = startS; s <= edgeLength + 1e-6; s += pxInterval) {
          if (s >= edgeLength - 1e-6) {
            if (!includeEnd) break;
            const x = end.x, y = end.y;
            const last = points[points.length - 1];
            if (!last || Math.hypot(last.x - x, last.y - y) > 0.5) points.push({ x, y });
            break;
          } else {
            const t = s / edgeLength;
            const x = start.x + dx * t;
            const y = start.y + dy * t;
            points.push({ x, y });
          }
        }
      }
    }

    return points;
  }

  // 生成正方形种植点
  function generateSquarePoints(mode) {
    const centerX = (groundConfig.startX + groundConfig.endX) / 2;
    const centerY = groundConfig.startY;
    const size = Math.min((groundConfig.endX - groundConfig.startX) / 2, 100) * 0.8;

    // 正方形的四个顶点
    const vertices = [
      { x: centerX - size, y: centerY - size }, // 左上
      { x: centerX + size, y: centerY - size }, // 右上
      { x: centerX + size, y: centerY + size }, // 右下
      { x: centerX - size, y: centerY + size }  // 左下
    ];

    const scale = (groundConfig.endX - groundConfig.startX) / groundConfig.length; // 像素/米
    const pxInterval = Math.max(1, groundConfig.interval * scale);
    let points = [];

    const edges = [
      { start: vertices[0], end: vertices[1] },
      { start: vertices[1], end: vertices[2] },
      { start: vertices[2], end: vertices[3] },
      { start: vertices[3], end: vertices[0] },
    ];

    if (mode === 'circle') {
      // 环形：整圈均匀分布
      edges.forEach(({ start, end }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const edgeLength = Math.hypot(dx, dy);
        for (let s = 0; s < edgeLength; s += pxInterval) {
          const t = s / edgeLength;
          points.push({ x: start.x + dx * t, y: start.y + dy * t });
        }
      });
    } else {
      // 直线端点模式映射到每条边
      edges.forEach((seg, idx) => {
        const { start, end } = seg;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const edgeLength = Math.hypot(dx, dy);
        const includeStart = (idx === 0) ? (mode === 'both' || mode === 'one') : false; // 仅首边决定是否包含第一个顶点
        const includeEnd = (idx === edges.length - 1) ? (mode === 'both') : true; // 中间边包含终点，与下一边起点去重

        let s = includeStart ? 0 : pxInterval;
        for (; s <= edgeLength + 1e-6; s += pxInterval) {
          if (s >= edgeLength - 1e-6) {
            if (!includeEnd) break;
            const x = end.x, y = end.y;
            const last = points[points.length - 1];
            if (!last || Math.hypot(last.x - x, last.y - y) > 0.5) points.push({ x, y });
            break;
          } else {
            const t = s / edgeLength;
            points.push({ x: start.x + dx * t, y: start.y + dy * t });
          }
        }
      });
    }

    return points;
  }

  // 更新测量标注
  function updateMeasurements() {
    measurements.innerHTML = '';

    // 修复问题4：增大测量标注字体大小，提高可读性
    // 添加长度标注
    const lengthText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lengthText.setAttribute('x', (groundConfig.startX + groundConfig.endX) / 2);
    lengthText.setAttribute('y', groundConfig.startY + 30);
    lengthText.setAttribute('text-anchor', 'middle');
    lengthText.setAttribute('font-size', '14');
    lengthText.setAttribute('fill', '#374151');
    lengthText.setAttribute('font-weight', 'bold');
    lengthText.textContent = `${groundConfig.length}米`;
    measurements.appendChild(lengthText);

    // 添加间距标注
    if (groundConfig.interval > 0) {
      const intervalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      intervalText.setAttribute('x', groundConfig.startX + 25);
      intervalText.setAttribute('y', groundConfig.startY - 15);
      intervalText.setAttribute('font-size', '12');
      intervalText.setAttribute('fill', '#6b7280');
      intervalText.setAttribute('font-weight', 'bold');
      intervalText.textContent = `间距: ${groundConfig.interval}米`;
      measurements.appendChild(intervalText);
    }
  }

  // 初始化
  updateGround();
  updateTreeDisplay();

  // 事件监听器
  container.querySelector('#random-generate').addEventListener('click', generateRandomParameters);
  container.querySelector('#clear-all').addEventListener('click', () => {
    trees = [];
    clearTreeElements();
    updateTreeDisplay();
    // 重置参数
    container.querySelector('#ground-length').value = 100;
    container.querySelector('#tree-interval').value = 10;
    container.querySelector('#tree-mode').value = 'both';
    container.querySelector('#shape-mode').value = 'line';
    updateGround();
  });

  // 参数变化监听（实时同步）
  const paramInputs = [
    '#ground-length',
    '#tree-interval',
    '#tree-mode',
    '#shape-mode'
  ];

  paramInputs.forEach(selector => {
    const element = container.querySelector(selector);
    if (element) {
      element.addEventListener('change', updateGround);
      element.addEventListener('input', updateGround);
    }
  });

  // 移动端提示文本优化
  if (isMobile) {
    const demoHint = container.querySelector('#demo-hint');
    if (demoHint) {
      demoHint.textContent = '🌳 正确的种树演示';
    }
  }

  function updateTreeDisplay() {
    treeCountDisplay.textContent = trees.length;
    const placedTrees = trees.filter(t => t.isPlaced).length;
    if (placedTrees > 0) {
      treeCountDisplay.textContent += ` (已放置: ${placedTrees})`;
    }
  }

  // 初始化AI对话功能（仅依赖参数设置，不传演示区域相关数据）
  initChatFeature(container, () => ({
    ground: {
      length: groundConfig.length,
      interval: groundConfig.interval
    },
    tree_mode: container.querySelector('#tree-mode').value,
    shape_mode: container.querySelector('#shape-mode').value
  }));
}

// AI对话功能
function initChatFeature(container, getInteractionState) {
  const chatHistory = container.querySelector('#chat-history');
  const chatInput = container.querySelector('#chat-input');
  const sendButton = container.querySelector('#send-message');
  const chatControls = container.querySelector('#chat-controls');
  const continueButton = container.querySelector('#continue-chat');
  const newQuestionButton = container.querySelector('#new-question');
  const loadingIndicator = container.querySelector('#loading-indicator');

  let conversationHistory = [];
  let isLoading = false;

  // 更新输入状态
  function updateChatInputState() {
    const hasInput = chatInput && chatInput.value.trim().length > 0;

    if (sendButton) {
      sendButton.disabled = !hasInput || isLoading;

      if (!hasInput) {
        sendButton.title = '请输入问题';
      } else {
        sendButton.title = '';
      }
    }
  }

  // 简单的Markdown解析函数
  function parseMarkdown(text) {
    return text
      // 粗体 **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体 *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 代码 `code`
      .replace(/`(.*?)`/g, '<code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
      // 换行
      .replace(/\n/g, '<br>')
      // 数字列表 1. item
      .replace(/^(\d+)\.\s+(.+)$/gm, '<div style="margin: 4px 0;"><strong>$1.</strong> $2</div>')
      // 无序列表 - item 或 * item
      .replace(/^[-*]\s+(.+)$/gm, '<div style="margin: 4px 0; padding-left: 16px;">• $1</div>');
  }

  // 添加消息到对话历史
  function addMessage(role, content, isError = false) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${role}`;
    messageEl.style.cssText = `
      margin-bottom: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      max-width: 80%;
      line-height: 1.5;
      ${role === 'user' ?
        'background: var(--accent); color: white; margin-left: auto; text-align: right;' :
        `background: ${isError ? '#fee2e2' : '#f1f5f9'}; color: ${isError ? '#dc2626' : 'var(--text)'}; margin-right: auto;`
      }
    `;

    if (role === 'assistant') {
      const avatar = document.createElement('div');
      avatar.style.cssText = 'display: inline-block; margin-right: 8px; font-size: 16px; vertical-align: top;';
      avatar.textContent = isError ? '⚠️' : '🤖';
      messageEl.appendChild(avatar);
    }

    const textEl = document.createElement('div');
    textEl.style.cssText = 'display: inline-block; max-width: calc(100% - 32px);';

    // 对于AI回复，使用Markdown解析；对于用户消息，使用纯文本
    if (role === 'assistant' && !isError) {
      textEl.innerHTML = parseMarkdown(content);
    } else {
      textEl.textContent = content;
    }

    messageEl.appendChild(textEl);

    // 清空欢迎消息
    if (chatHistory && chatHistory.children.length === 1 && chatHistory.firstChild &&
        chatHistory.firstChild.nodeType === Node.ELEMENT_NODE &&
        chatHistory.firstChild.style &&
        chatHistory.firstChild.style.textAlign === 'center') {
      chatHistory.innerHTML = '';
    }

    if (chatHistory) {
      chatHistory.appendChild(messageEl);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  }

  // 发送消息到AI
  async function sendMessage(isNewConversation = false) {
    if (!chatInput) return;

    const message = chatInput.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    updateChatInputState();

    // 添加用户消息
    addMessage('user', message);
    chatInput.value = '';

    // 显示加载状态
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
    }

    try {
      const data = await chatWithAI(
        message,
        getInteractionState(),
        conversationHistory,
        isNewConversation
      );

      // 添加AI回复
      addMessage('assistant', data.response);

      // 更新对话历史
      conversationHistory = data.updated_history;

      // 显示控制按钮
      if (chatControls) {
        chatControls.style.display = 'flex';
      }

    } catch (error) {
      console.error('AI请求失败:', error);
      addMessage('assistant', '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。', true);
    } finally {
      isLoading = false;
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
      updateChatInputState();
    }
  }

  // 检测移动端
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 事件监听
  if (chatInput) {
    chatInput.addEventListener('input', updateChatInputState);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // 移动端优化：防止输入时页面缩放
  if (isMobile && chatInput) {
    chatInput.addEventListener('focus', () => {
      // 滚动到输入框位置
      setTimeout(() => {
        chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });

    // 移动端发送按钮优化
    if (sendButton) {
      sendButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 防止双重触发
        if (!sendButton.disabled) {
          sendMessage();
        }
      });
    }
  }

  if (sendButton) {
    sendButton.addEventListener('click', () => sendMessage());
  }

  if (continueButton) {
    continueButton.addEventListener('click', () => {
    if (chatControls) {
      chatControls.style.display = 'none';
    }
    if (chatInput) {
      chatInput.focus();
    }
  });
  }

  if (newQuestionButton) {
    newQuestionButton.addEventListener('click', () => {
    conversationHistory = [];
    if (chatControls) {
      chatControls.style.display = 'none';
    }
    if (chatHistory) {
      chatHistory.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 20px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🤖</div>
          <p>对话已重置，请提出新的问题！</p>
        </div>
      `;
    }
    if (chatInput) {
      chatInput.focus();
    }
  });
  }

  // 暴露更新函数给外部调用
  window.updateChatInputState = updateChatInputState;

  // 初始状态
  updateChatInputState();
}
