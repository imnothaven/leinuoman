import { CARDS, SPREAD_POSITIONS, SPREAD_INFO } from "../data/cards";

export function shuffleDeck(deck = CARDS) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function drawCards(count = 3, deck = CARDS) {
  return shuffleDeck(deck).slice(0, count);
}

export function createSpread(cards, spreadType = "three") {
  if (!cards || cards.length !== 3) {
    throw new Error("三牌阵需要恰好3张牌");
  }

  const positions = SPREAD_INFO.positions;
  return cards.map((card, i) => ({
    ...card,
    spreadPosition: positions[i].key,
    spreadLabel: positions[i].label,
    spreadDescription: positions[i].description,
    order: i + 1,
  }));
}
