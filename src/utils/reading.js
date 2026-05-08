import { SPREAD_INFO } from "../data/cards";

export function getBasicReading(cards) {
  if (!cards || cards.length === 0) {
    return [];
  }

  return cards.map((card, index) => {
    const positionInfo = SPREAD_INFO.positions[index] || SPREAD_INFO.positions[0];

    return {
      position: index + 1,
      positionLabel: positionInfo?.label || `第${index + 1}张`,
      positionDesc: positionInfo?.description || "",
      id: card.id,
      number: card.number,
      name: card.name,
      nameEn: card.nameEn || "",
      image: card.image,
      keywords: card.keywords || [],
      meaning: card.meaning || "",
    };
  });
}

export function getSpreadSummary(reading) {
  if (!reading || reading.length === 0) return null;

  const keywords = reading.flatMap((r) => r.keywords);
  const uniqueKeywords = [...new Set(keywords)];

  return {
    title: SPREAD_INFO.name,
    description: SPREAD_INFO.description,
    themes: uniqueKeywords.slice(0, 6),
    cardCount: reading.length,
  };
}
