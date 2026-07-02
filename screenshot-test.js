const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(800);

  // 输入问题
  await page.fill('textarea[aria-label="占卜问题"]', '我这次的项目申请能成功通过吗？');
  await page.waitForTimeout(300);

  // 点击确认问题
  await page.click('button:has-text("确认问题")');
  await page.waitForTimeout(600);

  // 点击弹窗中的确认（开始抽牌）
  await page.click('button:has-text("开始抽牌")');
  await page.waitForTimeout(800);

  // 选择第一张牌（点击第一张fan card）
  await page.click('.deck-fan-card:not(:disabled):not(.fan-drawing):not(.fan-drawn)');
  await page.waitForTimeout(1200);

  // 选择第二张牌
  await page.click('.deck-fan-card:not(:disabled):not(.fan-drawing):not(.fan-drawn)');
  await page.waitForTimeout(1200);

  // 选择第三张牌
  await page.click('.deck-fan-card:not(:disabled):not(.fan-drawing):not(.fan-drawn)');
  await page.waitForTimeout(3500);

  // 截图结果页面
  await page.screenshot({ path: 'd:\\programs_finished\\雷诺曼\\result-page.png', fullPage: true });

  await browser.close();
  console.log('Screenshot saved to result-page.png');
})();
