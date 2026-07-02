import { useState, useEffect, useRef } from "react";
import CardImage from "./CardImage";

export default function ReadingCard({ card, index, isHistory = false }) {
  const [flipped, setFlipped] = useState(isHistory);
  const [revealing, setRevealing] = useState(false);
  const [showInfo, setShowInfo] = useState(isHistory);
  const flipRef = useRef(null);

  useEffect(() => {
    if (isHistory) return;

    const scaleDelay = index * 200;
    const flipDuration = 1000;

    // Flip and basic-reading info panel start at the same time.
    const revealTimer = setTimeout(() => {
      setRevealing(true);
    }, scaleDelay);

    const flipTimer = setTimeout(() => {
      setFlipped(true);
      setRevealing(false);
    }, scaleDelay + flipDuration);

    const infoTimer = setTimeout(() => {
      setShowInfo(true);
    }, scaleDelay);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(flipTimer);
      clearTimeout(infoTimer);
    };
  }, [index, isHistory]);

  return (
    <div className="reading-card-wrapper">
      <span className="reading-position-label">
        {card.spreadLabel || `第 ${index + 1} 张`}
      </span>

      <div className={`card-scene ${flipped && !isHistory ? "card-revealed-glow" : ""}`}>
        <div
          ref={flipRef}
          className={`card-flip ${flipped ? "flipped" : ""} ${revealing ? "revealing" : ""}`}
        >
          <div className="card-face card-front">
            <img
              src="/pic/卡背.png"
              alt="卡背"
              className="reading-card-back-img"
            />
          </div>

          <div className="card-face card-back">
            <CardImage card={card} />
          </div>
        </div>
      </div>

      {showInfo ? (
        <div className="card-info-panel card-info-enter">
          <h3>{card.name}</h3>
          <div className="card-en">{card.nameEn}</div>
          <p className="card-meaning">{card.meaning}</p>
          <div className="card-keywords">
            {card.keywords.map((kw) => (
              <span key={kw} className="card-keyword-tag">{kw}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-info-placeholder" />
      )}
    </div>
  );
}
