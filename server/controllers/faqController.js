const Faq = require('../models/Faq');
const { AppError } = require('../middleware/errorHandler');
const ragService = require('../services/ragService');

exports.getFAQs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const faqs = await Faq.find(filter).sort({ category: 1, order: 1 });

    const grouped = {};
    for (const faq of faqs) {
      const cat = faq.category || 'general';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(faq);
    }

    res.json({ success: true, count: faqs.length, faqs, grouped });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Faq.distinct('category', { isActive: true });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

exports.getFaqById = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }
    res.json({ success: true, faq });
  } catch (err) {
    next(err);
  }
};

exports.chatQuery = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return next(new AppError('Message is required', 400));
    }

    const query = message.trim();

    const allFaqs = await Faq.find({ isActive: true }).select('+embedding');

    if (allFaqs.length === 0) {
      return res.json({ success: true, found: false, message: 'No FAQs available yet.' });
    }

    const semanticResults = await ragService.searchSimilarInMemory(query, allFaqs, 3, 0.4);

    if (semanticResults.length > 0) {
      return res.json({
        success: true,
        found: true,
        answer: semanticResults[0].answer,
        question: semanticResults[0].question,
        category: semanticResults[0].category,
        score: semanticResults[0].score,
      });
    }

    const STOP_WORDS = new Set(['the', 'this', 'that', 'what', 'when', 'where', 'which', 'who', 'whom', 'how', 'why', 'and', 'but', 'for', 'not', 'you', 'your', 'with', 'can', 'all', 'are', 'was', 'has', 'had', 'its', 'our', 'their', 'will', 'have', 'been', 'does', 'did', 'get', 'got', 'may', 'just', 'about', 'into', 'than', 'then', 'very']);
    const qLower = query.toLowerCase();
    const words = qLower.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

    let bestMatch = null;
    let bestScore = 0;
    let bestMatches = 0;

    for (const faq of allFaqs) {
      const q = faq.question.toLowerCase();
      const a = faq.answer.toLowerCase();
      const t = (faq.tags || []).map(t => t.toLowerCase());
      const text = q + ' ' + a + ' ' + t.join(' ');

      let matchCount = 0;
      for (const word of words) {
        if (text.includes(word)) matchCount++;
      }
      const score = words.length > 0 ? matchCount / words.length : 0;

      if (score > bestScore || (score === bestScore && matchCount > bestMatches)) {
        bestScore = score;
        bestMatches = matchCount;
        bestMatch = faq;
      }
    }

    if (bestMatch && bestScore >= 0.5 && bestMatches >= 1) {
      return res.json({
        success: true,
        found: true,
        answer: bestMatch.answer,
        question: bestMatch.question,
        category: bestMatch.category,
        score: bestScore,
      });
    }

    const textResult = await Faq.findOne({
      isActive: true,
      $or: [
        { question: { $regex: qLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
        { tags: { $regex: qLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      ],
    });

    if (textResult) {
      return res.json({
        success: true, found: true,
        answer: textResult.answer,
        question: textResult.question,
        category: textResult.category,
        score: 1,
      });
    }

    res.json({
      success: true,
      found: false,
      message: 'I could not find an answer to your question.',
      suggestions: [],
    });
  } catch (err) {
    next(err);
  }
};

exports.searchFAQs = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return next(new AppError('Search query is required', 400));
    }

    const query = q.trim();

    const textResults = await Faq.find({
      isActive: true,
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { answer: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    }).limit(10);

    const seenIds = new Set(textResults.map(f => f._id.toString()));
    const combined = [...textResults];

    const allFaqs = await Faq.find({ isActive: true }).select('+embedding').limit(50);
    if (allFaqs.length > 0) {
      const semanticResults = await ragService.searchSimilarInMemory(query, allFaqs, 5, 0.3);
      for (const sr of semanticResults) {
        if (!seenIds.has(sr._id.toString())) {
          combined.push(sr);
          seenIds.add(sr._id.toString());
        }
      }
    }

    res.json({ success: true, count: combined.length, results: combined });
  } catch (err) {
    next(err);
  }
};

exports.createFaq = async (req, res, next) => {
  try {
    const { question, answer, category, tags } = req.body;

    const faq = await Faq.create({
      question,
      answer,
      category: (category || 'general').toLowerCase(),
      tags: tags || [],
      order: req.body.order || 0,
    });

    try {
      const embedding = await ragService.generateEmbedding(question + ' ' + answer);
      if (embedding) {
        faq.embedding = embedding;
        await faq.save();
      }
    } catch {
      // embedding generation failed, proceed without it
    }

    res.status(201).json({ success: true, faq });
  } catch (err) {
    next(err);
  }
};

exports.updateFaq = async (req, res, next) => {
  try {
    const { question, answer, category, tags, isActive, order } = req.body;
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category.toLowerCase();
    if (tags) faq.tags = tags;
    if (isActive !== undefined) faq.isActive = isActive;
    if (order !== undefined) faq.order = order;

    await faq.save();

    res.json({ success: true, faq });
  } catch (err) {
    next(err);
  }
};

exports.deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    next(err);
  }
};
