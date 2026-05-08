/**
 * 雷诺曼扩展接口模块
 *
 * 本模块预留了未来扩展能力的接口定义，
 * 方便后续接入高级解读、AI解读等功能。
 *
 * 使用方式：
 *   1. 实现对应的 handler 函数
 *   2. 调用 registerExtension(type, handler) 注册
 *   3. 在业务代码中通过 getExtension(type) 获取并调用
 */

const registry = new Map();

export const EXTENSION_TYPES = {
  ADVANCED_READING: "advancedReading",
  AI_READING: "aiReading",
  CARD_IMAGE_PROVIDER: "cardImageProvider",
  SPREAD_PROVIDER: "spreadProvider",
};

/**
 * @param {string} type - 扩展类型，使用 EXTENSION_TYPES 中的值
 * @param {Function} handler - 扩展处理函数
 */
export function registerExtension(type, handler) {
  if (typeof handler !== "function") {
    console.warn(`[Extension] ${type}: handler 必须是一个函数`);
    return false;
  }
  registry.set(type, handler);
  console.info(`[Extension] 已注册: ${type}`);
  return true;
}

/**
 * @param {string} type - 扩展类型
 * @returns {Function|null} 已注册的扩展处理函数
 */
export function getExtension(type) {
  return registry.get(type) || null;
}

/**
 * @param {string} type - 扩展类型
 * @returns {boolean}
 */
export function hasExtension(type) {
  return registry.has(type);
}

/**
 * 用扩展进行高级解读
 *
 * @param {Array} cards - 包含 spreadPosition 的卡牌数组
 * @param {Object} options - { question, spreadType, ... }
 * @returns {Promise<Object>} 高级解读结果
 */
export async function runAdvancedReading(cards, options = {}) {
  const handler = getExtension(EXTENSION_TYPES.ADVANCED_READING);
  if (!handler) {
    throw new Error("未注册高级解读扩展 (advancedReading)");
  }
  return handler(cards, options);
}

/**
 * 用AI进行解读
 *
 * @param {Array} cards - 卡牌数组
 * @param {Object} options - { question, model, apiKey, ... }
 * @returns {Promise<Object>} AI解读结果
 */
export async function runAIReading(cards, options = {}) {
  const handler = getExtension(EXTENSION_TYPES.AI_READING);
  if (!handler) {
    throw new Error("未注册AI解读扩展 (aiReading)");
  }
  return handler(cards, options);
}

/**
 * 注册自定义阵型
 *
 * @param {string} name - 阵型名称
 * @param {Object} spread - { name, description, positions: [{key, label, description}] }
 */
export function registerSpread(name, spread) {
  const handler = getExtension(EXTENSION_TYPES.SPREAD_PROVIDER);
  if (handler) {
    return handler("register", { name, spread });
  }
  console.warn("[Extension] 未注册阵型扩展 (spreadProvider)");
  return false;
}
