import { test, expect } from '@playwright/test';

test.describe('Opportunities Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/opportunities');
  });

  test('should display opportunities page header', async ({ page }) => {
    await expect(page.locator('h1:has-text("Opportunities")')).toBeVisible();
    await expect(page.locator('text=Add Opportunity')).toBeVisible();
  });

  test('should display pipeline board', async ({ page }) => {
    // Check for pipeline stages
    await expect(page.locator('text=Lead')).toBeVisible();
    await expect(page.locator('text=Site Visit Scheduled')).toBeVisible();
    await expect(page.locator('text=Estimate Prepared')).toBeVisible();
  });

  test('should display opportunity cards on the board', async ({ page }) => {
    await expect(page.locator('text=Smith Residence Roof Replacement')).toBeVisible();
    await expect(page.locator('text=Johnson Commercial Roofing')).toBeVisible();
  });

  test('should show opportunity amounts', async ({ page }) => {
    await expect(page.locator('text=$15,000')).toBeVisible();
    await expect(page.locator('text=$85,000')).toBeVisible();
  });

  test('should toggle between board and list view', async ({ page }) => {
    // Default is board view
    await expect(page.locator('text=Lead')).toBeVisible();

    // Click list view button (second button in view toggle)
    await page.click('button:has([class*="lucide-list"])');

    // Should show table headers
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Stage")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();
  });

  test('should open create opportunity modal', async ({ page }) => {
    await page.click('text=Add Opportunity');

    await expect(page.locator('text=Add New Opportunity')).toBeVisible();
    await expect(page.locator('input[placeholder*="Smith Residence"]')).toBeVisible();
  });

  test('should open opportunity detail modal on card click', async ({ page }) => {
    await page.click('text=Smith Residence Roof Replacement');

    // Should show opportunity details
    await expect(page.locator('text=$15,000')).toBeVisible();
    await expect(page.locator('text=70%')).toBeVisible();
    await expect(page.locator('text=Mark as Won')).toBeVisible();
  });

  test('should show stage statistics', async ({ page }) => {
    // Each stage column should show count
    const leadColumn = page.locator('div:has(h3:has-text("Lead"))');
    await expect(leadColumn.locator('text=/\\d/')).toBeVisible();
  });
});
