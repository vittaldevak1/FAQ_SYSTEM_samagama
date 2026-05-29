const ragService = require('./ragService');
const embeddingService = require('./embeddingService');
const Faq = require('../models/Faq');

async function searchSemantic(query, limit = 5, threshold = 0.3) {
  if (!query || query.trim().length < 3) {
    return { results: [], method: 'none', reason: 'Query too short' };
  }

  const trimmed = query.trim();

  const chromaResult = await ragService.searchSimilar(trimmed, limit);
  if (chromaResult.results.length > 0) {
    return { results: chromaResult.results, method: chromaResult.method };
  }

  const faqs = await Faq.find({ isActive: true }).select('+embedding').limit(100);
  if (faqs.length > 0) {
    const memoryResults = await ragService.searchSimilarInMemory(trimmed, faqs, limit, threshold);
    if (memoryResults.length > 0) {
      return { results: memoryResults, method: 'in-memory' };
    }
  }

  const textResults = await Faq.find({
    isActive: true,
    $or: [
      { question: { $regex: trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { answer: { $regex: trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { tags: { $regex: trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
    ],
  }).limit(limit);

  return { results: textResults, method: 'keyword-fallback' };
}

async function getSuggestions(query, limit = 5) {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const trimmed = query.trim();

  const chromaResult = await ragService.searchSimilar(trimmed, limit);
  if (chromaResult.results.length > 0) {
    return chromaResult.results.map(r => ({
      faqId: r.id,
      question: r.question,
      score: r.score,
      category: r.category,
    }));
  }

  const faqs = await Faq.find({ isActive: true }).select('+embedding').limit(100);
  if (faqs.length > 0) {
    const memoryResults = await ragService.searchSimilarInMemory(trimmed, faqs, limit, 0.2);
    if (memoryResults.length > 0) {
      return memoryResults.map(r => ({
        faqId: r._id,
        question: r.question,
        score: r.score,
        category: r.category,
      }));
    }
  }

  const textResults = await Faq.find({
    isActive: true,
    question: { $regex: trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' },
  }).limit(limit);

  return textResults.map(r => ({
    faqId: r._id,
    question: r.question,
    score: 0.5,
    category: r.category,
  }));
}

async function generateAnswer(query, sources) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  const baseURL = process.env.LLM_API_URL || 'https://api.openai.com/v1';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  if (!apiKey || sources.length === 0) {
    return {
      answer: sources.length > 0 ? sources[0].answer : 'I could not find an answer to your question.',
      confidence: sources.length > 0 ? 0.5 : 0,
    };
  }

  const context = sources.map((s, i) =>
    `[${i + 1}] Q: ${s.question}\nA: ${s.answer}`
  ).join('\n\n');

  try {
    const axios = require('axios');
    const { data } = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful FAQ assistant. Answer the user\'s question based ONLY on the provided FAQ context. If the context does not contain enough information to answer, say so. Be concise and direct.',
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer based on the context above.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const answer = data.choices[0].message.content.trim();
    return { answer, confidence: sources[0]?.score || 0.7 };
  } catch {
    return {
      answer: sources[0]?.answer || 'I could not find an answer to your question.',
      confidence: 0.4,
    };
  }
}

module.exports = { searchSemantic, getSuggestions, generateAnswer };
