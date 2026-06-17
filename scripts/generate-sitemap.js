const fs = require('fs');
const path = require('path');

function getLocalData(section) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', `${section}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContent);
    // Accommodate structure { data: [...] } or just an array
    return Array.isArray(parsed.data) ? parsed.data : (Array.isArray(parsed) ? parsed : []);
  } catch (e) {
    console.error(`Could not read ${section}.json`, e.message);
    return [];
  }
}

async function generateSitemap() {
  const baseUrl = 'https://arsudsandesh97.github.io';
  // Use current date for static routes to guarantee a daily change for GitHub Action commits
  const currentDate = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const staticRoutes = ['', '/about', '/skills', '/experience', '/projects', '/education', '/contact', '/blog'];
  for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  }

  const blogs = getLocalData('blogs');
  blogs.forEach(post => {
    if (post.slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.updated_at || currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  const projects = getLocalData('projects');
  projects.forEach(project => {
    if (project.id) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/project/${project.id}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  const projectExplanations = getLocalData('project-explanations');
  projectExplanations.forEach(project => {
    if (project.slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/project-explanation/${project.slug}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  xml += `</urlset>\n`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Sitemap generated successfully at public/sitemap.xml with ${staticRoutes.length + blogs.length + projects.length + projectExplanations.length} total URLs.`);
}

generateSitemap();
