/**
 * 可复用的种树演示组件
 * 支持多种图形模式和种植模式的可视化演示
 */

export class TreeDemo {
  constructor(options) {
    this.container = options.container;
    this.parameters = options.parameters || {
      length: 100,
      interval: 10,
      mode: 'both',
      shape: 'line'
    };
    this.isReadOnly = options.readOnly !== false; // 默认为只读模式
    this.showSteps = options.showSteps || false; // 是否显示解题步骤
    
    this.trees = [];
    this.treeIdCounter = 0;
    
    // 检测移动端
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.init();
  }
  
  init() {
    this.createDemoArea();
    this.updateDemo();
  }
  
  createDemoArea() {
    this.container.innerHTML = `
      <div class="tree-demo-wrapper" style="width: 100%;">
        <div id="tree-demo-area" style="position: relative; width: 100%; height: 300px; border: 2px dashed var(--accent); border-radius: 12px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); overflow: hidden;">
          <!-- 地面SVG -->
          <svg id="demo-ground-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
            <line id="demo-ground-line" x1="50" y1="150" x2="550" y2="150" stroke="#2563eb" stroke-width="6" stroke-dasharray="8,4"/>
            <g id="demo-snap-points"></g>
            <g id="demo-measurements"></g>
          </svg>

          <!-- 参数显示 -->
          <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 8px; font-size: 12px; color: var(--muted);">
            <div><strong>长度:</strong> <span id="demo-length">${this.parameters.length}</span>米</div>
            <div><strong>间距:</strong> <span id="demo-interval">${this.parameters.interval}</span>米</div>
            <div><strong>模式:</strong> <span id="demo-mode">${this.getModeText(this.parameters.mode)}</span></div>
            <div><strong>图形:</strong> <span id="demo-shape">${this.getShapeText(this.parameters.shape)}</span></div>
          </div>

          <!-- 状态显示 -->
          <div style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 8px; font-size: 12px; color: var(--muted);">
            <div style="font-weight: bold; color: var(--accent);">树木数量: <span id="demo-tree-count">0</span></div>
          </div>
        </div>
        
        ${this.showSteps ? this.createStepsSection() : ''}
      </div>
    `;
    
    this.demoArea = this.container.querySelector('#tree-demo-area');
    this.groundSvg = this.container.querySelector('#demo-ground-svg');
    this.groundLine = this.container.querySelector('#demo-ground-line');
    this.snapPoints = this.container.querySelector('#demo-snap-points');
    this.measurements = this.container.querySelector('#demo-measurements');
    this.treeCountDisplay = this.container.querySelector('#demo-tree-count');
  }
  
  createStepsSection() {
    return `
      <div style="margin-top: 16px; padding: 16px; background: #f0f9ff; border-radius: 12px;">
        <h4 style="margin: 0 0 12px 0; color: var(--accent);">🧮 解题步骤</h4>
        <div id="demo-solving-steps"></div>
      </div>
    `;
  }
  
  updateParameters(newParams) {
    this.parameters = { ...this.parameters, ...newParams };
    this.updateParameterDisplay();
    this.updateDemo();
  }
  
  updateParameterDisplay() {
    this.container.querySelector('#demo-length').textContent = this.parameters.length;
    this.container.querySelector('#demo-interval').textContent = this.parameters.interval;
    this.container.querySelector('#demo-mode').textContent = this.getModeText(this.parameters.mode);
    this.container.querySelector('#demo-shape').textContent = this.getShapeText(this.parameters.shape);
  }
  
  updateDemo() {
    // 清除现有树木
    this.clearTrees();
    
    // 更新地面图形
    this.updateGroundShape();
    
    // 生成正确的树木位置
    const correctPositions = this.calculateCorrectTreePositions();
    
    // 创建树木元素
    correctPositions.forEach((pos, index) => {
      const tree = {
        id: `demo-tree-${++this.treeIdCounter}`,
        x: pos.x - 18,
        y: pos.y - 36,
        isPlaced: true
      };
      this.trees.push(tree);
      this.createTreeElement(tree);
    });
    
    this.updateTreeDisplay();
    
    // 更新解题步骤
    if (this.showSteps) {
      this.updateSolvingSteps();
    }
  }
  
