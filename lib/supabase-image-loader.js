/**
 * Custom image loader for Next.js Image component
 * Optimizes images from Supabase Storage with WebP conversion
 */
export default function supabaseImageLoader({ src, width, quality }) {
  // If image is already a data URL or from external source, return as-is
  if (src.startsWith('data:') || src.startsWith('http') && !src.includes('supabase.co')) {
    return src;
  }

  // For Supabase Storage images, add transformation parameters
  if (src.includes('supabase.co')) {
    try {
      const url = new URL(src);
      url.searchParams.set('width', width.toString());
      url.searchParams.set('quality', (quality || 75).toString());
      url.searchParams.set('format', 'webp');
      return url.toString();
    } catch (error) {
      console.error('Error in supabaseImageLoader:', error);
      return src;
    }
  }

  return src;
}
