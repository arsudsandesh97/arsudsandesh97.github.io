/**
 * Enhanced Structured Data (JSON-LD) Schemas
 * For rich snippets in Google Search
 */

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sandesh Arsud',
    url: 'https://arsudsandesh97.github.io',
    image: 'https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg',
    jobTitle: 'Data Analyst',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    sameAs: [
      'https://github.com/arsudsandesh97',
      'https://linkedin.com/in/sandesharsud',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'International Center of Excellence in Engineering and Management',
    },
    knowsAbout: [
      'Data Analytics',
      'Business Intelligence',
      'Power BI',
      'SQL',
      'Python',
      'Data Visualization',
    ],
  };
}

export function getBlogPostingSchema(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: 'Sandesh Arsud',
      url: 'https://arsudsandesh97.github.io',
    },
    publisher: {
      '@type': 'Person',
      name: 'Sandesh Arsud',
      url: 'https://arsudsandesh97.github.io',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://arsudsandesh97.github.io/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
  };
}

export function getProjectSchema(project: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: 'Data Analytics',
    image: project.image,
    author: {
      '@type': 'Person',
      name: 'Sandesh Arsud',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(project.github && {
      codeRepository: project.github,
    }),
    ...(project.dashboard && {
      url: project.dashboard,
    }),
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Sandesh Arsud Data Analytics',
    url: 'https://arsudsandesh97.github.io',
    logo: 'https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg',
    sameAs: [
      'https://github.com/arsudsandesh97',
      'https://linkedin.com/in/sandesharsud',
    ],
    founder: {
      '@type': 'Person',
      name: 'Sandesh Arsud',
    },
  };
}
