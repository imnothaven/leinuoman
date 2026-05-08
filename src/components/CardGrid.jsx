import ReadingCard from "./ReadingCard";

export default function CardGrid({ cards, isHistory = false }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="card-grid-container">
        <div className="card-grid-empty">
          <p>输入问题并确认后，点击「抽牌」揭开你的牌面</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {cards.map((card, i) => (
          <div key={card.id + "-" + i} className="reading-card-item">
            <ReadingCard card={card} index={i} isHistory={isHistory} />
          </div>
        ))}
      </div>
    </div>
  );
}
