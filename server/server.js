require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const Faq = require('./models/Faq');
const { fetchFAQs, getSampleFAQs } = require('./services/scraper');
const { INTERNSHIP_FAQS } = require('./services/internshipFaqs');
const ragService = require('./services/ragService');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const faqRoutes = require('./routes/faqRoutes');
const queryRoutes = require('./routes/queryRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/queries', queryRoutes);

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const seedFAQs = async () => {
  try {
    const count = await Faq.countDocuments();
    if (count > 0) {
      console.log(`FAQs: ${count} already exist`);
      return;
    }

    const faqs = [...getSampleFAQs(), ...INTERNSHIP_FAQS];
    const faqDocs = await Faq.insertMany(faqs);
    console.log(`FAQs: Seeded ${faqDocs.length} FAQs (${getSampleFAQs().length} sample + ${INTERNSHIP_FAQS.length} internship)`);

    const embeddings = [];
    for (const faq of faqDocs) {
      try {
        const embedding = await ragService.generateEmbedding(faq.question + ' ' + faq.answer);
        if (embedding) {
          embeddings.push({
            updateOne: {
              filter: { _id: faq._id },
              update: { $set: { embedding } },
            },
          });
        }
      } catch {
        // continue without embedding for this faq
      }
    }

    if (embeddings.length > 0) {
      await Faq.bulkWrite(embeddings);
      console.log(`FAQs: Generated ${embeddings.length} embeddings`);
    }
  } catch (err) {
    console.warn('FAQs: Seed skipped:', err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();

    await ragService.initEmbedder();
    ragService.initChroma();

    await seedFAQs();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
