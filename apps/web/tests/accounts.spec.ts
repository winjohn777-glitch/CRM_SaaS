import { test, expect } from '@playwright/test';

test.describe('Accounts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/accounts');
  });

  test('should display accounts page with header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Accounts');
    await expect(page.locator('text=Add Account')).toBeVisible();
  });

  test('should display account cards', async ({ page }) => {
    // Wait for accounts to load
    await expect(page.locator('text=Sunrise Property Management')).toBeVisible();
    await expect(page.locator('text=Commercial Plaza Inc')).toBeVisible();
    await expect(page.locator('text=Oakwood Homeowners Association')).toBeVisible();
  });

  test('should filter accounts by type', async ({ page }) => {
    // Open type filter dropdown
    await page.locator('select').nth(0).selectOption('CUSTOMER');

    // Should show customer accounts
    await expect(page.locator('text=Sunrise Property Management')).toBeVisible();

    // Should not show prospects
    await expect(page.locator('text=Commercial Plaza Inc')).not.toBeVisible();
  });

  test('should search accounts by name', async ({ page }) => {
    await page.fill('input[placeholder="Search accounts..."]', 'Metro');

    await expect(page.locator('text=Metro Development Group')).toBeVisible();
    await expect(page.locator('text=Sunrise Property Management')).not.toBeVisible();
  });

  test('should open create account modal', async ({ page }) => {
    await page.click('text=Add Account');

    await expect(page.locator('text=Add New Account')).toBeVisible();
    await expect(page.locator('input[placeholder="Acme Corporation"]')).toBeVisible();
    await expect(page.locator('input[placeholder="https://acme.com"]')).toBeVisible();
  });

  test('should close create modal with cancel button', async ({ page }) => {
    await page.click('text=Add Account');
    await expect(page.locator('text=Add New Account')).toBeVisible();

    await page.click('button:has-text("Cancel")');
    await expect(page.locator('text=Add New Account')).not.toBeVisible();
  });

  test('should open account detail modal on card click', async ({ page }) => {
    await page.click('text=Sunrise Property Management');

    // Modal should show account details
    await expect(page.locator('text=Website')).toBeVisible();
    await expect(page.locator('text=Industry')).toBeVisible();
    await expect(page.locator('text=Account Type')).toBeVisible();
  });

  test('should display account type badges correctly', async ({ page }) => {
    // Check for different account type badges
    await expect(page.locator('text=CUSTOMER').first()).toBeVisible();
    await expect(page.locator('text=PROSPECT').first()).toBeVisible();
    await expect(page.locator('text=PARTNER').first()).toBeVisible();
  });

  test('should display import and export buttons', async ({ page }) => {
    await expect(page.locator('text=Import')).toBeVisible();
    await expect(page.locator('text=Export')).toBeVisible();
  });

  test('should show empty state when no accounts match filter', async ({ page }) => {
    await page.fill('input[placeholder="Search accounts..."]', 'nonexistentaccount12345');

    await expect(page.locator('text=No accounts found')).toBeVisible();
    await expect(page.locator('text=Create your first account')).toBeVisible();
  });
});
