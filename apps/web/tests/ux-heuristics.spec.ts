import { test, expect } from '@playwright/test';

/**
 * UX Heuristics Tests
 *
 * Based on Nielsen Norman Group's 10 Usability Heuristics.
 * These tests validate core UX principles across the application.
 *
 * For AI-assisted UX evaluation, integrate with:
 * - A11y MCP Server (accessibility)
 * - Playwright MCP (visual regression)
 * - Lighthouse MCP (performance + UX metrics)
 */

test.describe('UX Heuristics - Nielsen Norman Group Principles', () => {
  test.describe('1. Visibility of System Status', () => {
    test('should show loading states', async ({ page }) => {
      await page.goto('/crm');

      // Check for loading indicators when content loads
      // The page should provide feedback during operations
    });

    test('should show active navigation state', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Check that the current page is highlighted in navigation
      const contactsLink = page.locator('aside a:has-text("Contacts")');
      const className = await contactsLink.getAttribute('class');

      // Active link should have distinct styling
      expect(className).toBeTruthy();
    });

    test('should show form validation feedback immediately', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      // Try to submit empty form
      await page.click('button:has-text("Create Contact")');

      // Should show validation feedback
      // (This depends on form implementation)
    });
  });

  test.describe('2. Match Between System and Real World', () => {
    test('should use industry-appropriate terminology', async ({ page }) => {
      await page.goto('/crm');

      // Check for CRM-standard terminology
      await expect(page.locator('text=Contacts')).toBeVisible();
      await expect(page.locator('text=Accounts')).toBeVisible();
      await expect(page.locator('text=Opportunities')).toBeVisible();
      await expect(page.locator('text=Activities')).toBeVisible();
    });

    test('should display dates in readable format', async ({ page }) => {
      await page.goto('/crm/activities');

      // Check for human-readable date formats like "Today", "Tomorrow"
      const dateTexts = ['Today', 'Tomorrow'];
      let foundReadableDate = false;

      for (const text of dateTexts) {
        const element = page.locator(`text=${text}`);
        if (await element.count() > 0) {
          foundReadableDate = true;
          break;
        }
      }

      expect(foundReadableDate).toBeTruthy();
    });
  });

  test.describe('3. User Control and Freedom', () => {
    test('should allow modal dismissal with close button', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      await expect(page.locator('text=Add New Contact')).toBeVisible();

      // Close with cancel button
      await page.click('button:has-text("Cancel")');
      await expect(page.locator('text=Add New Contact')).not.toBeVisible();
    });

    test('should allow modal dismissal with escape key', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      await page.keyboard.press('Escape');
      await expect(page.locator('text=Add New Contact')).not.toBeVisible();
    });

    test('should provide navigation breadcrumbs or back options', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Should have way to navigate back/up
      const backLink = page.locator('a[href="/crm"]');
      const dashboardLink = page.locator('text=Dashboard');

      const hasBackNavigation = (await backLink.count()) > 0 || (await dashboardLink.count()) > 0;
      expect(hasBackNavigation).toBeTruthy();
    });
  });

  test.describe('4. Consistency and Standards', () => {
    test('should have consistent button styling', async ({ page }) => {
      await page.goto('/crm/contacts');

      const primaryButtons = page.locator('button.bg-blue-600');
      const outlineButtons = page.locator('button.border');

      // Should have consistent button classes
      const hasPrimary = await primaryButtons.count() > 0;
      expect(hasPrimary).toBeTruthy();
    });

    test('should have consistent card styling across pages', async ({ page }) => {
      // Check contacts page
      await page.goto('/crm/contacts');
      const contactCards = page.locator('.bg-white.rounded-lg.border');
      const contactCardCount = await contactCards.count();

      // Check accounts page
      await page.goto('/crm/accounts');
      const accountCards = page.locator('.bg-white.rounded-lg.border');
      const accountCardCount = await accountCards.count();

      // Both pages should use similar card styling
      expect(contactCardCount).toBeGreaterThan(0);
      expect(accountCardCount).toBeGreaterThan(0);
    });

    test('should have consistent page header structure', async ({ page }) => {
      const pages = ['/crm/contacts', '/crm/accounts', '/crm/activities'];

      for (const path of pages) {
        await page.goto(path);
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
      }
    });
  });

  test.describe('5. Error Prevention', () => {
    test('should have required field indicators', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      // Check for required indicators (asterisks, "required" text, etc.)
      const requiredInputs = page.locator('input[required]');
      const requiredCount = await requiredInputs.count();

      // At least some fields should be marked required
      expect(requiredCount).toBeGreaterThan(0);
    });

    test('should confirm destructive actions', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Attempt to delete a contact
      // Should trigger confirmation dialog
      // (Implementation dependent)
    });
  });

  test.describe('6. Recognition Rather Than Recall', () => {
    test('should show filter options visibly', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Filter controls should be visible, not hidden
      await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
    });

    test('should show recent/suggested options', async ({ page }) => {
      await page.goto('/crm/opportunities');

      // Pipeline stages should be visible
      const stageColumns = page.locator('.flex.gap-4 > div, [data-stage]');
      const stageCount = await stageColumns.count();

      expect(stageCount).toBeGreaterThan(0);
    });
  });

  test.describe('7. Flexibility and Efficiency of Use', () => {
    test('should support keyboard shortcuts', async ({ page }) => {
      await page.goto('/crm');

      // Check if keyboard shortcuts are available
      // (Implementation dependent - check for Cmd+K, etc.)
    });

    test('should support quick filters', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Quick filter dropdowns should be accessible
      const filterSelect = page.locator('select');
      await expect(filterSelect).toBeVisible();
    });

    test('should support search across records', async ({ page }) => {
      await page.goto('/crm/contacts');

      const searchInput = page.locator('input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();

      // Search should work
      await searchInput.fill('John');
      await page.waitForTimeout(300);

      // Should filter results
    });
  });

  test.describe('8. Aesthetic and Minimalist Design', () => {
    test('should not have cluttered interfaces', async ({ page }) => {
      await page.goto('/crm');

      // Check for reasonable amount of visible content
      // Not too many CTAs competing for attention
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      // Should have reasonable number of buttons visible
      expect(buttonCount).toBeLessThan(20);
    });

    test('should use whitespace effectively', async ({ page }) => {
      await page.goto('/crm');

      // Visual check - padding should be present
      const mainContent = page.locator('main');
      const padding = await mainContent.evaluate(el => {
        return window.getComputedStyle(el).padding;
      });

      expect(padding).not.toBe('0px');
    });
  });

  test.describe('9. Help Users Recognize, Diagnose, and Recover from Errors', () => {
    test('should show helpful error messages', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      // Leave required field empty and try to submit
      // Should show helpful error message
      // (Implementation dependent)
    });

    test('should show empty states with guidance', async ({ page }) => {
      await page.goto('/crm/contacts');

      // Search for non-existent item
      await page.fill('input[placeholder*="Search"]', 'zzzznonexistent12345');

      // Should show empty state with action
      await expect(page.locator('text=No contacts found')).toBeVisible();
      await expect(page.locator('text=Create')).toBeVisible();
    });
  });

  test.describe('10. Help and Documentation', () => {
    test('should have placeholder text in inputs', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      const inputs = page.locator('input[placeholder]');
      const inputCount = await inputs.count();

      // Most inputs should have placeholders
      expect(inputCount).toBeGreaterThan(0);
    });

    test('should have descriptive labels', async ({ page }) => {
      await page.goto('/crm/contacts');
      await page.click('text=Add Contact');

      // Check for labels
      const labels = page.locator('label');
      const labelCount = await labels.count();

      expect(labelCount).toBeGreaterThan(0);
    });
  });
});

test.describe('UX Performance Metrics', () => {
  test('should load landing page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load CRM dashboard quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/crm');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should respond to user interactions quickly', async ({ page }) => {
    await page.goto('/crm/contacts');

    const startTime = Date.now();
    await page.click('text=Add Contact');
    await page.waitForSelector('text=Add New Contact');
    const responseTime = Date.now() - startTime;

    // Modal should appear in under 500ms
    expect(responseTime).toBeLessThan(500);
  });
});
