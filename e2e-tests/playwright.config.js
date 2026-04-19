require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 3000,
  expect: { timeout: 5000 },
  fullyParallel: false, // Monolithic full flow tests should run sequentially
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173/login', // Match your frontend Vite port!
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
