# CRM SaaS Test Protocols

## Overview

This document outlines the comprehensive testing strategy for the CRM SaaS application, including E2E tests, accessibility audits, visual regression testing, and UX heuristic evaluation.

## Test Categories

### 1. End-to-End (E2E) Tests

Located in `/tests/*.spec.ts`

| Test File | Coverage |
|-----------|----------|
| `landing.spec.ts` | Landing page navigation, CTAs, template display |
| `onboarding.spec.ts` | 4-step onboarding wizard flow |
| `crm-dashboard.spec.ts` | Dashboard layout, stats, recent items |
| `contacts.spec.ts` | Contact CRUD, search, filtering |
| `accounts.spec.ts` | Account CRUD, type filtering |
| `opportunities.spec.ts` | Pipeline board, drag-and-drop, stages |
| `activities.spec.ts` | Activity log, completion, filtering |
| `settings.spec.ts` | Feature toggles, module management |

### 2. Accessibility Tests (WCAG 2.1 AA)

Located in `/tests/accessibility.spec.ts`

Uses **@axe-core/playwright** for automated WCAG compliance checking.

**Checks performed:**
- Heading hierarchy
- Color contrast
- Keyboard navigation
- ARIA landmarks
- Form labels
- Focus management in modals
- Screen reader compatibility

**MCP Integration:**
```json
{
  "mcpServers": {
    "a11y": {
      "command": "npx",
      "args": ["@priyankark/a11y-mcp"],
      "env": {}
    }
  }
}
```

### 3. Visual Regression Tests

Located in `/tests/visual-regression.spec.ts`

Captures screenshots and compares against baseline images.

**Coverage:**
- Landing page (hero, templates, full page)
- Onboarding wizard
- CRM dashboard and sidebar
- Entity pages (contacts, accounts, activities, opportunities)
- Modals (create, edit, detail)
- Responsive views (mobile, tablet)

**Update baselines:**
```bash
pnpm test --update-snapshots
```

### 4. UX Heuristics Tests

Located in `/tests/ux-heuristics.spec.ts`

Based on Nielsen Norman Group's 10 Usability Heuristics:

1. **Visibility of System Status** - Loading states, active navigation
2. **Match Between System and Real World** - Industry terminology, readable dates
3. **User Control and Freedom** - Modal dismissal, back navigation
4. **Consistency and Standards** - Button styling, card layouts
5. **Error Prevention** - Required field indicators, confirmations
6. **Recognition Rather Than Recall** - Visible filters, suggestions
7. **Flexibility and Efficiency** - Keyboard shortcuts, quick filters
8. **Aesthetic and Minimalist Design** - Whitespace, clutter-free
9. **Error Recovery** - Helpful messages, empty states
10. **Help and Documentation** - Placeholders, labels

## Recommended MCP Tools for UX Evaluation

### Tier 1: Accessibility

| Tool | Purpose | Integration |
|------|---------|-------------|
| **A11y MCP Server** | WCAG compliance auditing | `@priyankark/a11y-mcp` |
| **MCP Accessibility Scanner** | Browser-based a11y scanning | `@JustasMonkev/mcp-accessibility-scanner` |
| **BrowserStack MCP** | Cross-browser a11y testing | Enterprise |

### Tier 2: Visual & Performance

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Playwright MCP** | Visual regression + AI test generation | `@playwright/test` |
| **Lighthouse MCP** | Performance, SEO, Core Web Vitals | `lighthouse-mcp` |

### Tier 3: Design Validation

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Figma MCP** | Design-to-implementation validation | `figma-mcp` |

## Running Tests

### All Tests
```bash
pnpm test
```

### Specific Test Categories
```bash
# E2E only
pnpm test tests/landing.spec.ts tests/contacts.spec.ts

# Accessibility only
pnpm test tests/accessibility.spec.ts

# Visual regression only
pnpm test tests/visual-regression.spec.ts

# UX heuristics only
pnpm test tests/ux-heuristics.spec.ts
```

### Interactive Mode
```bash
pnpm test:ui
```

### Debug Mode
```bash
pnpm test:debug
```

## CI/CD Integration

Tests run automatically on:
- Pull request creation
- Push to main branch
- Nightly scheduled runs

### GitHub Actions Workflow

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test
```

## Test Reports

Reports are generated in:
- `test-results/results.json` - JSON format
- `test-results/junit.xml` - JUnit XML
- `playwright-report/` - HTML report

View HTML report:
```bash
pnpm exec playwright show-report
```

## Quality Gates

Tests must pass before merging:

| Category | Threshold |
|----------|-----------|
| E2E Pass Rate | 100% |
| Accessibility Violations | 0 critical |
| Visual Regression | <2% diff |
| Page Load Time | <3s |
| Modal Response | <500ms |

## Adding New Tests

1. Create test file in `/tests/`
2. Follow naming convention: `*.spec.ts`
3. Use appropriate test categories
4. Add accessibility checks for new pages
5. Add visual regression snapshots for new components
6. Document in this file

## Troubleshooting

### Tests failing locally but passing in CI
- Check Node/pnpm versions match
- Run `pnpm exec playwright install`
- Clear `.next` cache

### Visual regression false positives
- Update snapshots: `pnpm test --update-snapshots`
- Increase `maxDiffPixelRatio` threshold
- Ensure consistent viewport sizes

### Accessibility violations
- Check axe-core rules documentation
- Use browser devtools accessibility panel
- Run A11y MCP for detailed guidance