  calculateCorrectTreePositions() {
    const { mode, shape } = this.parameters;
    let positions = [];
    
    switch (shape) {
      case 'line':
        positions = this.generateLinePoints(mode);
        break;
      case 'circle':
        positions = this.generateCirclePoints(mode);
        break;
      case 'triangle':
        positions = this.generateTrianglePoints(mode);
        break;
      case 'square':
        positions = this.generateSquarePoints(mode);
        break;
      default:
        positions = this.generateLinePoints(mode);
    }
    
    return positions;
  }
  
  updateGroundShape() {
    const centerX = this.demoArea.clientWidth / 2;
    const centerY = 150;
    const maxPixelLength = this.demoArea.clientWidth - 100;
    const pixelLength = Math.min(maxPixelLength, this.parameters.length * 4);
    // 使用可用高度限制，放大形状，减少树重叠
    const verticalLimit = (this.demoArea.clientHeight - 40) / 2;
    const size = Math.min(pixelLength / 2, verticalLimit) * 0.9;
    this.groundConfig.shapeSize = size; // 统一供点生成使用
    
    // 清除现有图形
    const existingShapes = this.groundSvg.querySelectorAll('.ground-shape');
    existingShapes.forEach(shape => shape.remove());
    
    this.groundConfig = {
      length: this.parameters.length,
      interval: this.parameters.interval,
      startX: centerX - pixelLength / 2,
      endX: centerX + pixelLength / 2,
      startY: centerY,
      shape: this.parameters.shape
    };
    
    switch (this.parameters.shape) {
      case 'line':
        this.groundLine.setAttribute('x1', this.groundConfig.startX);
        this.groundLine.setAttribute('x2', this.groundConfig.endX);
        this.groundLine.setAttribute('y1', centerY);
        this.groundLine.setAttribute('y2', centerY);
        this.groundLine.style.display = 'block';
        break;
        
      case 'circle':
        this.groundLine.style.display = 'none';
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', size);
        circle.setAttribute('stroke', '#2563eb');
        circle.setAttribute('stroke-width', '6');
        circle.setAttribute('stroke-dasharray', '8,4');
        circle.setAttribute('fill', 'none');
        circle.classList.add('ground-shape');
        this.groundSvg.appendChild(circle);
        break;
        
      case 'triangle':
        this.groundLine.style.display = 'none';
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
        this.groundSvg.appendChild(triangle);
        break;
        
      case 'square':
        this.groundLine.style.display = 'none';
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
        this.groundSvg.appendChild(square);
        break;
    }
  }
  
  generateLinePoints(mode) {
    const pixelInterval = (this.groundConfig.endX - this.groundConfig.startX) * this.parameters.interval / this.parameters.length;
    const numIntervals = Math.floor(this.parameters.length / this.parameters.interval);
    const scale = (this.groundConfig.endX - this.groundConfig.startX) / this.parameters.length; // 像素/米
    let points = [];

    if (mode === 'circle') {
      // 环形模式：按像素间距均匀分布在圆周上
      const centerX = (this.groundConfig.startX + this.groundConfig.endX) / 2;
      const centerY = this.groundConfig.startY;
      const radius = Math.min((this.groundConfig.endX - this.groundConfig.startX) / 2, 100) * 0.8;
      const circumference = 2 * Math.PI * radius;
      const pxInterval = Math.max(1, this.parameters.interval * scale);
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
        const x = this.groundConfig.startX + i * pixelInterval;
        const y = this.groundConfig.startY;

        if (mode === 'both' ||
           (mode === 'none' && i > 0 && i < numIntervals) ||
           (mode === 'one' && i < numIntervals)) {
          points.push({ x, y });
        }
      }
    }

