import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../services/questionService';
import answerService from '../services/answerService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const [confirm, setConfirm] = useState(null);
  const waitConfirm = (opts) => new Promise(resolve => { setConfirm({ ...opts, resolve }); });

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const qData = await questionService.getQuestionById(id);
      const aData = await answerService.getAnswersByQuestionId(id);
      setQuestion(qData);
      setAnswers(aData);
    } catch (err) {
      setError('Failed to load question details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    if (newAnswer.trim().length < 10) {
      toast.error('Answer must be at least 10 characters.');
      return;
    }
    try {
      await answerService.createAnswer({ content: newAnswer, questionId: id });
      setNewAnswer('');
      fetchData();
      refreshUser();
    } catch (err) {
      toast.error('Failed to submit answer');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const ok = await waitConfirm({ title: 'Delete Answer', message: 'Delete this answer?', confirmLabel: 'Delete', variant: 'danger' });
    if (!ok) return;
    try {
      await answerService.deleteAnswer(answerId);
      fetchData();
      refreshUser();
    } catch { toast.error('Failed to delete answer'); }
  };

  const handleUpvote = async (answerId) => {
    try { await answerService.upvoteAnswer(answerId); fetchData(); refreshUser(); }
    catch { toast.error('Failed to upvote'); }
  };

  const handleDownvote = async (answerId) => {
    try { await answerService.downvoteAnswer(answerId); fetchData(); refreshUser(); }
    catch { toast.error('Failed to downvote'); }
  };

  const isVoted = (arr) => arr?.some(id => id.toString() === (user?._id || user?.id)?.toString());

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div>;
  if (error) return <div className="alert-error">{error}</div>;
  if (!question) return <div>Question not found.</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>{question.title}</h2>
          <span className={`badge ${question.status === 'answered' ? 'badge-answered' : 'badge-pending'}`}>
            {question.status.toUpperCase()}
          </span>
        </div>
        <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
          {question.description || 'No description provided.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
            {question.author?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Asked by <strong>{question.author?.name || question.author?.email || 'Unknown'}</strong> · {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Answers ({answers.length})</h3>

      <div className="flex-col" style={{ marginBottom: '2rem' }}>
        {answers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No answers yet. Be the first to answer!</p>
        ) : (
          answers.map(ans => (
            <div key={ans._id} className="glass-card">
              {ans.isAccepted && (
                <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 8, display: 'inline-block' }}>
                  ✓ Accepted Answer
                </div>
              )}
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {ans.content}
              </p>
              <div className="flex-between">
                <div className="flex-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                      {ans.author?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>{ans.author?.name || ans.author?.email || 'Unknown'}</strong>
                      {ans.author?.points !== undefined && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--accent)' }}>⭐ {ans.author.points} pts</span>
                      )}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', marginLeft: '1rem' }}>
                    <button onClick={() => handleUpvote(ans._id)} style={{
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: 18, padding: '0 6px',
                      color: isVoted(ans.upvotes) ? 'var(--accent)' : 'var(--text-muted)',
                      transition: 'transform 0.1s ease, color 0.1s ease',
                    }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(1.4)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ▲
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 16, textAlign: 'center' }}>
                      {ans.upvotes?.length || 0}
                    </span>
                    <button onClick={() => handleDownvote(ans._id)} style={{
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: 18, padding: '0 6px',
                      color: isVoted(ans.downvotes) ? 'var(--accent)' : 'var(--text-muted)',
                      transition: 'transform 0.1s ease, color 0.1s ease',
                    }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(1.4)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ▼
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 16, textAlign: 'center' }}>
                      {ans.downvotes?.length || 0}
                    </span>
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!ans.isAccepted && (
                      <button onClick={async () => {
                        try { await answerService.acceptAnswer(ans._id); fetchData(); refreshUser(); }
                        catch { toast.error('Failed to accept answer'); }
                      }} style={{
                        padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer',
                        background: 'rgba(16,185,129,0.08)', border: '1px solid var(--success)',
                        color: 'var(--success)', borderRadius: 6
                      }}>✓ Accept</button>
                    )}
                    <button onClick={() => handleDeleteAnswer(ans._id)} style={{
                      padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer',
                      background: 'rgba(220,38,38,0.08)', border: '1px solid var(--error)',
                      color: 'var(--error)', borderRadius: 6
                    }}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="glass-card">
        <h4 style={{ marginBottom: '0.5rem' }}>Post an Answer</h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: '1rem' }}>Minimum 10 characters required.</p>
        <form onSubmit={handleAnswerSubmit} className="flex-col">
          <textarea
            className="form-input"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here (minimum 10 characters)..."
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="submit" className="btn-primary" style={{ width: 'max-content' }}>
              Submit Answer
            </button>
            <span style={{ fontSize: 12, color: newAnswer.length < 10 ? 'var(--error)' : 'var(--success)' }}>
              {newAnswer.length}/10 chars
            </span>
          </div>
        </form>
      </div>

      <ConfirmModal
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        cancelLabel={confirm?.cancelLabel}
        variant={confirm?.variant}
        onConfirm={() => { confirm?.resolve(true); setConfirm(null); }}
        onCancel={() => { confirm?.resolve(false); setConfirm(null); }}
      />
    </div>
  );
};

export default QuestionDetail;