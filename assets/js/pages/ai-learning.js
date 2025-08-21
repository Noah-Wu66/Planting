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
      <p>通过拖拽树木到地面上，与AI助手互动学习植树问题的奥秘。</p>
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
      </div>
      <div style="text-align: center;">
        <button class="btn" id="clear-all">🗑️ 清空重置</button>
        <button class="btn primary" id="update-ground">🔄 更新地面</button>
      </div>
    </div>

    <!-- 拖拽交互区域 -->
    <div class="card" style="margin-top:20px;">
      <h2>🌳 拖拽种树区域</h2>
      <div id="drag-area" style="position: relative; width: 100%; height: 300px; border: 2px dashed var(--accent); border-radius: 12px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); overflow: hidden;">
        <!-- 地面线段 -->
        <svg id="ground-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          <line id="ground-line" x1="50" y1="150" x2="550" y2="150" stroke="#2563eb" stroke-width="4" stroke-dasharray="5,5"/>
          <g id="snap-points"></g>
          <g id="measurements"></g>
        </svg>

        <!-- 树木工具栏 -->
        <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 8px; background: rgba(255,255,255,0.9); padding: 8px; border-radius: 8px;">
          <button class="btn small" id="add-tree">🌳 添加树木</button>
          <span style="font-size: 12px; color: var(--muted); align-self: center;">拖拽树木到线段上</span>
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
          <p>你好！我是你的植树问题学习助手。<br>请先在上方拖拽一些树木，然后向我提问吧！</p>
        </div>
      </div>

      <!-- 输入区域 -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <input id="chat-input" type="text" placeholder="请输入你的问题..." style="flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 14px;">
        <button id="send-message" class="btn primary" disabled>发送</button>
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
    initDragInteraction(el);
  }, 0);

  return el;
}

