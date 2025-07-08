import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, prompt } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key is not set in environment variables.' });
  }

  const classifyPrompt = `Classify the following question as either 'general DevOps' or 'tool-specific (e.g., Docker, Kubernetes, Terraform, CI/CD)': ${question}`;

  try {
    // Step 1: Classify the question
    const classifyRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: classifyPrompt }] }]
      })
    });

    const classifyData = await classifyRes.json();
    const classification = classifyData.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || '';

    if (classification.includes('general')) {
      const aiPrompt = prompt
        ? `${prompt}\n\n${question}`
        : `You are a DevOps assistant. Provide a helpful, markdown-formatted response to: ${question}`;

      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }]
        })
      });

      const aiData = await aiRes.json();
      const answer = aiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer generated.';
      return res.status(200).json({ answer });

    } else if (classification.includes('tool-specific')) {
      const devopsPrompt = `You are a DevOps assistant. Provide a detailed, markdown-formatted answer to the following question: ${question}`;
      const devopsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: devopsPrompt }] }]
        })
      });

      const devopsData = await devopsRes.json();
      const answer = devopsData.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer generated.';
      return res.status(200).json({ answer });
    } else {
      return res.status(400).json({
        error: 'Could not classify the question.',
        gemini_classification: classification,
        gemini_raw: classifyData
      });
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
