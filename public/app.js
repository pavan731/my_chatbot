// Dynamically load marked.js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => console.log('✅ Marked loaded');
document.head.appendChild(script);

function sendQuestion() {
  const questionInput = document.getElementById('question-input');
  const chatBox = document.getElementById('chat-box');
  const question = questionInput.value.trim();
  const prompt = "You are a DevOps assistant. Please answer the question accordingly, and format your response in markdown for clarity.";

  if (!question) return;

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user-message';
  userMsg.textContent = question;
  chatBox.appendChild(userMsg);

  questionInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  fetch('/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, prompt })
  })
    .then(response => response.json())
    .then(data => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot-message';

      const markdown = typeof marked !== 'undefined' ? marked.parse : (text) => text;
      botMsg.innerHTML = data.answer
        ? markdown(data.answer)
        : "Something went wrong. Please try again.";

      chatBox.appendChild(botMsg);

      // Add copy buttons to code blocks
      botMsg.querySelectorAll('pre > code').forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        pre.style.position = 'relative';
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(codeBlock.textContent);
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
        };
        pre.appendChild(copyBtn);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot-message';
      botMsg.textContent = "Error: " + error.message;
      chatBox.appendChild(botMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}
