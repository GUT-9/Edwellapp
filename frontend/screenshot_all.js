const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();
  
  // Login first to get a token if necessary
  // Wait, the dev server might be running without token on index, but let's just go straight to them.
  console.log("Screenshotting Index...");
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_index.png' });
  
  console.log("Screenshotting Library...");
  await page.goto('http://localhost:5173/#/pages/library/library');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_library.png' });

  console.log("Screenshotting Profile...");
  await page.goto('http://localhost:5173/#/pages/profile/profile');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_profile.png' });

  // Detail
  console.log("Screenshotting Detail...");
  await page.goto('http://localhost:5173/#/pages/detail/detail?id=res-mock-1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_detail.png' });

  await browser.close();
  console.log("Screenshots done.");
})();
