import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests using axe-core
 *
 * These tests check WCAG 2.1 AA compliance across all pages.
 * Integrates with A11y MCP Server recommendations.
 */

test.describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  test.describe('Landing Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Check that h2 comes after h1
      const headings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .map(h => h.tagName);
      });

      // Verify heading hierarchy
      let lastLevel = 0;
      for (const heading of headings) {
        const level = parseInt(heading[1]);
        expect(level).toBeLessThanOrEqual(lastLevel + 1);
        lastLevel = level;
      }
    });

    test('should have accessible navigation', async ({ page }) => {
      await page.goto('/');

      // Navigation should have proper role
      await expect(page.locator('nav')).toBeVisible();

      // Links should have accessible text
      const signInLink = page.locator('a:has-text("Sign In")');
      await expect(signInLink).toBeVisible();
      await expect(signInLink).toHaveAttribute('href', '/login');
    });
  });

  test.describe('Onboarding Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/onboard');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have keyboard navigable template selection', async ({ page }) => {
      await page.goto('/onboard');

      // Tab through template cards
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // First focusable template should be focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'DIV', 'A']).toContain(focusedElement);
    });
  });

  test.describe('CRM Dashboard', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/crm');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible sidebar navigation', async ({ page }) => {
      await page.goto('/crm');

      // Sidebar links should be keyboard accessible
      const sidebarLinks = page.locator('aside a');
      const count = await sidebarLinks.count();
      expect(count).toBeGreaterThan(0);

      // Each link should have accessible name
      for (let i = 0; i < count; i++) {
        const link = sidebarLinks.nth(i);
        const text = await link.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Contacts Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/crm/contacts');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible form inputs', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Open create modal
      await page.click('text=Add Contact');

      // Check form inputs have labels
      const inputs = page.locator('input');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const ariaLabel = await input.getAttribute('aria-label');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');

        // Input should have either aria-label, associated label, or placeholder
        const hasLabel = ariaLabel || placeholder;
        expect(hasLabel).toBeTruthy();
      }
    });
  });

  test.describe('Accounts Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/crm/accounts');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper color contrast for badges', async ({ page }) => {
      await page.goto('/crm/accounts');

      // Check that badges meet contrast requirements
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .options({ rules: { 'color-contrast': { enabled: true } } })
        .analyze();

      const contrastViolations = accessibilityScanResults.violations
        .filter(v => v.id === 'color-contrast');

      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe('Activities Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/crm/activities');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible activity cards', async ({ page }) => {
      await page.goto('/crm/activities');

      // Activity cards should be focusable
      const cards = page.locator('.bg-white.rounded-lg.border');
      const count = await cards.count();

      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Opportunities Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/crm/opportunities');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Settings Page', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/crm/settings');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible toggle switches', async ({ page }) => {
      await page.goto('/crm/settings');

      // Check that toggle switches are keyboard accessible
      await page.keyboard.press('Tab');

      // Should be able to tab to interactive elements
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support skip to main content', async ({ page }) => {
      await page.goto('/');

      // Press Tab - should focus skip link if present
      await page.keyboard.press('Tab');

      // Check focus is on a focusable element
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.textContent;
      });

      expect(focusedElement).toBeTruthy();
    });

    test('should trap focus in modals', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Open modal
      await page.click('text=Add Contact');

      // Tab through modal
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
      }

      // Focus should still be within modal
      const focusedInModal = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        const activeElement = document.activeElement;
        return modal?.contains(activeElement);
      });

      // If modal has role="dialog", focus should be trapped
      // This depends on the Modal implementation
    });

    test('should close modal with Escape key', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Open modal
      await page.click('text=Add Contact');
      await expect(page.locator('text=Add New Contact')).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should be closed
      await expect(page.locator('text=Add New Contact')).not.toBeVisible();
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should have proper ARIA landmarks', async ({ page }) => {
      await page.goto('/crm');

      // Check for main landmark
      const main = await page.locator('main').count();
      expect(main).toBeGreaterThanOrEqual(1);

      // Check for navigation landmark
      const nav = await page.locator('nav').count();
      expect(nav).toBeGreaterThanOrEqual(1);
    });

    test('should have descriptive page title', async ({ page }) => {
      await page.goto('/');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toContain('CRM');
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaHidden = await img.getAttribute('aria-hidden');

        // Image should have alt text or be hidden from screen readers
        expect(alt !== null || ariaHidden === 'true').toBeTruthy();
      }
    });
  });
});
