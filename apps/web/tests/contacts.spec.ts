import { test, expect } from '@playwright/test';

test.describe('Contacts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/contacts');
  });

  test('should display contacts page header', async ({ page }) => {
    await expect(page.locator('h1:has-text("Contacts")')).toBeVisible();
    await expect(page.locator('text=Add Contact')).toBeVisible();
  });

  test('should display contact cards', async ({ page }) => {
    // Check for mock contacts
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=Sarah Johnson')).toBeVisible();
  });

  test('should filter contacts by search', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'John');

    // Should show matching contacts
    await expect(page.locator('text=John Smith')).toBeVisible();

    // Should not show non-matching contacts
    await expect(page.locator('text=Sarah Johnson')).not.toBeVisible();
  });

  test('should filter contacts by status', async ({ page }) => {
    // Select CUSTOMER status
    await page.selectOption('select', 'CUSTOMER');

    // Should show customer contacts
    await expect(page.locator('text=John Smith')).toBeVisible();

    // Should not show prospect contacts
    await expect(page.locator('text=Sarah Johnson')).not.toBeVisible();
  });

  test('should open create contact modal', async ({ page }) => {
    await page.click('text=Add Contact');

    await expect(page.locator('text=Add New Contact')).toBeVisible();
    await expect(page.locator('input[placeholder="John"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Smith"]')).toBeVisible();
  });

  test('should close create modal on cancel', async ({ page }) => {
    await page.click('text=Add Contact');
    await expect(page.locator('text=Add New Contact')).toBeVisible();

    await page.click('button:has-text("Cancel")');

    await expect(page.locator('text=Add New Contact')).not.toBeVisible();
  });

  test('should open contact detail modal on card click', async ({ page }) => {
    await page.click('text=John Smith');

    // Should show contact details
    await expect(page.locator('text=john.smith@example.com')).toBeVisible();
    await expect(page.locator('text=Property Manager')).toBeVisible();
  });

  test('should display import/export buttons', async ({ page }) => {
    await expect(page.locator('text=Import')).toBeVisible();
    await expect(page.locator('text=Export')).toBeVisible();
  });
});
