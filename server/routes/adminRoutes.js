const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

const router = Router();
const isAdmin = authorizeRoles('super_admin', 'admin');
const isSuperAdmin = authorizeRoles('super_admin');

// Leaderboard — visible to all authenticated users
router.get('/leaderboard', authenticateUser, adminController.getLeaderboard);

router.use(authenticateUser, isAdmin);

// Stats, users
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);

// Role management
router.patch('/users/:id/promote', isAdmin, adminController.promoteToAdmin);
router.patch('/users/:id/promote-super', isSuperAdmin, adminController.promoteToSuperAdmin);
router.patch('/users/:id/demote', isSuperAdmin, adminController.demoteAdmin);
router.patch('/users/:id/role', isSuperAdmin, adminController.updateUserRole);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// Questions
router.patch('/questions/:id/good-question', adminController.markGoodQuestion);
router.post('/questions/:id/promote-faq', adminController.promoteQuestionToFaq);

// Pending answers moderation
router.get('/answers/pending', adminController.getPendingAnswers);

// FAQ CRUD (admin / super_admin)
router.get('/faqs', isAdmin, adminController.getAllFaqs);
router.post('/faqs', isAdmin, adminController.createFaq);
router.patch('/faqs/:id', isAdmin, adminController.updateFaq);
router.delete('/faqs/:id', isAdmin, adminController.deleteFaq);

// Audit log (super_admin only)
router.get('/audit-logs', isSuperAdmin, adminController.getAuditLogs);

module.exports = router;