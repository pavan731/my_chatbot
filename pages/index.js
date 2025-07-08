import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  const suggestedPrompts = [
    "What is CI/CD in DevOps?",
    "How does Kubernetes handle scaling?",
    "Generate a Terraform script for an S3 bucket",
    "Explain Docker networking",
    "How to monitor services with Prometheus?"
  ];

  return (
    <>
      <Head>
        <title>Chatbot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/style.css" />
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      </Head>

      <div className="chatgpt-container">
        <header>
          <h1>DevOps Support Chatbot</h1>
        </header>

        <main>
          <div className="suggested-prompts">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-button"
                onClick={() => {
                  document.getElementById('question-input').value = prompt;
                  sendQuestion();
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div id="chat-box" className="chat-box"></div>
        </main>

        <footer>
          <form id="chat-form" onSubmit={(e) => { e.preventDefault(); sendQuestion(); }}>
            <input type="text" id="question-input" placeholder="Ask anything..." autoComplete="off" />
            <button type="submit" id="send-btn">
              <span>&#9658;</span>
            </button>
          </form>
        </footer>

        <Script src="/app.js" strategy="afterInteractive" />
      </div>
    </>
  );
}
