const { Router } = require('express');
const searchController = require('../controllers/searchController');
const { authenticateUser } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many search requests. Try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const suggestionsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/', authenticateUser, searchLimiter, searchController.search);
router.get('/suggestions', authenticateUser, suggestionsLimiter, searchController.suggestions);

module.exports = router;
