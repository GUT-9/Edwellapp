const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  
  // Capture unhandled page errors
  page.on('pageerror', exception => {
    console.log(`[BROWSER ERROR] Uncaught exception: "${exception}"`);
  });

  console.log('Navigating to index...');
  await page.goto('http://localhost:5173/#/pages/index/index', { waitUntil: 'networkidle' });
  
  console.log('Wait 2s...');
  await page.waitForTimeout(2000);
  
  // Click on library tab
  console.log('Navigating to library...');
  await page.goto('http://localhost:5173/#/pages/library/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on some categories if present
  console.log('Clicking on categories...');
  const categoryButtons = await page.$$('.bg-slate-100');
  if (categoryButtons.length > 0) {
      await categoryButtons[0].click();
      await page.waitForTimeout(1000);
  }

  // Click on a resource to go to detail
  console.log('Clicking on a resource...');
  const resources = await page.$$('.bg-white.rounded-2xl');
  if (resources.length > 0) {
      await resources[0].click();
      await page.waitForTimeout(2000);
  }

  // Try to upload
  console.log('Navigating to upload...');
  await page.goto('http://localhost:5173/#/pages/upload/upload', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Closing browser...');
  await browser.close();
})();
