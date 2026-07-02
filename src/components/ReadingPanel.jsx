import CardGrid from "./CardGrid";

const POSITION_COLORS = ["#d4688e", "#7e6b9e", "#9b7fa8"];

export default function ReadingPanel({ reading, summary, question, showCards = true, isHistory = false, showReadingEntries = true }) {
  if (!reading || reading.length === 0) return null;

  const cards = reading.map(entry => ({
    ...entry,
    spreadLabel: entry.positionLabel
  }));

  const hasDivider = showCards && showReadingEntries && reading.length > 0;

  return (
    <div className="reading-panel">
      <div className="reading-panel-header">
        <h3>{summary?.title || "解读结果"}</h3>
        {summary?.description && <p>{summary.description}</p>}
        {question && (
          <p className="reading-question">
            你的问题：「{question}」
          </p>
        )}
      </div>

      {showCards && <CardGrid cards={cards} isHistory={isHistory} />}

      {hasDivider && (
        <div className="reading-entries-divider"></div>
      )}

      {showReadingEntries && (
        <div className="reading-entries-list">
          {reading.map((entry, i) => (
            <div key={i} className="reading-entry" style={{ "--entry-color": POSITION_COLORS[i] || POSITION_COLORS[0], "--entry-index": i }}>
              <div className="reading-entry-number">
                {i + 1}
              </div>
              <div className="reading-entry-body">
                <div className="reading-entry-position">
                  {entry.positionLabel}
                </div>
                <div className="reading-entry-name">
                  {entry.name}
                  {entry.nameEn && (
                    <span className="reading-entry-en">
                      {entry.nameEn}
                    </span>
                  )}
                </div>
                <div className="reading-entry-text">
                  {entry.meaning}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReadingEntries && summary?.themes && summary.themes.length > 0 && (
        <div className="reading-themes">
          {summary.themes.map((theme) => (
            <span key={theme} className="reading-theme-tag">
              {theme}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
