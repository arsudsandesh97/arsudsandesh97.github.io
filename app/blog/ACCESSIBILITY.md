# Accessibility Checklist

- [x] **Search Input**:
  - Has `aria-label` or associated `<label>`.
  - Has `aria-controls` pointing to the grid.
- [x] **Tag Pills**:
  - Container has `role="listbox"`.
  - Pills have `role="option"` and `aria-selected` state.
  - Keyboard navigable (Tab/Enter).
- [x] **Live Region**:
  - Added `aria-live="polite"` region to announce search result counts to screen readers.
- [x] **Blog Cards**:
  - `role="link"` or wrapped in anchor.
  - `aria-label` provides context (e.g., "Read article: [Title]").
  - Focus styles are visible (`outline` on focus-visible).
- [x] **Contrast**:
  - Text colors meet WCAG AA standards against background.
  - Active tag pills have sufficient contrast.
- [x] **Motion**:
  - Framer Motion animations respect `prefers-reduced-motion`.
