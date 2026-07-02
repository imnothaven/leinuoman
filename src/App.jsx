import { useState, useEffect } from "react";
import { createSpread } from "./utils/deck";
import { getBasicReading, getSpreadSummary } from "./utils/reading";
import { saveReading } from "./utils/storage";

import ErrorBoundary from "./components/ErrorBoundary";
import CardGrid from "./components/CardGrid";
import ControlPanel from "./components/ControlPanel";
import ConfirmModal from "./components/ConfirmModal";
import HistoryPanel from "./components/HistoryPanel";
import DeckSelector from "./components/DeckSelector";
import PromptBox from "./components/PromptBox";

const TABS = [
  { key: "draw", label: "抽牌解读", desc: "写下问题并抽取三张雷诺曼牌" },
  { key: "history", label: "历史记录", desc: "查看已保存的抽牌解读" },
];

export default function App() {
  const [tab, setTab] = useState("draw");
  const [question, setQuestion] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [phase, setPhase] = useState("input"); // "input" | "select" | "result"
  const [transitioning, setTransitioning] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  function handleConfirmClick() {
    if (!question.trim()) return;
    setShowModal(true);
  }

  function handleStartSelect() {
    setShowModal(false);
    setConfirmed(true);
    setPhase("select");
    setTransitioning(false);
  }

  function handleSelectComplete(selectedCards) {
    try {
      const spread = createSpread(selectedCards);
      setCards(spread);
      setTransitioning(true);
      setShowPrompt(false);
      setTimeout(() => {
        setPhase("result");
        setTransitioning(false);
      }, 520);
    } catch (e) {
      console.error("选牌出错:", e);
    }
  }

  // 当 cards 变化时保存记录
  useEffect(() => {
    if (cards.length === 3 && phase === "result") {
      try {
        const reading = getBasicReading(cards);
        const summary = getSpreadSummary(reading);

        saveReading({
          question,
          spread: { type: "three", name: summary.title },
          cards: cards,
          reading,
          summary,
        });
      } catch (e) {
        console.error("保存记录出错:", e);
      }
    }
  }, [cards, phase, question]);

  // 当结果显示时（包括从历史记录切回），等三张牌的翻牌和基础解读
  // 小框都完整出现后再显示 AI 解读提示词框。
  // 翻牌+基础解读同时开始：scaleDelay(0/200/400) + softRise(360)，
  // 最后一张小框在 760ms 完成；最后一张翻牌在 1400ms 完成。
  useEffect(() => {
    if (phase === "result" && tab === "draw") {
      const timer = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(timer);
    }
    setShowPrompt(false);
  }, [phase, tab]);

  function handleReset() {
    setCards([]);
    setConfirmed(false);
    setQuestion("");
    setPhase("input");
    setTransitioning(false);
    setShowPrompt(false);
  }

  // 安全计算 reading 和 summary
  const reading = cards.length > 0 ? (() => {
    try {
      return getBasicReading(cards);
    } catch (e) {
      return [];
    }
  })() : [];

  const summary = reading.length > 0 ? (() => {
    try {
      return getSpreadSummary(reading);
    } catch (e) {
      return { title: "", themes: [] };
    }
  })() : { title: "", themes: [] };

  const cardsDrawn = cards.length > 0;

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <h1>雷诺曼占卜</h1>
          <p className="subtitle">Le Normand · 三牌阵</p>
        </header>

        <nav className="app-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? "active" : ""}
              aria-current={tab === t.key ? "page" : undefined}
              aria-label={t.desc}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "draw" && (
          <>
            <ControlPanel
              question={question}
              setQuestion={setQuestion}
              onConfirm={handleConfirmClick}
              onReset={handleReset}
              confirmed={confirmed}
              cardsDrawn={cardsDrawn}
            />

            {phase === "select" && (
              <div className={transitioning ? "fade-out" : "fade-in"}>
                <DeckSelector onSelectComplete={handleSelectComplete} />
              </div>
            )}

            {phase === "result" && (
              <div className="fade-in">
                <CardGrid cards={cards} />
                {showPrompt && <PromptBox cards={cards} question={question} />}
              </div>
            )}
          </>
        )}

        {tab === "history" && <HistoryPanel />}

        {showModal && (
          <ConfirmModal
            question={question}
            onConfirm={handleStartSelect}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
