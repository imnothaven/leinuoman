import { useState, useEffect } from "react";
import { getHistory, deleteHistoryEntry, clearHistory } from "../utils/storage";
import ReadingPanel from "./ReadingPanel";
import CardImage from "./CardImage";

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  function refreshHistory() {
    setHistory(getHistory());
  }

  function handleDelete(id, e) {
    e.stopPropagation();
    deleteHistoryEntry(id);
    if (selectedId === id) setSelectedId(null);
    refreshHistory();
  }

  function handleClearAll() {
    clearHistory();
    setSelectedId(null);
    refreshHistory();
  }

  const selectedEntry = history.find((h) => h.id === selectedId);

  if (selectedEntry) {
    return (
      <div className="history-detail">
        <div className="history-detail-back">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedId(null)}>
            返回列表
          </button>
        </div>

        <div className="history-detail-question">
          {selectedEntry.question || "（无记录问题）"}
        </div>

        <div className="history-detail-date">
          {formatDate(selectedEntry.timestamp)}
        </div>

        <ReadingPanel
          reading={selectedEntry.reading}
          summary={selectedEntry.summary}
          question={selectedEntry.question}
          isHistory={true}
          showReadingEntries={false}
        />
      </div>
    );
  }

  return (
    <div className="history-panel">
      {history.length > 0 && (
        <div className="history-toolbar">
          <button type="button" className="btn btn-outline btn-sm" onClick={handleClearAll}>
            清空所有记录
          </button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="history-empty">
          <p>还没有抽牌记录</p>
          <p className="history-empty-note">完成一次抽牌解读后，记录将自动保存在这里</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="history-item"
              onClick={() => setSelectedId(entry.id)}
            >
              <div className="history-item-header">
                <span className="history-item-date">
                  {formatDate(entry.timestamp)}
                </span>
              </div>

              <div className="history-item-question">
                {entry.question || "（无记录问题）"}
              </div>

              <div className="history-item-cards">
                {entry.reading?.map((r, i) => (
                  <div key={i} className="history-card-preview">
                    <div className="history-card-position">{r.positionLabel}</div>
                    <div className="history-card-image">
                      <CardImage card={r} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="history-item-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={(e) => handleDelete(entry.id, e)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}
