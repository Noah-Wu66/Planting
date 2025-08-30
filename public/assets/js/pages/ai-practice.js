import { chatWithAI } from '../shared/api.js';
import { TreeDemo } from '../components/tree-demo.js';

export function AIPractice(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="hero">
      <div class="mobile-cta" role="navigation" aria-label="快速入口（移动端）">
        <a class="btn" href="#/ai-learning">🤖 AI学习</a>
        <a class="btn primary" href="#/ai-practice">🏆 AI练习</a>
      </div>
      <h1>🏆 AI智能练习系统</h1>
      <p>通过系统化练习深化对植树问题的理解，AI助手将为你提供个性化指导。</p>
    </div>
    <div class="card" style="margin-top:20px;">
      <h2>📝 练习控制</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
        <div style="text-align: center;"><h3 id="practice-title">准备开始练习</h3><p id="practice-status" style="color: var(--muted); margin: 8px 0;">点击下方按钮开始第一题</p></div>
        <div style="text-align: center;"><div id="progress-display" style="margin-bottom: 12px;"><div style="font-size: 24px; font-weight: bold; color: var(--accent);" id="progress-text">0/5</div><div style="font-size: 12px; color: var(--muted);">练习进度</div></div></div>
      </div>
      <div style="text-align: center; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn primary" id="start-practice">🚀 开始练习</button>
        <button class="btn" id="show-demo" disabled>👁️ 看演示</button>
        <button class="btn" id="next-question" disabled>➡️ 下一题</button>
        <button class="btn" id="restart-practice" style="display: none;">🔄 重新开始</button>
      </div>
    </div>
    <div class="card" id="question-card" style="margin-top:20px; display: none;">
      <h2>📋 题目内容</h2>
      <div id="question-content" style="padding: 20px; background: #f8fafc; border-radius: 12px; margin-bottom: 16px;"><p id="question-text" style="font-size: 18px; line-height: 1.6; margin-bottom: 16px;">题目内容将在这里显示...</p></div>
      <div id="answer-section">
        <div style="margin-bottom: 16px;"><label for="answer-input" style="display: block; margin-bottom: 8px; font-weight: 600;">你的答案：</label><div style="display: flex; gap: 8px;"><input id="answer-input" type="number" placeholder="请输入答案..." style="flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 16px;"><button id="submit-answer" class="btn primary">提交答案</button></div></div>
        <div id="answer-feedback" style="display: none; padding: 16px; border-radius: 12px; margin-top: 16px;"></div>
      </div>
    </div>
    <div class="card" id="ai-chat-card" style="margin-top:20px; display: none;">
      <h2>💬 AI学习助手</h2>
      <div id="practice-chat-history" style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc;">
        <div style="text-align: center; color: var(--muted); padding: 20px;"><div style="font-size: 32px; margin-bottom: 8px;">🤖</div><p>我是你的练习助手！有任何疑问都可以问我。</p></div>
      </div>
      <div style="display: flex; gap: 8px; margin-bottom: 16px;"><input id="practice-chat-input" type="text" placeholder="向AI助手提问..." style="flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 14px;"><button id="practice-send-message" class="btn primary">发送</button></div>
    </div>
    <div class="card" id="evaluation-card" style="margin-top:20px; display: none;"><h2>📊 学习评估报告</h2><div id="evaluation-content"></div></div>
    <div id="demo-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; backdrop-filter: blur(4px);">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 95%; max-width: 900px; max-height: 95%; background: var(--card); border-radius: 16px; padding: 24px; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;"><h3>🌳 题目可视化演示</h3><button id="close-demo" class="btn" style="padding: 8px 12px;">✕ 关闭</button></div>
        <div id="demo-content"></div>
      </div>
    </div>
  `;

  setTimeout(() => { initPracticeFeature(el); }, 0);
  return el;
}

function initPracticeFeature(container) {
  let currentQuestion = 0;
  let totalQuestions = 5;
  let answers = [];
  let startTime = null;
  let currentQuestionData = null;
  let lastSignature = null;

  const startButton = container.querySelector('#start-practice');
  const showDemoButton = container.querySelector('#show-demo');
  const nextButton = container.querySelector('#next-question');
  const restartButton = container.querySelector('#restart-practice');
  const submitButton = container.querySelector('#submit-answer');
  const questionCard = container.querySelector('#question-card');
  const aiChatCard = container.querySelector('#ai-chat-card');
  const evaluationCard = container.querySelector('#evaluation-card');
  const demoModal = container.querySelector('#demo-modal');
  const practiceTitle = container.querySelector('#practice-title');
  const practiceStatus = container.querySelector('#practice-status');
  const progressText = container.querySelector('#progress-text');
  const questionText = container.querySelector('#question-text');
  const answerInput = container.querySelector('#answer-input');
  const answerFeedback = container.querySelector('#answer-feedback');

  async function startPractice() {
    currentQuestion = 1; answers = []; startTime = Date.now();
    startButton.style.display = 'none'; restartButton.style.display = 'none';
    questionCard.style.display = 'block'; aiChatCard.style.display = 'block'; evaluationCard.style.display = 'none';
    await generateQuestion(1);
  }
  async function generateQuestion(questionNumber) {
    try {
      practiceTitle.textContent = `第 ${questionNumber} 题`;
      practiceStatus.textContent = '题目生成中...';
      progressText.textContent = `${questionNumber}/${totalQuestions}`;
      const questionData = await mockGenerateQuestion(questionNumber);
      currentQuestionData = questionData; displayQuestion(questionData);
    } catch (e) { console.error('生成题目失败:', e); practiceStatus.textContent = '题目生成失败，请重试'; }
  }
  async function mockGenerateQuestion(questionNumber) {
    await new Promise(r => setTimeout(r, 1000));
    const shapes = ['line','circle']; const lineModes = ['both','none','one']; const intervals = [5,6,8,10,12,15];
    let shape, mode; for (let attempt = 0; attempt < 10; attempt++) { shape = shapes[Math.floor(Math.random()*shapes.length)]; mode = shape === 'line' ? lineModes[Math.floor(Math.random()*lineModes.length)] : 'circle'; const sig = `${shape}-${mode}`; if (sig !== lastSignature) break; }
    let interval = intervals[Math.floor(Math.random()*intervals.length)]; let length = interval * (6 + Math.floor(Math.random()*16));
    for (let i=0; i<20; i++){ interval = intervals[Math.floor(Math.random()*intervals.length)]; const kMin = (shape==='line' && mode==='none') ? 2 : 6; const k = kMin + Math.floor(Math.random()*16); const candidate = interval * k; if (candidate >= 60 && candidate <= 200) { length = candidate; break; } }
    function buildQuestionText(s,m,len,itv){ if (s==='circle') return `在一个周长为${len}米的圆形花坛边缘，每隔${itv}米种一棵树。请问需要多少棵树？`; if (m==='both') return `在一条长为${len}米的道路两旁，每隔${itv}米种一棵树，两端都要种树。请问一共需要多少棵树？`; if (m==='none') return `在一条长为${len}米的道路两旁，每隔${itv}米种一棵树，两端都不种树。请问一共需要多少棵树？`; return `在一条长为${len}米的道路两旁，每隔${itv}米种一棵树，一端种一端不种。请问一共需要多少棵树？`; }
    const n = Math.floor(length / interval); const expectedAnswer = (shape==='circle') ? n : (mode==='both' ? (n+1)*2 : (mode==='none' ? (n-1)*2 : n*2));
    const data = { id:`q${questionNumber}_${Date.now()}`, question_text:buildQuestionText(shape,mode,length,interval), parameters:{ length, interval, mode, shape }, expected_answer: expectedAnswer, difficulty: questionNumber <= 2 ? 'basic' : 'medium' };
    lastSignature = `${shape}-${mode}`; return data;
  }
  function displayQuestion(q) {
    questionText.textContent = q.question_text; practiceStatus.textContent = '请仔细阅读题目并作答';
    answerInput.value = ''; answerFeedback.style.display = 'none'; submitButton.disabled = false; showDemoButton.disabled = false;
    if (container.clearChatHistory) container.clearChatHistory(); nextButton.disabled = true; answerInput.focus();
  }
  async function submitAnswer() {
    const userAnswer = parseInt(answerInput.value); if (isNaN(userAnswer)) { alert('请输入有效的数字答案'); return; }
    try { submitButton.disabled = true; practiceStatus.textContent = 'AI正在检查答案...'; const result = await mockCheckAnswer(currentQuestionData, userAnswer); displayAnswerFeedback(result); answers.push({ question_number: currentQuestion, user_answer: userAnswer, correct_answer: result.correct_answer, is_correct: result.is_correct, time_spent: Math.floor((Date.now() - startTime) / 1000) }); nextButton.disabled = false; } catch (e) { console.error('答案检查失败:', e); practiceStatus.textContent = '答案检查失败，请重试'; submitButton.disabled = false; }
  }
  async function mockCheckAnswer(q, userAnswer) {
    await new Promise(r => setTimeout(r, 1500)); const isCorrect = userAnswer === q.expected_answer; return { is_correct: isCorrect, correct_answer: q.expected_answer, explanation: isCorrect ? `正确！你的答案 ${userAnswer} 是对的。很棒的计算能力！` : `答案不正确。正确答案是 ${q.expected_answer}。让我们一起分析一下解题步骤吧！` };
  }
  function displayAnswerFeedback(r) { answerFeedback.innerHTML = `<div style="font-size: 18px; font-weight: bold; color: ${r.is_correct ? 'var(--success)' : 'var(--danger)'}; margin-bottom: 8px;">${r.is_correct ? '✅ 回答正确！' : '❌ 回答错误'}</div><p>${r.explanation}</p>`; answerFeedback.style.display = 'block'; practiceStatus.textContent = r.is_correct ? '回答正确！可以进入下一题' : '回答错误，请仔细看解题步骤'; }
  async function nextQuestion() { if (currentQuestion < totalQuestions) { currentQuestion++; nextButton.disabled = true; await generateQuestion(currentQuestion); } else { await showFinalEvaluation(); } }
  async function showFinalEvaluation() {
    questionCard.style.display = 'none'; evaluationCard.style.display = 'block'; restartButton.style.display = 'inline-block';
    practiceTitle.textContent = '练习完成！'; practiceStatus.textContent = '学习评估已生成';
    const correctCount = answers.filter(a => a.is_correct).length; const evaluationContent = container.querySelector('#evaluation-content');
    evaluationContent.innerHTML = `<div style="text-align: center; padding: 20px; background: #f0f9ff; border-radius: 12px;"><div style="font-size: 24px; font-weight: bold; color: var(--accent);">${correctCount}/${totalQuestions}</div><div style="margin: 8px 0;">答题正确率</div><p style="margin-top: 16px;">${correctCount >= 4 ? '表现优秀！' : '还有提升空间，继续努力！'}</p></div>`;
  }
  function showDemo() {
    if (!currentQuestionData) return; const demoContent = container.querySelector('#demo-content');
    demoContent.innerHTML = `<div class="demo-visualization"><div style="margin-bottom: 16px; padding: 12px; background: #f0f9ff; border-radius: 8px;"><h4 style="margin: 0 0 8px 0; color: var(--accent);">📋 题目参数</h4><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-size: 14px;"><div><strong>长度:</strong> ${currentQuestionData.parameters.length}米</div><div><strong>间距:</strong> ${currentQuestionData.parameters.interval}米</div><div><strong>模式:</strong> ${getModeText(currentQuestionData.parameters.mode)}</div><div><strong>图形:</strong> ${getShapeText(currentQuestionData.parameters.shape)}</div></div></div><div id="demo-tree-container"></div><div style="margin-top: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px; text-align: center;"><div style="font-size: 18px; font-weight: bold; color: var(--success); margin-bottom: 4px;">✅ 正确答案: ${currentQuestionData.expected_answer} 棵树</div><div style="font-size: 14px; color: var(--muted);">通过上面的演示可以看到正确的种植布局</div></div></div>`;
    const demoTreeContainer = demoContent.querySelector('#demo-tree-container'); new TreeDemo({ container: demoTreeContainer, parameters: currentQuestionData.parameters, readOnly: true, showSteps: true }); demoModal.style.display = 'block';
  }
  function getModeText(mode) { return ({ both: '两端都种', none: '两端都不种', one: '一端种一端不种', circle: '环形种植' })[mode] || mode; }
  function getShapeText(shape) { return ({ line: '直线', circle: '圆形' })[shape] || shape; }
  function restartPractice() { currentQuestion = 0; answers = []; startTime = null; currentQuestionData = null; lastSignature = null; practiceTitle.textContent = '准备开始练习'; practiceStatus.textContent = '点击下方按钮开始第一题'; progressText.textContent = '0/5'; startButton.style.display = 'inline-block'; restartButton.style.display = 'none'; questionCard.style.display = 'none'; aiChatCard.style.display = 'none'; evaluationCard.style.display = 'none'; }
  startButton.addEventListener('click', startPractice);
  showDemoButton.addEventListener('click', showDemo);
  nextButton.addEventListener('click', nextQuestion);
  restartButton.addEventListener('click', restartPractice);
  submitButton.addEventListener('click', submitAnswer);
  container.querySelector('#close-demo').addEventListener('click', () => { demoModal.style.display = 'none'; });
  answerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !submitButton.disabled) { submitAnswer(); } });
  demoModal.addEventListener('click', (e) => { if (e.target === demoModal) { demoModal.style.display = 'none'; } });
  initSmartChatFeature(container, () => currentQuestionData);
}