// 拖拽交互逻辑
function initDragInteraction(container) {
  const dragArea = container.querySelector('#drag-area');
  const groundSvg = container.querySelector('#ground-svg');
  const groundLine = container.querySelector('#ground-line');
  const snapPoints = container.querySelector('#snap-points');
  const measurements = container.querySelector('#measurements');
  const treeCountDisplay = container.querySelector('#tree-count');

  // 状态管理
  let trees = [];
  let groundConfig = {
    length: 100,
    interval: 10,
    startX: 50,
    startY: 150,
    endX: 550
  };
  let treeIdCounter = 0;

  // 更新地面显示
  function updateGround() {
    const length = parseFloat(container.querySelector('#ground-length').value);
    const interval = parseFloat(container.querySelector('#tree-interval').value);

    groundConfig.length = length;
    groundConfig.interval = interval;

    // 计算地面在SVG中的像素长度（比例缩放）
    const maxPixelLength = dragArea.clientWidth - 100; // 留边距
    const pixelLength = Math.min(maxPixelLength, length * 4); // 4像素/米的比例

    groundConfig.endX = groundConfig.startX + pixelLength;

    // 更新地面线段
    groundLine.setAttribute('x1', groundConfig.startX);
    groundLine.setAttribute('x2', groundConfig.endX);

    // 生成吸附点
    updateSnapPoints();
    updateMeasurements();
  }

  // 更新吸附点
  function updateSnapPoints() {
    snapPoints.innerHTML = '';

    const mode = container.querySelector('#tree-mode').value;
    const pixelInterval = (groundConfig.endX - groundConfig.startX) * groundConfig.interval / groundConfig.length;

    let points = [];

    if (mode === 'circle') {
      // 环形模式：均匀分布在圆周上
      const centerX = (groundConfig.startX + groundConfig.endX) / 2;
      const centerY = groundConfig.startY;
      const radius = (groundConfig.endX - groundConfig.startX) / 2 * 0.8;
      const numPoints = Math.floor(groundConfig.length / groundConfig.interval);

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push({ x, y });
      }
    } else {
      // 直线模式
      const numIntervals = Math.floor(groundConfig.length / groundConfig.interval);

      for (let i = 0; i <= numIntervals; i++) {
        const x = groundConfig.startX + i * pixelInterval;
        const y = groundConfig.startY;

        // 根据模式决定是否包含端点
        if (mode === 'both' ||
            (mode === 'one' && i === 0) ||
            (mode === 'none' && i > 0 && i < numIntervals)) {
          points.push({ x, y });
        }
      }
    }

    // 绘制吸附点
    points.forEach((point, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#10b981');
      circle.setAttribute('stroke', '#065f46');
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('opacity', '0.7');
      circle.setAttribute('data-snap-index', index);
      snapPoints.appendChild(circle);
    });

    return points;
  }

  // 更新测量标注
  function updateMeasurements() {
    measurements.innerHTML = '';

    // 添加长度标注
    const lengthText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lengthText.setAttribute('x', (groundConfig.startX + groundConfig.endX) / 2);
    lengthText.setAttribute('y', groundConfig.startY + 25);
    lengthText.setAttribute('text-anchor', 'middle');
    lengthText.setAttribute('font-size', '12');
    lengthText.setAttribute('fill', '#374151');
    lengthText.textContent = `${groundConfig.length}米`;
    measurements.appendChild(lengthText);

    // 添加间距标注
    if (groundConfig.interval > 0) {
      const intervalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      intervalText.setAttribute('x', groundConfig.startX + 20);
      intervalText.setAttribute('y', groundConfig.startY - 10);
      intervalText.setAttribute('font-size', '10');
      intervalText.setAttribute('fill', '#6b7280');
      intervalText.textContent = `间距: ${groundConfig.interval}米`;
      measurements.appendChild(intervalText);
    }
  }

  // 初始化
  updateGround();

  // 事件监听器
  container.querySelector('#update-ground').addEventListener('click', updateGround);
  container.querySelector('#clear-all').addEventListener('click', () => {
    trees = [];
    updateTreeDisplay();
    // 重置参数
    container.querySelector('#ground-length').value = 100;
    container.querySelector('#tree-interval').value = 10;
    container.querySelector('#tree-mode').value = 'both';
    updateGround();
  });

  // 添加树木
  function addTree() {
    const tree = {
      id: `tree-${++treeIdCounter}`,
      x: 100 + Math.random() * 200,
      y: 50 + Math.random() * 50,
      isPlaced: false
    };
    trees.push(tree);
    createTreeElement(tree);
    updateTreeDisplay();
  }

  // 创建树木DOM元素
  function createTreeElement(tree) {
    const treeEl = document.createElement('div');
    treeEl.className = 'draggable-tree';
    treeEl.id = tree.id;
    treeEl.innerHTML = '🌳';
    treeEl.style.cssText = `
      position: absolute;
      left: ${tree.x}px;
      top: ${tree.y}px;
      font-size: 24px;
      cursor: grab;
      user-select: none;
      z-index: 10;
      transition: transform 0.2s ease;
      ${tree.isPlaced ? 'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));' : ''}
    `;

    // 拖拽事件
    let isDragging = false;
    let startX, startY, offsetX, offsetY;

    treeEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      treeEl.style.cursor = 'grabbing';
      treeEl.style.zIndex = '20';

      const rect = dragArea.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      offsetX = startX - tree.x;
      offsetY = startY - tree.y;

      e.preventDefault();
    });

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const rect = dragArea.getBoundingClientRect();
      const newX = e.clientX - rect.left - offsetX;
      const newY = e.clientY - rect.top - offsetY;

      // 边界检查
      const boundedX = Math.max(0, Math.min(dragArea.clientWidth - 30, newX));
      const boundedY = Math.max(0, Math.min(dragArea.clientHeight - 30, newY));

      tree.x = boundedX;
      tree.y = boundedY;
      treeEl.style.left = boundedX + 'px';
      treeEl.style.top = boundedY + 'px';

      // 检查吸附
      checkSnapping(tree, treeEl);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      treeEl.style.cursor = 'grab';
      treeEl.style.zIndex = '10';

      // 最终吸附检查
      const snapped = checkSnapping(tree, treeEl, true);
      if (snapped) {
        tree.isPlaced = true;
        treeEl.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
      } else {
        tree.isPlaced = false;
        treeEl.style.filter = '';
      }

      updateTreeDisplay();
      if (window.updateChatInputState) window.updateChatInputState();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 双击删除
    treeEl.addEventListener('dblclick', () => {
      const index = trees.findIndex(t => t.id === tree.id);
      if (index > -1) {
        trees.splice(index, 1);
        treeEl.remove();
        updateTreeDisplay();
        if (window.updateChatInputState) window.updateChatInputState();
      }
    });

    dragArea.appendChild(treeEl);
  }

  // 检查吸附
  function checkSnapping(tree, treeEl, finalSnap = false) {
    const snapPointElements = snapPoints.querySelectorAll('circle');
    const snapThreshold = finalSnap ? 30 : 20;

    let closestPoint = null;
    let minDistance = Infinity;

    snapPointElements.forEach(point => {
      const px = parseFloat(point.getAttribute('cx'));
      const py = parseFloat(point.getAttribute('cy'));
      const distance = Math.sqrt((tree.x - px) ** 2 + (tree.y - py) ** 2);

      if (distance < snapThreshold && distance < minDistance) {
        minDistance = distance;
        closestPoint = { x: px, y: py };
      }
    });

    if (closestPoint && finalSnap) {
      tree.x = closestPoint.x;
      tree.y = closestPoint.y;
      treeEl.style.left = closestPoint.x + 'px';
      treeEl.style.top = closestPoint.y + 'px';
      treeEl.style.transform = 'scale(1.1)';
      setTimeout(() => {
        treeEl.style.transform = 'scale(1)';
      }, 200);
      return true;
    } else if (closestPoint) {
      treeEl.style.transform = 'scale(1.05)';
    } else {
      treeEl.style.transform = 'scale(1)';
    }

    return false;
  }

  function updateTreeDisplay() {
    treeCountDisplay.textContent = trees.length;
    const placedTrees = trees.filter(t => t.isPlaced).length;
    if (placedTrees > 0) {
      treeCountDisplay.textContent += ` (${placedTrees} 已放置)`;
    }
  }

  // 添加树木按钮事件
  container.querySelector('#add-tree').addEventListener('click', addTree);

  // 初始化AI对话功能
  initChatFeature(container, () => ({
    trees: trees.filter(t => t.isPlaced).map(t => ({ x: t.x, y: t.y, id: t.id })),
    ground: groundConfig,
    tree_mode: container.querySelector('#tree-mode').value
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
    const hasPlacedTrees = getInteractionState().trees.length > 0;
    const hasInput = chatInput.value.trim().length > 0;
    sendButton.disabled = !hasPlacedTrees || !hasInput || isLoading;

    if (!hasPlacedTrees) {
      sendButton.title = '请先放置一些树木';
    } else if (!hasInput) {
      sendButton.title = '请输入问题';
    } else {
      sendButton.title = '';
    }
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
      ${role === 'user' ?
        'background: var(--accent); color: white; margin-left: auto; text-align: right;' :
        `background: ${isError ? '#fee2e2' : '#f1f5f9'}; color: ${isError ? '#dc2626' : 'var(--text)'}; margin-right: auto;`
      }
    `;

    if (role === 'assistant') {
      const avatar = document.createElement('div');
      avatar.style.cssText = 'display: inline-block; margin-right: 8px; font-size: 16px;';
      avatar.textContent = isError ? '⚠️' : '🤖';
      messageEl.appendChild(avatar);
    }

    const textEl = document.createElement('span');
    textEl.textContent = content;
    messageEl.appendChild(textEl);

    // 清空欢迎消息
    if (chatHistory.children.length === 1 && chatHistory.firstChild.style.textAlign === 'center') {
      chatHistory.innerHTML = '';
    }

    chatHistory.appendChild(messageEl);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  // 发送消息到AI
  async function sendMessage(isNewConversation = false) {
    const message = chatInput.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    updateChatInputState();

    // 添加用户消息
    addMessage('user', message);
    chatInput.value = '';

    // 显示加载状态
    loadingIndicator.style.display = 'block';

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
      chatControls.style.display = 'flex';

    } catch (error) {
      console.error('AI请求失败:', error);
      addMessage('assistant', '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。', true);
    } finally {
      isLoading = false;
      loadingIndicator.style.display = 'none';
      updateChatInputState();
    }
  }

  // 事件监听
  chatInput.addEventListener('input', updateChatInputState);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendButton.addEventListener('click', () => sendMessage());

  continueButton.addEventListener('click', () => {
    chatControls.style.display = 'none';
    chatInput.focus();
  });

  newQuestionButton.addEventListener('click', () => {
    conversationHistory = [];
    chatControls.style.display = 'none';
    chatHistory.innerHTML = `
      <div style="text-align: center; color: var(--muted); padding: 20px;">
        <div style="font-size: 32px; margin-bottom: 8px;">🤖</div>
        <p>对话已重置，请提出新的问题！</p>
      </div>
    `;
    chatInput.focus();
  });

  // 暴露更新函数给外部调用
  window.updateChatInputState = updateChatInputState;

  // 初始状态
  updateChatInputState();
}
