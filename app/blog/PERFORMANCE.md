# Performance Strategy: Blog Section

## Loading Strategy

1.  **Server-Side Rendering (SSR)**:
    - Initial page load (`/blog`) fetches the first batch of posts (e.g., 100) and tags on the server.
    - This ensures the HTML is populated immediately, providing a fast First Contentful Paint (FCP) and good SEO.
    - `BlogClient` is hydrated with this initial data, avoiding a client-side fetch on first load.

2.  **Lazy Loading Images**:
    - `BlogCard` uses `loading="lazy"` for cover images.
    - Images are only loaded when they come near the viewport.
    - A shimmer placeholder (or background color) is shown while loading.
    - `srcset` should be used (if supported by the image provider/Next.js Image) to serve appropriate sizes.

3.  **Code Splitting**:
    - `BlogClient` is a client component, but its dependencies (subcomponents) are imported normally.
    - Since the page is relatively simple, we don't need aggressive dynamic imports for subcomponents unless the bundle size grows significantly.

## Optimization Checklist

- [x] **Memoization**: `React.memo` is used on all list items (`BlogCard`, `TagPill`) and static sections (`HeroSection`) to prevent re-renders when typing in the search bar.
- [x] **Debounce**: Search input is debounced (250ms) to prevent filtering on every keystroke, keeping the UI responsive.
- [x] **CLS Prevention**:
    - `HeroSection` has a fixed min-height or structure.
    - `BlogCard` images have a reserved aspect ratio container to prevent layout shifts when images load.
- [x] **Tree Shaking**: Icons are imported from `@mui/icons-material` individually.

## Future Improvements

- **Virtualization**: If the post count exceeds ~100-200, implement `react-window` or `react-virtuoso` in `BlogGrid` to only render visible DOM nodes.
- **Pagination**: Currently fetches 100 posts. For larger datasets, implement cursor-based pagination (Load More button) to fetch subsequent batches.
- **Image Optimization**: Use `next/image` for automatic optimization (WebP, resizing) if the Supabase image domain is configured in `next.config.js`.
