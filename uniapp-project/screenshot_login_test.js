const { chromium } = require('playwright');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();
  
  console.log("Navigating to login page...");
  try {
    await page.goto('http://localhost:5173/#/pages/login/login', { timeout: 15000, waitUntil: 'networkidle' });
  } catch (e) {
    console.log("Navigation timeout or error, proceeding anyway.");
  }
  
  await page.waitForTimeout(2000); // Give it some time to render
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'login_test_shot.png' });
  
  await browser.close();
  console.log("Done!");
})();
