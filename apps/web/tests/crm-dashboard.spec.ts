import { test, expect } from '@playwright/test';

test.describe('CRM Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to CRM (would normally require auth)
    await page.goto('/crm');
  });

  test('should display dashboard with welcome message', async ({ page }) => {
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should display stat cards', async ({ page }) => {
    await expect(page.locator('text=Total Contacts')).toBeVisible();
    await expect(page.locator('text=Active Accounts')).toBeVisible();
    await expect(page.locator('text=Open Opportunities')).toBeVisible();
    await expect(page.locator('text=Pipeline Value')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Contacts')).toBeVisible();
    await expect(page.locator('text=Accounts')).toBeVisible();
    await expect(page.locator('text=Opportunities')).toBeVisible();
    await expect(page.locator('text=Activities')).toBeVisible();
  });

  test('should navigate to contacts page', async ({ page }) => {
    await page.click('text=Contacts');

    await expect(page).toHaveURL('/crm/contacts');
    await expect(page.locator('h1:has-text("Contacts")')).toBeVisible();
  });

  test('should navigate to opportunities page', async ({ page }) => {
    await page.click('text=Opportunities');

    await expect(page).toHaveURL('/crm/opportunities');
    await expect(page.locator('h1:has-text("Opportunities")')).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.click('text=Settings');

    await expect(page).toHaveURL('/crm/settings');
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
  });

  test('should display recent activity section', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=View all activities')).toBeVisible();
  });

  test('should display upcoming tasks section', async ({ page }) => {
    await expect(page.locator('text=Upcoming Tasks')).toBeVisible();
  });

  test('should display pipeline overview', async ({ page }) => {
    await expect(page.locator('text=Pipeline Overview')).toBeVisible();
    await expect(page.locator('text=View Pipeline Board')).toBeVisible();
  });
});
