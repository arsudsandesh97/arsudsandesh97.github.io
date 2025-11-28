export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // Allow AI crawlers specifically
      {
        userAgent: 'GPTBot', // ChatGPT
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot', // Claude (Anthropic)
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
      },
      {
        userAgent: 'Googlebot', // Google (Gemini uses this)
        allow: '/',
      },
      {
        userAgent: 'Bingbot', // Bing (Copilot uses this)
        allow: '/',
      },
    ],
    sitemap: [
      'https://arsudsandesh97.github.io/sitemap.xml',
      'https://arsudsandesh97.github.io/sitemap_index.xml',
      'https://arsudsandesh97.github.io/sitemap-v2/sitemap.xml',
    ],
  };
}
