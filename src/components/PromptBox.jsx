import { useState, useCallback } from "react";

const BASIC_PROMPT = `你是一位专业的雷诺曼占卜师。请根据我提供的三张牌和问题，进行快速、直观的解读。

【牌阵与问题】
*   过去：{card1}
*   现在：{card2}
*   未来：{card3}
*   询问的问题：{question}

【解读要求】
1.  分点解读：请严格按照"过去"、"现在"、"未来"的顺序，分别解读每张牌在对应时间位置上的核心含义。
2.  联系问题：在解读每张牌时，请直接关联我所询问的问题，说明这张牌如何反映该时间段内与问题相关的情况。
3.  核心结论：最后，用1-2句话总结三张牌串联起来后，关于我问题的整体启示或趋势。
4.  语言风格：请使用清晰、肯定、易于理解的口语化语言，避免过度玄学或模糊的表述。

请开始你的解读。`;

const DEEP_PROMPT = `你是一位经验丰富的资深雷诺曼占卜分析师，擅长结合牌意、牌阵理论和现实逻辑进行深度解读。请根据以下信息，为我进行一次全面的占卜分析。

【占卜信息】
*   牌阵：时间流牌阵（过去-现在-未来）
*   抽牌结果：
    *   过去位：{card1}
    *   现在位：{card2}
    *   未来位：{card3}
*   询问问题：{question}
*   本次解读重点：我希望了解问题背后的能量流动、潜在影响因素以及可行的行动方向。

【解读框架与要求】
请你按照以下结构进行解读：

第一部分：牌意基础与位置分析
1.  分别阐述过去、现在、未来三张牌在雷诺曼体系中的核心象征意义。
2.  结合"时间流"牌阵的特性，分析每张牌在其所处时间位置上的特殊解读角度（例如，"过去"牌如何奠定了基础或遗留了影响；"现在"牌如何描述当前的核心状态与挑战/机遇；"未来"牌如何预示发展趋势）。

第二部分：针对问题的深度解读
1.  脉络串联：分析三张牌之间的能量流动与逻辑关系。过去如何导致了现在？现在正在如何塑造未来？牌与牌之间是支持、矛盾还是转化关系？
2.  问题聚焦：将上述分析聚焦到我提出的具体问题上，深入解读：
    *   问题产生的可能根源（结合过去牌）。
    *   当前局面的关键点与你的真实处境（结合现在牌）。
    *   未来可能出现的结果、机遇或警告（结合未来牌）。
3.  潜在影响因素：根据牌面组合，提示可能涉及但未被你直接提及的外部因素或内心状态。

第三部分：综合启示与建议
1.  核心启示：总结本次占卜关于你问题的最核心洞察。
2.  行动建议：基于牌面能量，提供1-3条具体、可操作的建议或思考方向。建议应积极、建设性，并贴合牌意指引（例如，若出现"锚"牌，可建议"巩固基础"；若出现"道路"牌，可建议"明确选择"）。
3.  最后提醒：以一句中立、鼓励的话语作为结束，强调个人的能动性。

语言风格：请使用专业、温和、富有洞察力的语调，分析要有理有据，避免武断或恐吓性言辞。`;

function buildPrompt(template, cards, question) {
  return template
    .replace("{card1}", cards[0]?.name || "")
    .replace("{card2}", cards[1]?.name || "")
    .replace("{card3}", cards[2]?.name || "")
    .replace("{question}", question || "");
}

export default function PromptBox({ cards, question }) {
  const [mode, setMode] = useState("basic");
  const [copied, setCopied] = useState(false);

  const promptText = buildPrompt(
    mode === "basic" ? BASIC_PROMPT : DEEP_PROMPT,
    cards,
    question
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = promptText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [promptText]);

  return (
    <div className="prompt-box">
      <div className="prompt-box-header">
        <h3>复制提示词给 AI 解读</h3>
        <p>选择解读模式后，一键复制提示词发送到任意 AI 工具获取深度分析</p>
      </div>

      <div className="prompt-mode-tabs">
        <button
          type="button"
          className={mode === "basic" ? "active" : ""}
          onClick={() => setMode("basic")}
        >
          基础解读
        </button>
        <button
          type="button"
          className={mode === "deep" ? "active" : ""}
          onClick={() => setMode("deep")}
        >
          深入解读
        </button>
      </div>

      <p className="prompt-mode-tip">基础解读适合快速获取直觉指引；深入解读适合重要决策前的全面分析</p>

      <div className="prompt-textarea-wrapper">
        <textarea
          readOnly
          value={promptText}
          aria-label="AI 提示词"
          rows={10}
        />
      </div>

      <div className="prompt-char-count">
        共 {promptText.length} 字
      </div>

      <div className="prompt-actions">
        <button
          type="button"
          className={`btn btn-primary ${copied ? "copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "已复制！" : "一键复制提示词"}
        </button>
      </div>
    </div>
  );
}
