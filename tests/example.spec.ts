import { test, expect } from '@playwright/test';

test("Click login button", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.click('text=Login');
  await expect(page).toHaveURL("http://localhost:3000/login");
});

test("Click register button", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.click('text=Sign Up');
  await expect(page).toHaveURL("http://localhost:3000/register");
});
