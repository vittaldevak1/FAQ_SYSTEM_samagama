import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ChatBot from '../components/ChatBot';

const CATEGORY_LABELS = {
  'getting-started': { label: 'Getting Started', icon: '🚀' },
  'account-management': { label: 'Account', icon: '👤' },
  'course-enrollment': { label: 'Courses', icon: '📚' },
  'payments-billing': { label: 'Payments', icon: '💳' },
  'technical-support': { label: 'Support', icon: '🔧' },
  certifications: { label: 'Certifications', icon: '🎓' },
  'privacy-security': { label: 'Privacy', icon: '🔒' },
  internship: { label: 'Internship', icon: '💼' },
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/faqs');
      setFaqs(data.grouped || {});
      setCategories(Object.keys(data.grouped || {}));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const debouncedSearch = useMemo(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        if (!query.trim()) {
          setSearchResults(null);
          return;
        }
        try {
          const { data } = await api.get(`/faqs/search?q=${encodeURIComponent(query)}`);
          setSearchResults(data.results || []);
        } catch {
          setSearchResults([]);
        }
      }, 300);
    };
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const filteredFAQs = useMemo(() => {
    if (searchResults !== null) {
      if (activeCategory === 'all') return { results: searchResults };
      return {
        results: searchResults.filter(
          (f) => f.category === activeCategory
        ),
      };
    }

    if (activeCategory === 'all') return faqs;
    return { [activeCategory]: faqs[activeCategory] || [] };
  }, [faqs, searchResults, activeCategory]);

  const hasFAQs = useMemo(() => {
    if (searchResults !== null) return searchResults.length > 0;
    return Object.values(filteredFAQs).some((arr) => arr?.length > 0);
  }, [filteredFAQs, searchResults]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    toast.success('Logged out');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <header className="dash-header">
          <div className="dash-header-inner">
            <div className="dash-logo">FAQ Platform</div>
          </div>
        </header>
        <main className="dash-main">
          <div className="dash-loading">
            <div className="skeleton-line" style={{ width: '60%', margin: '0 auto 40px', height: '48px' }} />
            <div className="skeleton-line" style={{ width: '40%', margin: '0 auto 60px', height: '36px' }} />
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ marginBottom: '32px' }}>
                <div className="skeleton-line" style={{ width: '200px', height: '24px', marginBottom: '16px' }} />
                <div className="skeleton-line" style={{ width: '100%', height: '80px', marginBottom: '8px' }} />
                <div className="skeleton-line" style={{ width: '100%', height: '80px' }} />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            FAQ Platform
          </div>
          <div className="dash-header-right">
            <div className="dash-user-info">
              <div className="dash-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <span className="dash-user-name">{user?.name}</span>
            </div>
            <button className="dash-logout-btn" onClick={handleLogout} title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-hero">
          <h1 className="dash-title">How can we help you?</h1>
          <p className="dash-subtitle">Search our knowledge base or browse by category</p>
          <div className="dash-search-wrapper">
            <svg className="dash-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="dash-search-input"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {search && (
              <button className="dash-search-clear" onClick={() => { setSearch(''); setSearchResults(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="dash-categories">
            <button
              className={`dash-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`dash-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_LABELS[cat]?.icon || '📄'} {CATEGORY_LABELS[cat]?.label || cat}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-faqs">
          {!hasFAQs && (
            <div className="dash-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3>No FAQs found</h3>
              {search ? (
                <p>No results for "{search}". Try a different search term.</p>
              ) : (
                <p>No FAQs available in this category yet.</p>
              )}
            </div>
          )}

          {searchResults !== null ? (
            <div className="dash-faq-section">
              <h2 className="dash-section-title">
                Search Results ({searchResults.length})
              </h2>
              <div className="faq-list">
                {searchResults.map((faq) => (
                  <FaqCard
                    key={faq._id}
                    faq={faq}
                    expanded={expandedFaq === faq._id}
                    onToggle={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            Object.entries(filteredFAQs).map(([category, faqList]) =>
              faqList?.length > 0 && (
                <div key={category} className="dash-faq-section">
                  <h2 className="dash-section-title">
                    {CATEGORY_LABELS[category]?.icon || '📄'} {CATEGORY_LABELS[category]?.label || category}
                  </h2>
                  <div className="faq-list">
                    {faqList.map((faq) => (
                      <FaqCard
                        key={faq._id}
                        faq={faq}
                        expanded={expandedFaq === faq._id}
                        onToggle={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                      />
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

function FaqCard({ faq, expanded, onToggle }) {
  return (
    <div className={`faq-card ${expanded ? 'faq-card-expanded' : ''}`} onClick={onToggle}>
      <div className="faq-card-header">
        <div className="faq-card-question">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="faq-q-icon">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{faq.question}</span>
        </div>
        <svg
          className={`faq-chevron ${expanded ? 'faq-chevron-open' : ''}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {expanded && (
        <div className="faq-card-body">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
}
