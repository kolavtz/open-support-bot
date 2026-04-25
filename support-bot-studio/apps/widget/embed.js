(() => {
  const script = document.currentScript;
  const botId = script?.dataset?.botId || "default-bot";
  const apiBase = script?.dataset?.apiBase || "http://localhost:8787";
  const provider = script?.dataset?.provider || "openai";
  const model = script?.dataset?.model || "";
  const title = script?.dataset?.title || "Support Assistant";
  const color = script?.dataset?.color || "#01696f";
  const avatarUrl = script?.dataset?.avatar || "assets/avatar.png";

  const state = {
    open: false,
    messages: [],
    loading: false
  };

  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    :root {
      --sb-primary: ${color};
      --sb-primary-dark: color-mix(in srgb, ${color}, black 20%);
      --sb-bg: #ffffff;
      --sb-text: #1a1a1a;
      --sb-text-muted: #666666;
      --sb-radius: 16px;
      --sb-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      --sb-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #sb-root {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 2147483647;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    #sb-launcher {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--sb-primary);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--sb-transition);
      color: white;
    }

    #sb-launcher:hover {
      transform: scale(1.05);
      background: var(--sb-primary-dark);
    }

    #sb-launcher svg {
      width: 28px;
      height: 28px;
    }

    #sb-panel {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      max-width: calc(100vw - 48px);
      background: var(--sb-bg);
      border-radius: var(--sb-radius);
      box-shadow: var(--sb-shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: var(--sb-transition);
      border: 1px solid rgba(0,0,0,0.05);
    }

    #sb-panel.sb-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    #sb-header {
      padding: 20px;
      background: var(--sb-primary);
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sb-header-info {
      flex: 1;
    }

    .sb-header-title {
      font-weight: 700;
      font-size: 16px;
      margin: 0;
    }

    .sb-header-status {
      font-size: 12px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sb-header-status::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
    }

    #sb-close {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--sb-transition);
    }

    #sb-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    #sb-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sb-message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
    }

    .sb-message-bot {
      align-self: flex-start;
      background: white;
      color: var(--sb-text);
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .sb-message-user {
      align-self: flex-end;
      background: var(--sb-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .sb-typing {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
      background: white;
      width: fit-content;
      border-radius: 12px;
      align-self: flex-start;
    }

    .sb-dot {
      width: 6px;
      height: 6px;
      background: #cbd5e1;
      border-radius: 50%;
      animation: sb-bounce 1.4s infinite ease-in-out both;
    }

    .sb-dot:nth-child(1) { animation-delay: -0.32s; }
    .sb-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes sb-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    #sb-input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    #sb-input {
      flex: 1;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      outline: none;
      transition: var(--sb-transition);
    }

    #sb-input:focus {
      border-color: var(--sb-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--sb-primary), transparent 85%);
    }

    #sb-send {
      background: var(--sb-primary);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--sb-transition);
    }

    #sb-send:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    #sb-send svg {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      #sb-panel {
        width: calc(100vw - 32px);
        height: calc(100vh - 120px);
        right: -8px;
        bottom: 80px;
      }
    }
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "sb-root";
  root.innerHTML = `
    <button id="sb-launcher" aria-label="Open support chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
    <div id="sb-panel">
      <div id="sb-header">
        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: white; border: 2px solid rgba(255,255,255,0.2);">
          <img src="${apiBase}/${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=AI&background=fff&color=${color.replace('#','')}'">
        </div>
        <div class="sb-header-info">
          <h3 class="sb-header-title">${title}</h3>
          <span class="sb-header-status">Online</span>
        </div>
        <button id="sb-close" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div id="sb-messages"></div>
      <div id="sb-input-area">
        <input id="sb-input" placeholder="Type a message..." autocomplete="off">
        <button id="sb-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const launcher = root.querySelector("#sb-launcher");
  const panel = root.querySelector("#sb-panel");
  const closeBtn = root.querySelector("#sb-close");
  const sendBtn = root.querySelector("#sb-send");
  const input = root.querySelector("#sb-input");
  const messagesEl = root.querySelector("#sb-messages");

  function toggle(open) {
    state.open = typeof open === "boolean" ? open : !state.open;
    panel.classList.toggle("sb-open", state.open);
    if (state.open) {
      input.focus();
    }
  }

  function appendMessage(role, text) {
    const div = document.createElement("div");
    div.className = `sb-message sb-message-${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.id = "sb-typing-indicator";
    div.className = "sb-typing";
    div.innerHTML = '<div class="sb-dot"></div><div class="sb-dot"></div><div class="sb-dot"></div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const indicator = root.querySelector("#sb-typing-indicator");
    if (indicator) indicator.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || state.loading) return;

    state.loading = true;
    appendMessage("user", text);
    state.messages.push({ role: "user", content: text });
    input.value = "";
    
    showTyping();

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId,
          provider,
          model,
          messages: state.messages,
          siteContext: document.title
        })
      });

      const data = await res.json();
      hideTyping();

      if (data.ok) {
        const reply = data.message;
        appendMessage("bot", reply);
        state.messages.push({ role: "assistant", content: reply });
      } else {
        appendMessage("bot", "I'm sorry, I encountered an error. Please try again later.");
      }
    } catch (err) {
      hideTyping();
      appendMessage("bot", "Connection error. Please check if the backend is running.");
      console.error(err);
    } finally {
      state.loading = false;
    }
  }

  launcher.addEventListener("click", () => toggle());
  closeBtn.addEventListener("click", () => toggle(false));
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Initial greeting
  setTimeout(() => {
    appendMessage("bot", "Hello! How can I help you today?");
  }, 500);

})();
