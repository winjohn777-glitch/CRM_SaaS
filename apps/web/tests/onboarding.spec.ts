import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('should display onboarding wizard with step indicator', async ({ page }) => {
    await page.goto('/onboard');

    // Check step indicator
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
    await expect(page.locator('text=Business Type')).toBeVisible();
    await expect(page.locator('text=Industry')).toBeVisible();
    await expect(page.locator('text=Features')).toBeVisible();
    await expect(page.locator('text=Preview')).toBeVisible();
  });

  test('should display all 8 industry templates', async ({ page }) => {
    await page.goto('/onboard');

    // Check all templates are visible
    const templates = [
      'Project-Based',
      'Sales-Focused',
      'Service-Based',
      'Inventory-Based',
      'Asset-Based',
      'Membership-Based',
      'Hospitality',
      'Case-Based',
    ];

    for (const template of templates) {
      await expect(page.locator(`text=${template}`).first()).toBeVisible();
    }
  });

  test('should allow selecting a template and proceeding', async ({ page }) => {
    await page.goto('/onboard');

    // Select Project-Based template
    await page.click('button:has-text("Project-Based")');

    // Check it's selected (has ring class)
    const selectedButton = page.locator('button:has-text("Project-Based")');
    await expect(selectedButton).toHaveClass(/border-blue-500/);

    // Click Continue
    await page.click('button:has-text("Continue")');

    // Should be on NAICS step
    await expect(page.locator('text=Select Your Industry Sector')).toBeVisible();
  });

  test('should complete full onboarding flow', async ({ page }) => {
    await page.goto('/onboard');

    // Step 1: Select template
    await page.click('button:has-text("Project-Based")');
    await page.click('button:has-text("Continue")');

    // Step 2: Skip NAICS (optional)
    await page.click('button:has-text("Continue")');

    // Step 3: Features (keep defaults)
    await expect(page.locator('text=Customize Your Features')).toBeVisible();
    await page.click('button:has-text("Continue")');

    // Step 4: Preview
    await expect(page.locator('text=Preview Your CRM Configuration')).toBeVisible();

    // Check configuration preview
    await expect(page.locator('text=Pipelines')).toBeVisible();
    await expect(page.locator('text=Custom Fields')).toBeVisible();
    await expect(page.locator('text=Activity Types')).toBeVisible();
    await expect(page.locator('text=Modules')).toBeVisible();

    // Complete setup
    await page.click('button:has-text("Complete Setup")');

    // Should show completion
    await expect(page.locator('text=Your CRM is Ready')).toBeVisible();
    await expect(page.locator('text=Go to CRM Dashboard')).toBeVisible();
  });

  test('should allow going back through steps', async ({ page }) => {
    await page.goto('/onboard');

    // Go forward
    await page.click('button:has-text("Project-Based")');
    await page.click('button:has-text("Continue")');

    // Should be on NAICS step
    await expect(page.locator('text=Select Your Industry Sector')).toBeVisible();

    // Go back
    await page.click('button:has-text("Back")');

    // Should be back on template step
    await expect(page.locator('text=What best describes your business')).toBeVisible();
  });

  test('should show NAICS drill-down for Construction', async ({ page }) => {
    await page.goto('/onboard');

    // Select template and proceed
    await page.click('button:has-text("Project-Based")');
    await page.click('button:has-text("Continue")');

    // Click on Construction sector
    await page.click('text=23');

    // Should show subsectors
    await expect(page.locator('text=Select Your Subsector')).toBeVisible();
    await expect(page.locator('text=Construction of Buildings')).toBeVisible();
    await expect(page.locator('text=Specialty Trade Contractors')).toBeVisible();
  });
});
