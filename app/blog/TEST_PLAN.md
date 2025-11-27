# Test Plan: Blog Section

## Unit Tests

### Search & Filtering
- **Scenario**: User types in search bar.
  - **Input**: "React"
  - **Expected**: List filters to show posts containing "React" in title/excerpt/tags. Debounce delay (250ms) is respected.
- **Scenario**: User clicks a tag.
  - **Input**: Click "Next.js" pill.
  - **Expected**: List shows only posts with "Next.js" tag. Pill becomes active.
- **Scenario**: User clicks "All" tag.
  - **Input**: Click "All".
  - **Expected**: Filters reset, all posts shown.

### Empty States
- **Scenario**: Search returns no results.
  - **Input**: Search "NonExistentTerm".
  - **Expected**: `EmptyState` component renders with "No results for..." message.

### Loading States
- **Scenario**: Initial load (if client-side fetching).
  - **Expected**: `BlogGrid` renders `LoadingSkeleton` items.

## E2E Tests (Playwright/Cypress)

### Flow: Search and Navigation
1.  **Visit Blog**: Go to `/blog`.
2.  **Verify Initial State**:
    - Hero section visible.
    - Featured posts visible (if any).
    - Grid shows posts.
3.  **Search**:
    - Type "Tutorial" in search bar.
    - Wait for results to update.
    - Verify post count matches expected results.
4.  **Open Post**:
    - Click first post card.
    - Verify navigation to `/blog/[slug]`.
    - Verify URL is correct.
5.  **Back Navigation**:
    - Click "Back to Home" or browser back.
    - Verify return to `/blog`.

### Accessibility Check
- **Tab Navigation**:
  - Tab through Search -> Tags -> Blog Cards.
  - Focus indicators should be visible.
- **Screen Reader**:
  - Search input has label/placeholder.
  - Live region announces result count changes.

## Performance Tests
- **Lighthouse**: Run audit on `/blog`.
  - Target: Performance > 90, Accessibility > 90.
- **Network**:
  - Verify images are lazy-loaded (check Network tab, images below fold shouldn't load immediately).
  - Verify initial HTML contains post content (SSR).