    return points;
  }
  
  generateCirclePoints(mode) {
    const centerX = (this.groundConfig.startX + this.groundConfig.endX) / 2;
    const centerY = this.groundConfig.startY;
    const radius = this.groundConfig.shapeSize ?? Math.min((this.groundConfig.endX - this.groundConfig.startX) / 2, 100) * 0.8; // 与地面图形一致
    // 按数学关系计算：棵数 = 周长 ÷ 间距
    const numPoints = Math.max(3, Math.floor(this.parameters.length / this.parameters.interval));

    let points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  }
  
  generateTrianglePoints(mode) {
    // 闭合三角形：树数 = ⌊(3×length)/interval⌋，按像素周长等距分布
    const centerX = (this.groundConfig.startX + this.groundConfig.endX) / 2;
    const centerY = this.groundConfig.startY;
    const size = this.groundConfig.shapeSize ?? Math.min((this.groundConfig.endX - this.groundConfig.startX) / 2, 100) * 0.8;

    const vertices = [
      { x: centerX, y: centerY - size * 0.8 },
      { x: centerX - size * 0.8, y: centerY + size * 0.4 },
      { x: centerX + size * 0.8, y: centerY + size * 0.4 }
    ];

    const edges = [
      { start: vertices[0], end: vertices[1] },
      { start: vertices[1], end: vertices[2] },
      { start: vertices[2], end: vertices[0] }
    ];
    const edgeLens = edges.map(e => Math.hypot(e.end.x - e.start.x, e.end.y - e.start.y));
    const totalPx = edgeLens.reduce((a, b) => a + b, 0);

    // 按数学关系计算：棵数 = 周长 ÷ 间距 = 3×length ÷ interval
    const treeCount = Math.max(3, Math.floor((this.parameters.length * 3) / this.parameters.interval));
    if (treeCount <= 0 || totalPx <= 0) return [];

    const stepPx = totalPx / treeCount;
    let points = [];

    for (let i = 0; i < treeCount; i++) {
      let rem = i * stepPx;
      let edgeIndex = 0;
      while (edgeIndex < edges.length - 1 && rem >= edgeLens[edgeIndex]) {
        rem -= edgeLens[edgeIndex];
        edgeIndex++;
      }
      const e = edges[edgeIndex % edges.length];
      const len = edgeLens[edgeIndex % edges.length];
      const t = len === 0 ? 0 : rem / len;
      points.push({ x: e.start.x + (e.end.x - e.start.x) * t, y: e.start.y + (e.end.y - e.start.y) * t });
    }

    return points;
  }
  
  generateSquarePoints(mode) {
    // 闭合正方形：树数 = ⌊(4×length)/interval⌋，沿像素周长等距分布
    const centerX = (this.groundConfig.startX + this.groundConfig.endX) / 2;
    const centerY = this.groundConfig.startY;
    const size = this.groundConfig.shapeSize ?? Math.min((this.groundConfig.endX - this.groundConfig.startX) / 2, 100) * 0.8;

    const vertices = [
      { x: centerX - size, y: centerY - size },
      { x: centerX + size, y: centerY - size },
      { x: centerX + size, y: centerY + size },
      { x: centerX - size, y: centerY + size }
    ];

    const edges = [
      { start: vertices[0], end: vertices[1] },
      { start: vertices[1], end: vertices[2] },
      { start: vertices[2], end: vertices[3] },
      { start: vertices[3], end: vertices[0] },
    ];
    const edgeLens = edges.map(e => Math.hypot(e.end.x - e.start.x, e.end.y - e.start.y));
    const totalPx = edgeLens.reduce((a, b) => a + b, 0);

    // 按数学关系计算：棵数 = 周长 ÷ 间距 = 4×length ÷ interval
    const treeCount = Math.max(4, Math.floor((this.parameters.length * 4) / this.parameters.interval));
    if (treeCount <= 0 || totalPx <= 0) return [];

    const stepPx = totalPx / treeCount;
    let points = [];

    for (let i = 0; i < treeCount; i++) {
      let rem = i * stepPx;
      let edgeIndex = 0;
      while (edgeIndex < edges.length - 1 && rem >= edgeLens[edgeIndex]) {
        rem -= edgeLens[edgeIndex];
        edgeIndex++;
      }
      const e = edges[edgeIndex % edges.length];
      const len = edgeLens[edgeIndex % edges.length];
      const t = len === 0 ? 0 : rem / len;
      points.push({ x: e.start.x + (e.end.x - e.start.x) * t, y: e.start.y + (e.end.y - e.start.y) * t });
    }

    return points;
  }
  
  createTreeElement(tree) {
    const treeEl = document.createElement('div');
    treeEl.className = 'demo-tree';
    treeEl.id = tree.id;
    treeEl.innerHTML = '🌳';
    const treeSize = this.isMobile ? '28px' : '32px';
    
    treeEl.style.cssText = `
      position: absolute;
      left: ${tree.x}px;
      top: ${tree.y}px;
      font-size: ${treeSize};
      user-select: none;
      z-index: 10;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
      pointer-events: none;
      animation: treeAppear 0.4s ease-out;
    `;
    
    this.demoArea.appendChild(treeEl);
  }
  
  clearTrees() {
    this.trees = [];
    const existingTrees = this.demoArea.querySelectorAll('.demo-tree');
    existingTrees.forEach(tree => tree.remove());
  }
  
  updateTreeDisplay() {
    this.treeCountDisplay.textContent = this.trees.length;
  }
  
  updateSolvingSteps() {
    const stepsContainer = this.container.querySelector('#demo-solving-steps');
    if (!stepsContainer) return;
    
    const steps = this.generateSolvingSteps();
    stepsContainer.innerHTML = steps.map((step, index) => 
      `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid var(--accent);">
        <strong>步骤 ${index + 1}:</strong> ${step}
      </div>`
    ).join('');
  }
  
  generateSolvingSteps() {
    const { length, interval, mode, shape } = this.parameters;
    let steps = [];
    
    if (shape === 'line') {
      const intervalCount = Math.floor(length / interval);
      steps.push(`道路长度 ÷ 间距 = 间隔数：${length} ÷ ${interval} = ${intervalCount}个间隔`);

      if (mode === 'both') {
        const oneSide = intervalCount + 1;
        steps.push(`两端都种：一边树的棵数 = 间隔数 + 1 = ${intervalCount} + 1 = ${oneSide}棵`);
        steps.push(`道路两边：总棵数 = ${oneSide} × 2 = ${oneSide * 2}棵`);
      } else if (mode === 'none') {
        const oneSide = intervalCount - 1;
        steps.push(`两端都不种：一边树的棵数 = 间隔数 - 1 = ${intervalCount} - 1 = ${oneSide}棵`);
        steps.push(`道路两边：总棵数 = ${oneSide} × 2 = ${oneSide * 2}棵`);
      } else if (mode === 'one') {
        steps.push(`一端种一端不种：一边树的棵数 = 间隔数 = ${intervalCount}棵`);
        steps.push(`道路两边：总棵数 = ${intervalCount} × 2 = ${intervalCount * 2}棵`);
      } else if (mode === 'circle') {
        steps.push(`环形种植：树的棵数 = 间隔数 = ${intervalCount}棵`);
      }
    } else if (shape === 'circle') {
      const treeCount = Math.floor(length / interval);
      steps.push(`圆形为闭合图形：树的棵数 = 周长 ÷ 间距 = ${length} ÷ ${interval} = ${treeCount}棵`);
    } else if (shape === 'triangle') {
      const treeCount = Math.floor((length * 3) / interval);
      steps.push(`三角形为闭合图形：树的棵数 = 周长 ÷ 间距 = ${length} × 3 ÷ ${interval} = ${treeCount}棵`);
    } else if (shape === 'square') {
      const treeCount = Math.floor((length * 4) / interval);
      steps.push(`正方形为闭合图形：树的棵数 = 周长 ÷ 间距 = ${length} × 4 ÷ ${interval} = ${treeCount}棵`);
    }
    
    return steps;
  }
  
  getModeText(mode) {
    const modeMap = {
      'both': '两端都种',
      'none': '两端都不种',
      'one': '一端种一端不种',
      'circle': '环形种植'
    };
    return modeMap[mode] || mode;
  }
  
  getShapeText(shape) {
    const shapeMap = {
      'line': '直线',
      'circle': '圆形',
      'triangle': '三角形',
      'square': '正方形'
    };
    return shapeMap[shape] || shape;
  }
}

// CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes treeAppear {
    0% {
      transform: scale(0) rotate(180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(90deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);