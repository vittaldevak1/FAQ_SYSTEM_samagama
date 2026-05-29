import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import SearchSuggestions from '../components/SearchSuggestions';
import SearchResults from '../components/SearchResults';
import { searchFAQs, getSuggestions } from '../api/searchApi';

const RECENT_SEARCHES_KEY = 'recentSearches';
const CACHE_TTL = 5 * 60 * 1000;

export default function FAQPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    } catch { return []; }
  });
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const cacheRef = useRef(new Map());
  const suggestCacheRef = useRef(new Map());

  const updateRecentSearches = (q) => {
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const performSearch = useCallback(async (q) => {
    const trimmed = q.trim();
    if (trimmed.length < 3) return;

    setQuery(trimmed);
    setSearchLoading(true);
    setError(null);
    setSuggestions([]);

    const cached = cacheRef.current.get(trimmed);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setResults(cached.data);
      setSearchLoading(false);
      updateRecentSearches(trimmed);
      return;
    }

    try {
      const data = await searchFAQs(trimmed);
      cacheRef.current.set(trimmed, { data, timestamp: Date.now() });
      setResults(data);
      updateRecentSearches(trimmed);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
      setResults(null);
    } finally {
      setSearchLoading(false);
    }
  }, [recentSearches]);

  const handleInputChange = useCallback((value) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length >= 3) {
      setSuggestLoading(true);
      debounceRef.current = setTimeout(async () => {
        const cached = suggestCacheRef.current.get(value.trim());
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setSuggestions(cached.data);
          setSuggestLoading(false);
          return;
        }
        try {
          const data = await getSuggestions(value.trim());
          suggestCacheRef.current.set(value.trim(), { data, timestamp: Date.now() });
          setSuggestions(data);
        } catch {
          setSuggestions([]);
        } finally {
          setSuggestLoading(false);
        }
      }, 300);
    } else {
      setSuggestLoading(false);
      setSuggestions([]);
    }
  }, []);

  const handleSearch = useCallback((q) => {
    setSuggestions([]);
    performSearch(q);
  }, [performSearch]);

  const handleSelectSuggestion = useCallback((suggestion) => {
    setQuery(suggestion.question);
    setSuggestions([]);
    performSearch(suggestion.question);
  }, [performSearch]);

  const handleKeyDown = useCallback((e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    }
  }, [suggestions, selectedIndex, handleSelectSuggestion]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="faq-page">
      <header className="faq-page-header">
        <div className="faq-page-header-inner">
          <div className="faq-page-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            FAQ Platform
          </div>
          <div className="faq-page-header-right">
            <button className="faq-page-nav-btn" onClick={() => navigate('/dashboard')}>
              Browse FAQs
            </button>
            <button className="faq-page-nav-btn" onClick={() => navigate('/query')}>
              Ask a Question
            </button>
            <div className="faq-page-user">
              <div className="dash-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <span className="faq-page-user-name">{user?.name}</span>
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

      <main className="faq-page-main">
        <div className="faq-page-hero">
          <h1 className="faq-page-title">How can we help you?</h1>
          <p className="faq-page-subtitle">Search our knowledge base with AI-powered semantic search</p>

          <div className="faq-page-search-area">
            <SearchBar
              onSearch={handleSearch}
              onSelectSuggestion={handleSelectSuggestion}
              loading={searchLoading}
            />
            {query.trim().length >= 3 && (
              <SearchSuggestions
                suggestions={suggestions}
                loading={suggestLoading}
                onSelect={handleSelectSuggestion}
                selectedIndex={selectedIndex}
                query={query}
              />
            )}
          </div>
        </div>

        {error && (
          <div className="faq-page-error">
            <p>{error}</p>
          </div>
        )}

        <SearchResults
          results={results}
          loading={searchLoading}
          onSelectQuestion={handleSearch}
          query={query}
        />

        {!results && !searchLoading && recentSearches.length > 0 && (
          <div className="faq-page-recent">
            <h3 className="faq-page-recent-title">Recent Searches</h3>
            <div className="faq-page-recent-list">
              {recentSearches.map((s, i) => (
                <button key={i} className="faq-page-recent-item" onClick={() => handleSearch(s)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
