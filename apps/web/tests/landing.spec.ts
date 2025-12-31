import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the landing page with hero section', async ({ page }) => {
    await page.goto('/');

    // Check for logo/title
    await expect(page.locator('text=CRM SaaS')).toBeVisible();

    // Check for hero content
    await expect(page.locator('h1')).toContainText('CRM That Adapts');
    await expect(page.locator('text=Your Industry')).toBeVisible();

    // Check for CTA buttons
    await expect(page.locator('text=Start Free Trial')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('should display industry templates section', async ({ page }) => {
    await page.goto('/');

    // Check for templates section
    await expect(page.locator('text=8 Industry Templates')).toBeVisible();

    // Check for template cards
    await expect(page.locator('text=Project-Based')).toBeVisible();
    await expect(page.locator('text=Sales-Focused')).toBeVisible();
    await expect(page.locator('text=Service-Based')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Check for features
    await expect(page.locator('text=Contact Management')).toBeVisible();
    await expect(page.locator('text=Pipeline Management')).toBeVisible();
    await expect(page.locator('text=Module System')).toBeVisible();
  });

  test('should navigate to onboarding page', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Start Free Trial');

    await expect(page).toHaveURL('/onboard');
    await expect(page.locator('text=What best describes your business')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Sign In');

    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });
});
