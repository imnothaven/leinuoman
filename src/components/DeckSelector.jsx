import { useState, useEffect, useRef, useCallback } from "react";
import { shuffleDeck } from "../utils/deck";
import { CARDS } from "../data/cards";

export default function DeckSelector({ onSelectComplete, selectedCount = 3 }) {
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [layout, setLayout] = useState({ cardW: 100, overlap: 58, perRow: 12 });
  const fanRef = useRef(null);

  useEffect(() => {
    setShuffledDeck(shuffleDeck(CARDS));
  }, []);

  const calcLayout = useCallback(() => {
    if (!fanRef.current) return;
    const containerW = fanRef.current.clientWidth;
    const cardW = Math.max(90, Math.min(130, Math.round(containerW / 5.5)));
    const overlap = Math.round(cardW * 0.56);
    const visible = cardW - overlap;
    const perRow = Math.max(4, Math.floor((containerW - overlap) / visible));
    setLayout((current) => {
      if (
        current.cardW === cardW &&
        current.overlap === overlap &&
        current.perRow === perRow
      ) {
        return current;
      }

      return { cardW, overlap, perRow };
    });
  }, []);

  useEffect(() => {
    calcLayout();
    if (!fanRef.current || typeof ResizeObserver === "undefined") {
      const onResize = () => calcLayout();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new ResizeObserver(() => calcLayout());
    observer.observe(fanRef.current);
    return () => observer.disconnect();
  }, [calcLayout]);

  const { cardW, overlap, perRow } = layout;
  const total = shuffledDeck.length;

  // 计算更均衡的行数和每排数量
  let rowsCount = Math.ceil(total / perRow);
  let adjustedPerRow = Math.ceil(total / rowsCount);

  // 确保每排数量不会相差超过1
  const rows = [];
  let remaining = total;
  for (let i = 0; i < rowsCount; i++) {
    const currentRowCount = Math.min(adjustedPerRow, remaining);
    const start = total - remaining;
    rows.push(shuffledDeck.slice(start, start + currentRowCount));
    remaining -= currentRowCount;
  }

  let globalIndex = 0;

  const handleCardClick = (card) => {
    const alreadyDrawn = drawn.some((d) => d.id === card.id);

    if (alreadyDrawn) {
      // Deselect: remove from drawn
      setDrawn((prev) => prev.filter((d) => d.id !== card.id));
      return;
    }

    // Select: add to drawn if under limit
    if (drawn.length < selectedCount) {
      const newDrawn = [...drawn, card];
      setDrawn(newDrawn);

      // Auto-confirm when reaching the target count
      if (newDrawn.length === selectedCount) {
        onSelectComplete(newDrawn);
      }
    }
  };

  const handleReshuffle = () => {
    setDrawn([]);
    setShuffledDeck(shuffleDeck(CARDS));
  };

  return (
    <div className="deck-selector">
      <div className="deck-header">
        <h2>选择 {selectedCount} 张牌</h2>
        <p className="deck-progress">
          已选: {drawn.length} / {selectedCount}
        </p>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleReshuffle}>
          重新洗牌
        </button>
      </div>

      <div className="deck-stage">
        <div className="deck-fan-area" ref={fanRef}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="deck-fan">
              {row.map((card, i) => {
                const num = globalIndex + 1;
                globalIndex++;
                const isSelected = drawn.some((d) => d.id === card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`deck-fan-card ${isSelected ? "fan-selected" : ""}`}
                    onClick={() => handleCardClick(card)}
                    aria-pressed={isSelected}
                    aria-label={`选择第 ${num} 张牌`}
                    style={{
                      width: `${cardW}px`,
                      aspectRatio: "824 / 1332",
                      marginRight: i < row.length - 1 ? `-${overlap}px` : "0",
                      zIndex: isSelected ? 200 : i,
                    }}
                  >
                    <div className="card-face card-front deck-fan-front">
                      <img
                        src="/pic/卡背.webp"
                        alt="卡背"
                        className="deck-fan-back-img"
                      />
                      <div className="fan-card-number">{num}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {drawn.length > 0 && (
          <div className="deck-drawn-row">
            {drawn.map((card, i) => (
              <div key={card.id} className="deck-drawn-card">
                <span className="deck-drawn-label">
                  {i === 0 ? "第1张" : i === 1 ? "第2张" : "第3张"}
                </span>
                <div className="deck-drawn-preview">
                  <img
                    src="/pic/卡背.webp"
                    alt="卡背"
                    className="deck-drawn-back-img"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
