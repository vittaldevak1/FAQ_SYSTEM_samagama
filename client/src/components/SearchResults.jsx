export default function SearchResults({ results, loading, onSelectQuestion, query }) {
  if (loading) {
    return (
      <div className="search-results">
        <div className="search-answer-skeleton">
          <div className="skeleton-line" style={{ width: '30%', height: '22px', marginBottom: '16px' }} />
          <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton-line" style={{ width: '90%', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton-line" style={{ width: '70%', height: '14px' }} />
        </div>
      </div>
    );
  }

  if (!results) return null;

  const { answer, confidence, sources, similar } = results;

  return (
    <div className="search-results">
      <div className={`search-answer-card ${confidence < 0.7 ? 'search-answer-low' : ''}`}>
        <div className="search-answer-header">
          <h3 className="search-answer-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            AI Answer
          </h3>
          <span className={`search-confidence ${confidence >= 0.7 ? 'confidence-high' : 'confidence-low'}`}>
            {Math.round(confidence * 100)}% confident
          </span>
        </div>

        {confidence >= 0.7 ? (
          <p className="search-answer-text">{answer}</p>
        ) : (
          <div className="search-answer-low-confidence">
            <p className="search-answer-text">{answer}</p>
            <p className="search-answer-low-note">This answer may not be accurate. Would you like to submit this question?</p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="search-sources">
            <h4 className="search-sources-title">Sources</h4>
            {sources.map((s, i) => (
              <div key={s.faqId || i} className="search-source-item">
                <span className="search-source-score">{Math.round(s.score * 100)}% match</span>
                <span className="search-source-question">{s.question}</span>
                <span className="search-source-category">{s.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {similar && similar.length > 0 && (
        <div className="search-similar">
          <h3 className="search-similar-title">Related Questions</h3>
          <div className="search-similar-list">
            {similar.map((s, i) => (
              <button
                key={s.faqId || i}
                className="search-similar-item"
                onClick={() => onSelectQuestion(s.question)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>{s.question}</span>
                <span className="search-similar-score">{Math.round(s.score * 100)}%</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
