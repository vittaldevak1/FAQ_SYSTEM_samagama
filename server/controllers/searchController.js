const searchService = require('../services/searchService');
const Faq = require('../models/Faq');

exports.search = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ success: false, message: 'Query must be at least 3 characters' });
    }
    if (trimmed.length > 300) {
      return res.status(400).json({ success: false, message: 'Query must be under 300 characters' });
    }

    const sanitized = trimmed.replace(/[<>]/g, '');

    const { results, method } = await searchService.searchSemantic(sanitized, 5, 0.3);

    const sources = results.slice(0, 5).map(r => ({
      faqId: r._id || r.id,
      question: r.question,
      answer: r.answer,
      category: r.category,
      score: typeof r.score === 'number' ? Math.round(r.score * 100) / 100 : 0.5,
    }));

    sources.forEach(s => {
      if (s.faqId) {
        Faq.findByIdAndUpdate(s.faqId, { $inc: { views: 1 } }).catch(() => {});
      }
    });

    const { answer, confidence } = await searchService.generateAnswer(sanitized, sources);

    const similarResults = await searchService.getSuggestions(sanitized, 5);
    const similar = similarResults
      .filter(s => !sources.find(src => (src.faqId?.toString?.() || src.faqId) === (s.faqId?.toString?.() || s.faqId)))
      .slice(0, 5);

    res.json({
      success: true,
      answer,
      confidence: Math.round(confidence * 100) / 100,
      sources,
      similar,
      method,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

exports.suggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 3) {
      return res.json([]);
    }

    const sanitized = q.trim().replace(/[<>]/g, '').slice(0, 300);

    const results = await searchService.getSuggestions(sanitized, 5);

    res.json(results.map(r => ({
      faqId: r.faqId,
      question: r.question,
      score: r.score,
      category: r.category,
    })));
  } catch (err) {
    next(err);
  }
};