function initSmartChatFeature(container, getCurrentQuestion) {
  const chatInput = container.querySelector('#practice-chat-input');
  const sendButton = container.querySelector('#practice-send-message');
  const chatHistory = container.querySelector('#practice-chat-history');
  let conversationHistory = [];
  let isLoading = false;
  function addMessage(role, content) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `margin-bottom:12px;padding:12px 16px;border-radius:12px;max-width:85%;line-height:1.5;${role==='user'?'background: var(--accent); color: white; margin-left: auto; text-align: right;':'background:#f1f5f9;color:var(--text);margin-right:auto;'}`;
    if (role === 'assistant') { const avatar = document.createElement('span'); avatar.textContent = '🤖 '; messageEl.appendChild(avatar); }
    const textEl = document.createElement('span'); textEl.innerHTML = formatMarkdown(content); messageEl.appendChild(textEl);
    const firstEl = chatHistory.firstElementChild; if (chatHistory.children.length === 1 && firstEl && firstEl.style && firstEl.style.textAlign === 'center') { chatHistory.innerHTML = ''; }
    chatHistory.appendChild(messageEl); chatHistory.scrollTop = chatHistory.scrollHeight;
  }
  function formatMarkdown(text) { return text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>').replace(/`(.*?)`/g,'<code>$1</code>'); }
  function showLoadingIndicator() { const loadingEl = document.createElement('div'); loadingEl.id='ai-loading'; loadingEl.style.cssText = 'margin-bottom:12px;padding:12px 16px;border-radius:12px;max-width:85%;background:#f1f5f9;color:var(--muted);margin-right:auto;display:flex;align-items:center;gap:8px;'; loadingEl.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid var(--accent); border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div><span>🤖 AI正在思考中...</span>'; chatHistory.appendChild(loadingEl); chatHistory.scrollTop = chatHistory.scrollHeight; }
  function removeLoadingIndicator() { const loadingEl = chatHistory.querySelector('#ai-loading'); if (loadingEl) loadingEl.remove(); }
  async function sendMessage() {
    if (isLoading) return; const message = chatInput.value.trim(); if (!message) return; addMessage('user', message); chatInput.value = ''; isLoading = true; sendButton.disabled = true; showLoadingIndicator();
    try {
      const q = getCurrentQuestion();
      const interactionState = { ground: { length: q?.parameters?.length || 100, interval: q?.parameters?.interval || 10 }, tree_mode: q?.parameters?.mode || 'both', shape_mode: q?.parameters?.shape || 'line' };
      const requestData = { message, interaction_state: interactionState, chat_history: conversationHistory, is_new_conversation: conversationHistory.length === 0 };
      const response = await fetch('/api/practice/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestData) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      removeLoadingIndicator(); addMessage('assistant', data.response); conversationHistory = data.updated_history || [];
    } catch (e) { console.error('AI对话失败:', e); removeLoadingIndicator(); addMessage('assistant', '抱歉，我现在无法回答。请稍后再试或点击"看演示"查看解题过程。'); }
    finally { isLoading = false; sendButton.disabled = false; }
  }
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !isLoading) { e.preventDefault(); sendMessage(); } });
  function clearChatHistory() { conversationHistory = []; chatHistory.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 20px;"><div style="font-size: 32px; margin-bottom: 8px;">🤖</div><p>我是你的练习助手！有任何疑问都可以问我。</p></div>'; }
  container.clearChatHistory = clearChatHistory;
}


