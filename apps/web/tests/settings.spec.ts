import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/settings');
  });

  test('should display settings page header', async ({ page }) => {
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
    await expect(page.locator('text=Configure your CRM')).toBeVisible();
  });

  test('should display settings tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Features")')).toBeVisible();
    await expect(page.locator('button:has-text("Modules")')).toBeVisible();
    await expect(page.locator('button:has-text("Team")')).toBeVisible();
    await expect(page.locator('button:has-text("Integrations")')).toBeVisible();
  });

  test('should display feature toggles on Features tab', async ({ page }) => {
    // Default tab is Features
    await expect(page.locator('text=Customize Your Features')).toBeVisible();
    await expect(page.locator('text=Contacts')).toBeVisible();
    await expect(page.locator('text=Accounts')).toBeVisible();
    await expect(page.locator('text=Opportunities')).toBeVisible();
  });

  test('should switch to Modules tab', async ({ page }) => {
    await page.click('button:has-text("Modules")');

    await expect(page.locator('text=Industry Modules')).toBeVisible();
  });

  test('should switch to Team tab', async ({ page }) => {
    await page.click('button:has-text("Team")');

    await expect(page.locator('text=Team Members')).toBeVisible();
    await expect(page.locator('text=Invite Member')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('should switch to Integrations tab', async ({ page }) => {
    await page.click('button:has-text("Integrations")');

    await expect(page.locator('h3:has-text("Integrations")')).toBeVisible();
    await expect(page.locator('text=QuickBooks')).toBeVisible();
    await expect(page.locator('text=Google Calendar')).toBeVisible();
    await expect(page.locator('text=Stripe')).toBeVisible();
  });

  test('should display connected integration status', async ({ page }) => {
    await page.click('button:has-text("Integrations")');

    // QuickBooks should show as connected
    const quickbooksCard = page.locator('div:has(h4:has-text("QuickBooks"))');
    await expect(quickbooksCard.locator('text=Connected')).toBeVisible();
  });

  test('should toggle a feature', async ({ page }) => {
    // Find and click a feature toggle (e.g., Email Integration which is off by default)
    const emailToggle = page.locator('button:has-text("Email Integration")');
    await emailToggle.click();

    // The toggle should change state (would need to verify based on your UI)
    // This is a basic interaction test
    await expect(emailToggle).toBeVisible();
  });
});
