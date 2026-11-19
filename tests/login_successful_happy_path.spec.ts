import { test, expect } from '@playwright/test';

test.describe('ZincBank Login - Successful Login (Happy Path)', () => {
  test('Valid credentials allow user to log in and reach the dashboard', async ({ page }) => {
    // 1. Verify the login page loads and displays the email and password fields, and a Login button
    await page.goto('https://zincbank.cydeo.io/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // 2. Enter Email: student01@zinc.test
    await page.fill('input[type="email"]', 'student01@zinc.test');

    // 3. Enter Password: 9pJolA7GBQec
    await page.fill('input[type="password"]', '9pJolA7GBQec');

    // 4. Click the Login button
    await page.click('button:has-text("Sign in")');

    // 5. Wait for navigation to complete and verify successful login
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });
    // The dashboard shows a "Welcome, Student" heading (level 1) that is present only after a
    // successful login. Use a resilient regex so the assertion does not break on the student name.
    await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();
  });
});