const ragService = require('./ragService');

async function generateEmbedding(text) {
  const embedding = await ragService.generateEmbedding(text);
  if (embedding) return embedding;
  return null;
}

async function generateEmbeddingOpenAI(text) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  const baseURL = process.env.EMBEDDING_API_URL || 'https://api.openai.com/v1';
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-ada-002';

  if (!apiKey) {
    const fallback = await generateEmbedding(text);
    if (fallback) return fallback;
    throw new Error('No API key for external embedding service and local model failed');
  }

  try {
    const axios = require('axios');
    const { data } = await axios.post(
      `${baseURL}/embeddings`,
      { input: text, model },
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    return data.data[0].embedding;
  } catch {
    const fallback = await generateEmbedding(text);
    if (fallback) return fallback;
    throw new Error('Failed to generate embedding from all sources');
  }
}

module.exports = { generateEmbedding, generateEmbeddingOpenAI };
