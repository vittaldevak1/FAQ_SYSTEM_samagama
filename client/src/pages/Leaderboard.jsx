import { useState, useEffect } from 'react';
import api from '../api/axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/admin/leaderboard');
      setLeaderboard(data.leaderboard || []);
    } catch {
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const rankColor = (i) => i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--text-muted)';

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading leaderboard...</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Leaderboard</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Top contributors ranked by points</p>
      </div>

      {leaderboard.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)', fontSize: 14 }}>
          No users on the leaderboard yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leaderboard.map((u, i) => (
            <div key={u._id} style={{
              background: i < 3 ? 'var(--accent-light)' : 'var(--bg-card)',
              border: `1px solid ${i < 3 ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'all 0.2s'
            }}>
              {/* Rank */}
              <div style={{
                fontSize: i < 3 ? 20 : 14, fontWeight: 800,
                width: 36, textAlign: 'center', flexShrink: 0,
                color: rankColor(i)
              }}>
                {i < 3 ? ['1st', '2nd', '3rd'][i] : `#${i + 1}`}
              </div>

              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: i < 3 ? 'var(--accent)' : 'var(--bg-secondary)',
                color: i < 3 ? '#fff' : 'var(--text-secondary)',
                border: `2px solid ${rankColor(i)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 16, flexShrink: 0
              }}>
                {u.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* Name + role */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.email}</div>
              </div>

              {/* Points */}
              <div style={{
                background: i < 3 ? 'var(--accent)' : 'var(--bg-secondary)',
                color: i < 3 ? '#fff' : 'var(--text-primary)',
                border: `1px solid ${i < 3 ? 'var(--accent)' : 'var(--border)'}`,
                padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: 14,
                flexShrink: 0
              }}>
                {u.points} pts
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to earn points */}
      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
        <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>How to earn points</strong>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: 'Answer accepted', pts: '+20' },
            { label: 'Question promoted to FAQ', pts: '+15' },
            { label: 'Answer gets 5+ upvotes', pts: '+10' },
            { label: 'Good question badge', pts: '+5' },
            { label: 'Answer downvoted', pts: '-5' },
          ].map(({ label, pts }) => (
            <span key={label} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: '4px 10px', borderRadius: 20, fontSize: 12, color: 'var(--text-secondary)'
            }}>
              {label} <strong style={{ color: pts.startsWith('+') ? 'var(--success)' : 'var(--error)' }}>{pts}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;