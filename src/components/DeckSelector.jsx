import { useState, useEffect, useRef, useCallback } from "react";
import { shuffleDeck } from "../utils/deck";
import { CARDS } from "../data/cards";

export default function DeckSelector({ onSelectComplete, selectedCount = 3 }) {
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [pendingId, setPendingId] = useState(null);
  const [drawingId, setDrawingId] = useState(null);
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
    if (drawingId) return;
    if (drawn.length >= selectedCount) return;
    if (drawn.some((d) => d.id === card.id)) return;

    if (pendingId === card.id) {
      // 第二次点击同一张牌 → 确认选中
      setPendingId(null);
      setDrawingId(card.id);

      const newDrawn = [...drawn, card];

      setTimeout(() => {
        setDrawn(newDrawn);
        setDrawingId(null);

        if (newDrawn.length === selectedCount) {
          setTimeout(() => {
            onSelectComplete(newDrawn);
          }, 400);
        }
      }, 200);
    } else {
      // 第一次点击 → 标记 pending
      setPendingId(card.id);
    }
  };

  const handleReshuffle = () => {
    setDrawn([]);
    setPendingId(null);
    setDrawingId(null);
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
                const isDrawn = drawn.some((d) => d.id === card.id);
                const isDrawing = drawingId === card.id;
                const isPending = pendingId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`deck-fan-card ${isPending ? "fan-pending" : ""} ${isDrawing ? "fan-drawing" : ""} ${isDrawn ? "fan-drawn" : ""}`}
                    onClick={() => handleCardClick(card)}
                    disabled={isDrawn || Boolean(drawingId) || drawn.length >= selectedCount}
                    aria-pressed={isPending}
                    aria-label={`选择第 ${num} 张牌`}
                    style={{
                      width: `${cardW}px`,
                      aspectRatio: "824 / 1332",
                      marginRight: i < row.length - 1 ? `-${overlap}px` : "0",
                      zIndex: isPending ? 200 : i,
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
