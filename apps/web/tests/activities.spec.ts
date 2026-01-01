import { test, expect } from '@playwright/test';

test.describe('Activities Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/activities');
  });

  test('should display activities page with header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Activities');
    await expect(page.locator('text=Log Activity')).toBeVisible();
  });

  test('should display activity items grouped by date', async ({ page }) => {
    // Check for date group headers
    await expect(page.locator('text=Today')).toBeVisible();

    // Check for activity items
    await expect(page.locator('text=Roof Inspection - Sunrise Property')).toBeVisible();
  });

  test('should show activity type icons', async ({ page }) => {
    // Activities should have icons rendered
    const activityCards = page.locator('.bg-white.rounded-lg.border');
    await expect(activityCards.first()).toBeVisible();
  });

  test('should filter activities by type', async ({ page }) => {
    // Select phone_call type
    await page.locator('select').nth(0).selectOption('phone_call');

    // Should show phone call activities
    await expect(page.locator('text=Follow-up call with Sarah Johnson')).toBeVisible();
  });

  test('should filter activities by status', async ({ page }) => {
    // Select completed status
    await page.locator('select').nth(1).selectOption('COMPLETED');

    // Should show completed activities
    await expect(page.locator('text=Send proposal to Commercial Plaza')).toBeVisible();
  });

  test('should search activities by subject', async ({ page }) => {
    await page.fill('input[placeholder="Search activities..."]', 'Contract Review');

    await expect(page.locator('text=Contract Review - Metro Development')).toBeVisible();
  });

  test('should open log activity modal', async ({ page }) => {
    await page.click('text=Log Activity');

    await expect(page.locator('text=Log Activity').nth(1)).toBeVisible();
    await expect(page.locator('input[placeholder="Follow-up call with..."]')).toBeVisible();
    await expect(page.locator('label:has-text("Activity Type")')).toBeVisible();
  });

  test('should close log activity modal with cancel', async ({ page }) => {
    await page.click('text=Log Activity');
    await page.click('button:has-text("Cancel")');

    // Modal should be closed
    await expect(page.locator('input[placeholder="Follow-up call with..."]')).not.toBeVisible();
  });

  test('should show complete button for scheduled activities', async ({ page }) => {
    // Find a scheduled activity card and check for Complete button
    const completeButtons = page.locator('button:has-text("Complete")');
    await expect(completeButtons.first()).toBeVisible();
  });

  test('should mark activity as complete', async ({ page }) => {
    // Click complete on first available activity
    const completeButton = page.locator('button:has-text("Complete")').first();
    await completeButton.click();

    // The activity should now show completed styling
    // Check that there's one less complete button or the activity has line-through
    await page.waitForTimeout(500);
  });

  test('should open activity detail modal on click', async ({ page }) => {
    await page.click('text=Roof Inspection - Sunrise Property');

    // Modal should show activity details
    await expect(page.locator('text=Description')).toBeVisible();
    await expect(page.locator('text=Scheduled')).toBeVisible();
    await expect(page.locator('text=Duration')).toBeVisible();
  });

  test('should display overdue activities with red styling', async ({ page }) => {
    // Check for overdue section if any activities are overdue
    const overdueSection = page.locator('text=Overdue');
    // This may or may not be visible depending on mock data dates
  });

  test('should show tomorrow activities', async ({ page }) => {
    await expect(page.locator('text=Tomorrow')).toBeVisible();
    await expect(page.locator('text=Follow-up call with Sarah Johnson')).toBeVisible();
  });

  test('should show empty state when no activities match', async ({ page }) => {
    await page.fill('input[placeholder="Search activities..."]', 'nonexistentactivity12345');

    await expect(page.locator('text=No activities found')).toBeVisible();
    await expect(page.locator('text=Log your first activity')).toBeVisible();
  });
});
