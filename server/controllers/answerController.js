const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { notifyUser } = require('../services/socketService');

// Create a new answer
const createAnswer = async (req, res) => {
  const { content, questionId } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Answer content is required' });
  }

  try {
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    const answer = await Answer.create({
      content,
      question: questionId,
      author: req.user._id,
      status: isAdmin ? 'approved' : 'pending',
    });

    await Question.findByIdAndUpdate(questionId, { status: 'answered' });

    const question = await Question.findById(questionId).select('author title');
    if (question && question.author.toString() !== req.user._id.toString()) {
      const notif = await Notification.create({
        recipient: question.author,
        type: 'question_answered',
        title: 'Your Question Got an Answer',
        message: `"${question.title.slice(0, 60)}" received a new answer`,
        link: `/questions/${questionId}`,
        relatedId: questionId,
      });
      notifyUser(question.author, notif);
    }

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all answers for a specific question
const getAnswersByQuestionId = async (req, res) => {
  try {
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    const filter = { question: req.params.questionId };
    if (!isAdmin) filter.status = 'approved';
    const answers = await Answer.find(filter)
      .populate('author', 'name email points')
      .sort({ createdAt: 1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete answer (Admin only)
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    await answer.deleteOne();
    res.json({ message: 'Answer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upvote an answer
const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const alreadyUpvoted = answer.upvotes.includes(req.user._id);

    if (alreadyUpvoted) {
      // Remove upvote (toggle off)
      answer.upvotes = answer.upvotes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Add upvote, remove downvote if exists
      answer.upvotes.push(req.user._id);
      const hadDownvote = answer.downvotes.includes(req.user._id);
      answer.downvotes = answer.downvotes.filter(id => id.toString() !== req.user._id.toString());

      // Award +5 points to answer author when they reach 5+ upvotes
      if (answer.upvotes.length === 5) {
        try {
          const author = await User.findById(answer.author);
          if (author) {
            await author.awardPoints('answer_5_upvotes', 10, answer._id);
          }
        } catch (e) {
          console.warn('Points award failed:', e.message);
        }
      }

      // If removing a downvote, reverse the -5 penalty
      if (hadDownvote) {
        try {
          const author = await User.findById(answer.author);
          if (author) {
            await author.awardPoints('downvote_removed', 5, answer._id);
          }
        } catch (e) {
          console.warn('Points reversal failed:', e.message);
        }
      }
    }

    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Downvote an answer
const downvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const alreadyDownvoted = answer.downvotes.includes(req.user._id);

    if (alreadyDownvoted) {
      // Remove downvote (toggle off) — reverse the penalty
      answer.downvotes = answer.downvotes.filter(id => id.toString() !== req.user._id.toString());
      try {
        const author = await User.findById(answer.author);
        if (author) {
          await author.awardPoints('downvote_removed', 5, answer._id);
        }
      } catch (e) {
        console.warn('Points reversal failed:', e.message);
      }
    } else {
      // Add downvote, remove upvote if exists
      answer.downvotes.push(req.user._id);
      answer.upvotes = answer.upvotes.filter(id => id.toString() !== req.user._id.toString());

      // Award -5 points to answer author
      try {
        const author = await User.findById(answer.author);
        if (author) {
          await author.awardPoints('answer_downvoted', -5, answer._id);
        }
      } catch (e) {
        console.warn('Points award failed:', e.message);
      }
    }

    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept answer (Admin only) — +20 points
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    answer.isAccepted = true;
    await answer.save();

    // Award +20 points to answer author
    try {
      const author = await User.findById(answer.author);
      if (author) {
        await author.awardPoints('answer_accepted', 20, answer._id);
      }
    } catch (e) {
      console.warn('Points award failed:', e.message);
    }

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve answer (Admin only)
const approveAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const question = await Question.findById(answer.question).select('author title');
    if (question && question.author.toString() !== answer.author.toString()) {
      const notif = await Notification.create({
        recipient: answer.author,
        type: 'answer_approved',
        title: 'Your Answer Was Approved',
        message: `"${question.title.slice(0, 60)}" answer was approved`,
        link: `/questions/${answer.question}`,
        relatedId: answer.question,
      });
      notifyUser(answer.author, notif);
    }

    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject answer (Admin only)
const rejectAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
  upvoteAnswer,
  downvoteAnswer,
  acceptAnswer,
  approveAnswer,
  rejectAnswer,
};