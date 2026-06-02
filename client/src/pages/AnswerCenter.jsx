import { useState, useEffect } from 'react';
import questionService from '../services/questionService';
import answerService from '../services/answerService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AnswerCenter = () => {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [answersLoading, setAnswersLoading] = useState({});
  const [newAnswer, setNewAnswer] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [sortBy, setSortBy] = useState('new');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionService.getQuestions();
      setQuestions(data);
      const answerCounts = {};
      await Promise.all(data.map(async (q) => {
        try {
          const ans = await answerService.getAnswersByQuestionId(q._id);
          answerCounts[q._id] = ans;
        } catch {}
      }));
      setAnswers(answerCounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async (questionId) => {
    setAnswersLoading(prev => ({ ...prev, [questionId]: true }));
    try {
      const data = await answerService.getAnswersByQuestionId(questionId);
      setAnswers(prev => ({ ...prev, [questionId]: data }));
    } catch {}
    finally { setAnswersLoading(prev => ({ ...prev, [questionId]: false })); }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpvote = async (answerId, questionId) => {
    try { await answerService.upvoteAnswer(answerId); fetchAnswers(questionId); refreshUser(); } catch {}
  };

  const handleDownvote = async (answerId, questionId) => {
    try { await answerService.downvoteAnswer(answerId); fetchAnswers(questionId); refreshUser(); } catch {}
  };

  const handleSubmitAnswer = async (questionId) => {
    const content = newAnswer[questionId] || '';
    if (!content.trim()) return;
    if (content.trim().length < 10) { toast.error('Answer must be at least 10 characters.'); return; }
    setSubmitting(prev => ({ ...prev, [questionId]: true }));
    try {
      await answerService.createAnswer({ content, questionId });
      setNewAnswer(prev => ({ ...prev, [questionId]: '' }));
      fetchAnswers(questionId);
      fetchQuestions();
      refreshUser();
    } catch { toast.error('Failed to submit answer'); }
    finally { setSubmitting(prev => ({ ...prev, [questionId]: false })); }
  };

  const isVoted = (arr) => arr?.some(id => id.toString() === (user?._id || user?.id)?.toString());

  const getSortedAnswers = (qAnswers) => {
    if (!qAnswers) return [];
    const sorted = [...qAnswers];
    if (sortBy === 'top') return sorted.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
    if (sortBy === 'trending') return sorted.sort((a, b) => ((b.upvotes?.length || 0) - (b.downvotes?.length || 0)) - ((a.upvotes?.length || 0) - (a.downvotes?.length || 0)));
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getSortedQuestions = () => {
    let filtered = questions.filter(q => !search || q.title?.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'top') return filtered.sort((a, b) => (answers[b._id]?.length || 0) - (answers[a._id]?.length || 0));
    if (sortBy === 'trending') return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const sortedQuestions = getSortedQuestions();

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.3px' }}>Discussion Room</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {questions.length} discussion{questions.length !== 1 ? 's' : ''} · Share knowledge and engage with the community
        </p>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 14px 9px 36px',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {[
            { key: 'new', label: 'New' },
            { key: 'top', label: 'Top' },
            { key: 'trending', label: 'Trending' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setSortBy(key)} style={{
              padding: '8px 16px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: sortBy === key ? 'var(--accent)' : 'transparent',
              color: sortBy === key ? '#fff' : 'var(--text-secondary)',
              borderRight: key !== 'trending' ? '1px solid var(--border)' : 'none',
              transition: 'all 0.15s'
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Questions */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 72, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', opacity: 0.5 }} />
          ))}
        </div>
      ) : sortedQuestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>—</div>
          <div style={{ fontSize: 14 }}>No discussions found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sortedQuestions.map(q => {
            const isExpanded = expandedId === q._id;
            const qAnswers = answers[q._id];
            const sortedAnswers = getSortedAnswers(qAnswers);
            const answerText = newAnswer[q._id] || '';
            const answerCount = qAnswers?.length ?? null;

            return (
              <div key={q._id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${isExpanded ? 'var(--accent)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'all 0.15s',
              }}>
                {/* Question row */}
                <div
                  onClick={() => handleExpand(q._id)}
                  style={{
                    padding: '14px 18px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  {/* Stats column */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 2, minWidth: 44, flexShrink: 0
                  }}>
                    <div style={{
                      fontSize: 17, fontWeight: 800,
                      color: answerCount > 0 ? 'var(--accent)' : 'var(--text-muted)'
                    }}>
                      {answerCount ?? '·'}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                      {answerCount === 1 ? 'reply' : 'replies'}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />

                  {/* Question info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 14, marginBottom: 5,
                      color: 'var(--text-primary)', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {q.title}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
                        background: q.status === 'answered' ? 'rgba(16,185,129,0.1)' : 'rgba(217,119,6,0.1)',
                        color: q.status === 'answered' ? 'var(--success)' : 'var(--warning)'
                      }}>{q.status?.toUpperCase()}</span>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, flexShrink: 0
                      }}>
                        {q.author?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {q.author?.name || 'Unknown'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(q.createdAt)}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {/* Expanded thread */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>

                    {/* Full question */}
                    {q.description && (
                      <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{q.description}</p>
                      </div>
                    )}

                    {/* Answers */}
                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {answersLoading[q._id] ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading...</p>
                      ) : sortedAnswers.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                          No replies yet — be the first to answer.
                        </p>
                      ) : (
                        sortedAnswers.map(ans => (
                          <div key={ans._id} style={{
                            display: 'flex', gap: 12,
                            background: ans.isAccepted ? 'rgba(16,185,129,0.04)' : 'var(--bg-secondary)',
                            border: `1px solid ${ans.isAccepted ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-sm)', padding: '12px 14px',
                          }}>
                            {/* Vote column */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                              <button onClick={() => handleUpvote(ans._id, q._id)} style={{
                                background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 6px',
                                color: isVoted(ans.upvotes) ? 'var(--accent)' : 'var(--text-muted)',
                                fontSize: 14, fontWeight: 700, lineHeight: 1,
                                transition: 'transform 0.1s ease, color 0.1s ease',
                              }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(1.4)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              >▲</button>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 16, textAlign: 'center' }}>
                                {(ans.upvotes?.length || 0) - (ans.downvotes?.length || 0)}
                              </span>
                              <button onClick={() => handleDownvote(ans._id, q._id)} style={{
                                background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 6px',
                                color: isVoted(ans.downvotes) ? 'var(--accent)' : 'var(--text-muted)',
                                fontSize: 14, fontWeight: 700, lineHeight: 1,
                                transition: 'transform 0.1s ease, color 0.1s ease',
                              }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(1.4)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              >▼</button>
                            </div>

                            {/* Answer content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {ans.isAccepted && (
                                <div style={{ color: 'var(--success)', fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: '0.3px' }}>
                                  ACCEPTED ANSWER
                                </div>
                              )}
                              <p style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', margin: '0 0 10px', lineHeight: 1.65 }}>
                                {ans.content}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                  width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-light)',
                                  color: 'var(--accent)', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', fontSize: 9, fontWeight: 700
                                }}>
                                  {ans.author?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                                  {ans.author?.name || 'Unknown'}
                                </span>
                                {ans.author?.points !== undefined && (
                                  <span style={{
                                    fontSize: 11, color: 'var(--accent)', fontWeight: 600,
                                    background: 'var(--accent-light)', padding: '1px 6px', borderRadius: 10
                                  }}>
                                    {ans.author.points} pts
                                  </span>
                                )}
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(ans.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Post answer */}
                    <div style={{ padding: '0 18px 18px' }}>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                        <textarea
                          value={answerText}
                          onChange={e => setNewAnswer(prev => ({ ...prev, [q._id]: e.target.value }))}
                          placeholder="Write your reply (minimum 10 characters)..."
                          style={{
                            width: '100%', minHeight: 90, padding: '10px 12px',
                            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                            fontSize: 13, fontFamily: 'inherit', resize: 'vertical',
                            outline: 'none', boxSizing: 'border-box', lineHeight: 1.5
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                          onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <button
                            onClick={() => handleSubmitAnswer(q._id)}
                            disabled={submitting[q._id]}
                            style={{
                              padding: '8px 18px', borderRadius: 'var(--radius-sm)', border: 'none',
                              background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                              cursor: submitting[q._id] ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit', opacity: submitting[q._id] ? 0.7 : 1,
                              transition: 'opacity 0.15s'
                            }}
                          >{submitting[q._id] ? 'Posting...' : 'Post Reply'}</button>
                          <span style={{
                            fontSize: 12, fontWeight: 500,
                            color: answerText.length === 0 ? 'var(--text-muted)' : answerText.length < 10 ? 'var(--error)' : 'var(--success)'
                          }}>
                            {answerText.length} / 10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AnswerCenter;