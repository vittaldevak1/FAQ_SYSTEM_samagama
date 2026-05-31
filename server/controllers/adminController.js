const User = require('../models/User');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const AuditLog = require('../models/AuditLog');
const { AppError } = require('../middleware/errorHandler');

const log = async (action, performedBy, details = {}) => {
  try {
    await AuditLog.create({ action, performedBy, ...details });
  } catch (e) {
    console.warn('Audit log failed:', e.message);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role && ['super_admin', 'admin', 'intern'].includes(role)) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-refreshToken -passwordResetToken -passwordResetExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);
    res.json({ success: true, users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-refreshToken -passwordResetToken -passwordResetExpires');
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !['super_admin', 'admin', 'intern'].includes(role))
      return next(new AppError('Valid role required', 400));

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user._id.equals(req.user._id)) return next(new AppError('Cannot change your own role', 400));
    if (user.role === 'super_admin') return next(new AppError('Cannot change a super_admin role', 403));
    if (role === 'super_admin' && req.user.role !== 'super_admin')
      return next(new AppError('Only super_admin can assign super_admin', 403));

    const oldRole = user.role;
    user.role = role;
    await user.save();
    await log('role_change', req.user._id, { targetUser: user._id, details: `${oldRole} → ${role}` });

    res.json({ success: true, message: `Role updated to ${role}`, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.promoteToAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user.role === 'admin') return next(new AppError('Already an admin', 400));
    if (user.role === 'super_admin') return next(new AppError('Cannot demote super_admin', 403));
    if (user._id.equals(req.user._id)) return next(new AppError('Cannot promote yourself', 400));

    user.role = 'admin';
    await user.save();
    await log('promote_to_admin', req.user._id, { targetUser: user._id, details: `${user.name} promoted to admin` });

    res.json({ success: true, message: 'Promoted to admin', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.promoteToSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user.role === 'super_admin') return next(new AppError('Already a super_admin', 400));
    if (user._id.equals(req.user._id)) return next(new AppError('Cannot promote yourself', 400));

    user.role = 'super_admin';
    await user.save();
    await log('promote_to_super_admin', req.user._id, { targetUser: user._id, details: `${user.name} promoted to super_admin` });

    res.json({ success: true, message: 'Promoted to super_admin', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.demoteAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user.role === 'super_admin') return next(new AppError('Cannot demote a super_admin', 403));
    if (user.role === 'intern') return next(new AppError('User is already an intern', 400));
    if (user._id.equals(req.user._id)) return next(new AppError('Cannot demote yourself', 400));

    user.role = 'intern';
    await user.save();
    await log('demote_to_intern', req.user._id, { targetUser: user._id, details: `${user.name} demoted to intern` });

    res.json({ success: true, message: 'Demoted to intern', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user._id.equals(req.user._id)) return next(new AppError('Cannot delete your own account', 400));
    if (user.role === 'super_admin') return next(new AppError('Cannot delete a super_admin', 403));
    if (user.role === 'admin' && req.user.role !== 'super_admin')
      return next(new AppError('Only super_admin can delete admins', 403));

    await log('delete_user', req.user._id, { targetUser: user._id, details: `Deleted ${user.name} (${user.role})` });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const Question = require('../models/Question');
    const Answer = require('../models/Answer');
    const Faq = require('../models/Faq');
    const [totalUsers, totalQuestions, totalAnswers, totalFaqs, pendingAnswers] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Answer.countDocuments(),
      Faq.countDocuments(),
      Answer.countDocuments({ status: 'pending' }),
    ]);
    res.json({ success: true, totalUsers, totalQuestions, totalAnswers, totalFaqs, pendingAnswers });
  } catch (err) { next(err); }
};

exports.markGoodQuestion = async (req, res, next) => {
  try {
    const Question = require('../models/Question');
    const question = await Question.findById(req.params.id);
    if (!question) return next(new AppError('Question not found', 404));
    question.isGoodQuestion = true;
    await question.save();
    try {
      const author = await User.findById(question.author);
      if (author) await author.awardPoints('good_question', 5, question._id);
    } catch (e) { console.warn('Points award failed:', e.message); }
    res.json({ success: true, message: 'Marked as Good Question', question });
  } catch (err) { next(err); }
};

exports.promoteQuestionToFaq = async (req, res, next) => {
  try {
    const Question = require('../models/Question');
    const Faq = require('../models/Faq');
    const { answer, category } = req.body;
    if (!answer || !category) return next(new AppError('Answer and category required', 400));
    const question = await Question.findById(req.params.id);
    if (!question) return next(new AppError('Question not found', 404));
    const faq = await Faq.create({ question: question.title, answer, category: category.toLowerCase(), createdBy: req.user._id });
    try { const { indexFaq } = require('../services/searchService'); await indexFaq(faq); } catch (e) { console.warn('Index warning:', e.message); }
    try {
      const author = await User.findById(question.author);
      if (author) await author.awardPoints('question_promoted_to_faq', 15, question._id);
    } catch (e) { console.warn('Points award failed:', e.message); }
    await log('promote_question_to_faq', req.user._id, { targetFaq: faq._id, details: question.title });
    res.json({ success: true, message: 'Promoted to FAQ', faq });
  } catch (err) { next(err); }
};

// FAQ CRUD (super_admin only)
exports.getAllFaqs = async (req, res, next) => {
  try {
    const Faq = require('../models/Faq');
    const faqs = await Faq.find({}).sort({ createdAt: -1 });
    res.json({ success: true, faqs });
  } catch (err) { next(err); }
};

exports.createFaq = async (req, res, next) => {
  try {
    const Faq = require('../models/Faq');
    const { question, answer, category } = req.body;
    if (!question || !answer || !category) return next(new AppError('question, answer, category required', 400));
    const faq = await Faq.create({ question, answer, category: category.toLowerCase(), createdBy: req.user._id });
    try { const { indexFaq } = require('../services/searchService'); await indexFaq(faq); } catch (e) {}
    await log('create_faq', req.user._id, { targetFaq: faq._id, details: question });
    res.json({ success: true, faq });
  } catch (err) { next(err); }
};

exports.updateFaq = async (req, res, next) => {
  try {
    const Faq = require('../models/Faq');
    const { question, answer, category } = req.body;
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, category: category?.toLowerCase() },
      { new: true, runValidators: true }
    );
    if (!faq) return next(new AppError('FAQ not found', 404));
    try { const { indexFaq } = require('../services/searchService'); await indexFaq(faq); } catch (e) {}
    await log('update_faq', req.user._id, { targetFaq: faq._id, details: question });
    res.json({ success: true, faq });
  } catch (err) { next(err); }
};

exports.deleteFaq = async (req, res, next) => {
  try {
    const Faq = require('../models/Faq');
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return next(new AppError('FAQ not found', 404));
    try { const { deleteFaqIndex } = require('../services/searchService'); await deleteFaqIndex(req.params.id); } catch (e) {}
    await log('delete_faq', req.user._id, { details: faq.question });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) { next(err); }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({})
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email role')
      .populate('targetFaq', 'question')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (err) { next(err); }
};

exports.getPendingAnswers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [answers, total] = await Promise.all([
      Answer.find({ status: 'pending' })
        .populate('author', 'name email')
        .populate('question', 'title')
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit),
      Answer.countDocuments({ status: 'pending' }),
    ]);
    res.json({
      success: true,
      answers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({}).select('name email points role').sort({ points: -1 }).limit(20);
    res.json({ success: true, leaderboard: users });
  } catch (err) { next(err); }
};