import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 *
 * These tests capture screenshots of key pages and compare them
 * against baseline images to detect unintended visual changes.
 *
 * Run `pnpm test --update-snapshots` to update baseline images.
 */

test.describe('Visual Regression Tests', () => {
  test.describe('Landing Page', () => {
    test('landing page hero section matches snapshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take screenshot of hero section
      await expect(page.locator('section').first()).toHaveScreenshot('landing-hero.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('landing page full page matches snapshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('landing-full.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });

    test('landing page templates section matches snapshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const templatesSection = page.locator('text=8 Industry Templates, 20 NAICS Sectors').locator('..');
      await expect(templatesSection).toHaveScreenshot('landing-templates.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Onboarding Page', () => {
    test('onboarding template selection matches snapshot', async ({ page }) => {
      await page.goto('/onboard');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('onboarding-step1.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('CRM Dashboard', () => {
    test('dashboard layout matches snapshot', async ({ page }) => {
      await page.goto('/crm');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('crm-dashboard.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('sidebar navigation matches snapshot', async ({ page }) => {
      await page.goto('/crm');
      await page.waitForLoadState('networkidle');

      const sidebar = page.locator('aside');
      await expect(sidebar).toHaveScreenshot('crm-sidebar.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Contacts Page', () => {
    test('contacts list matches snapshot', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('contacts-list.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('contact card matches snapshot', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.waitForLoadState('networkidle');

      const firstCard = page.locator('.grid > div').first();
      await expect(firstCard).toHaveScreenshot('contact-card.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('create contact modal matches snapshot', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.waitForLoadState('networkidle');

      await page.click('text=Add Contact');
      await page.waitForTimeout(300); // Wait for animation

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toHaveScreenshot('contact-create-modal.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Accounts Page', () => {
    test('accounts list matches snapshot', async ({ page }) => {
      await page.goto('/crm/accounts');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('accounts-list.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('account card matches snapshot', async ({ page }) => {
      await page.goto('/crm/accounts');
      await page.waitForLoadState('networkidle');

      const firstCard = page.locator('.grid > div').first();
      await expect(firstCard).toHaveScreenshot('account-card.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Opportunities Page', () => {
    test('pipeline board matches snapshot', async ({ page }) => {
      await page.goto('/crm/opportunities');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('opportunities-board.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('opportunity card matches snapshot', async ({ page }) => {
      await page.goto('/crm/opportunities');
      await page.waitForLoadState('networkidle');

      const firstCard = page.locator('.bg-white.rounded-lg.shadow-sm.border').first();
      await expect(firstCard).toHaveScreenshot('opportunity-card.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Activities Page', () => {
    test('activities list matches snapshot', async ({ page }) => {
      await page.goto('/crm/activities');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('activities-list.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('activity item matches snapshot', async ({ page }) => {
      await page.goto('/crm/activities');
      await page.waitForLoadState('networkidle');

      const firstActivity = page.locator('.bg-white.rounded-lg.border').first();
      await expect(firstActivity).toHaveScreenshot('activity-item.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Settings Page', () => {
    test('settings page matches snapshot', async ({ page }) => {
      await page.goto('/crm/settings');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('settings-page.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Responsive Design', () => {
    test('landing page mobile view matches snapshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('landing-mobile.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });

    test('crm dashboard tablet view matches snapshot', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto('/crm');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('crm-tablet.png', {
        maxDiffPixelRatio: 0.02,
      });
    });

    test('contacts mobile view matches snapshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
      await page.goto('/crm/contacts');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('contacts-mobile.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });
});
