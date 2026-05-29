export default function SearchSuggestions({ suggestions, loading, onSelect, selectedIndex, query }) {
  if (loading) {
    return (
      <div className="search-suggestions">
        {[1, 2, 3].map((i) => (
          <div key={i} className="search-suggestion-skeleton">
            <div className="skeleton-line" style={{ width: `${60 + i * 10}%`, height: '16px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  const highlightMatch = (text, q) => {
    if (!q || q.length < 2) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  return (
    <div className="search-suggestions">
      {suggestions.map((s, i) => (
        <button
          key={s.faqId || i}
          className={`search-suggestion-item ${i === selectedIndex ? 'search-suggestion-active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(s); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-suggestion-icon">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="search-suggestion-text">{highlightMatch(s.question, query)}</span>
          <span className="search-suggestion-score">{Math.round(s.score * 100)}%</span>
        </button>
      ))}
    </div>
  );
}
