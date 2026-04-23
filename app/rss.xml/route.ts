import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read from local JSON file directly (works with static export - no server needed)
  const filePath = path.join(process.cwd(), 'public', 'data', 'blogs.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: posts } = JSON.parse(fileContent);

  const siteUrl = 'https://arsudsandesh97.github.io';
  const rss = generateRSS(posts || [], siteUrl);

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}

function generateRSS(posts: any[], siteUrl: string): string {
  const rssItems = posts
    .filter(post => post.published) // Only published posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${escapeXml(post.description || post.excerpt || '')}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.tags ? post.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ') : ''}
      ${post.image ? `<enclosure url="${post.image}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sandesh Arsud - Blog</title>
    <link>${siteUrl}</link>
    <description>Insights on Data Analytics, Business Intelligence, and Technology by Sandesh Arsud</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${siteUrl}/favicon.ico</url>
      <title>Sandesh Arsud - Blog</title>
      <link>${siteUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
