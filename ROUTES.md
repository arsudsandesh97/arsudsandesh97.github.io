# Portfolio Routes

This Next.js portfolio application includes the following routes:

## Main Routes

### 🏠 Home Page
**Route:** `/`  
**File:** `app/page.js`  
**Description:** Complete portfolio with all sections in a single-page layout
- Hero Section
- Skills
- Experience
- Projects
- Education
- Contact
- Footer

### 🛠️ Skills Page
**Route:** `/skills`  
**File:** `app/skills/page.js`  
**Description:** Dedicated page showcasing technical skills and expertise

### 💼 Projects Page
**Route:** `/projects`  
**File:** `app/projects/page.js`  
**Description:** Portfolio projects with modal details view

### 📊 Experience Page
**Route:** `/experience`  
**File:** `app/experience/page.js`  
**Description:** Professional work experience timeline

### 🎓 Education Page
**Route:** `/education`  
**File:** `app/education/page.js`  
**Description:** Academic background and certifications

### 📧 Contact Page
**Route:** `/contact`  
**File:** `app/contact/page.js`  
**Description:** Contact form and social links

## Navigation

The navigation bar automatically adapts based on the current page:
- **Logo**: Always links to home page
- **About**: Links to `#about` on home page, or `/#about` from other pages
- **Skills, Projects, Experience, Education**: Link to their respective dedicated pages
- **GitHub Profile**: External link to GitHub profile (from Supabase data)

## Hash Navigation (Home Page Only)

When on the home page (`/`), the following hash anchors are available:
- `#about` - Hero/About section
- `#skills` - Skills section
- `#experience` - Experience section
- `#projects` - Projects section
- `#education` - Education section
- `#contact` - Contact section

## GitHub Pages URLs

When deployed to GitHub Pages with `basePath: '/webtest'`, the URLs will be:
- Home: `https://[username].github.io/webtest/`
- Skills: `https://[username].github.io/webtest/skills/`
- Projects: `https://[username].github.io/webtest/projects/`
- Experience: `https://[username].github.io/webtest/experience/`
- Education: `https://[username].github.io/webtest/education/`
- Contact: `https://[username].github.io/webtest/contact/`

## Adding New Routes

To add a new route:

1. Create a new folder in the `app` directory
2. Add a `page.js` file in that folder
3. Use the same structure as existing pages (Body, Navbar, StarCanvas, Footer)
4. Update the Navbar component to include the new route
5. Rebuild and deploy

Example:
```
app/
  new-section/
    page.js
```

## API Routes

### Contact Form API
**Route:** `/api/contact`  
**File:** `app/api/contact/route.js`  
**Method:** POST  
**Description:** Handles contact form submissions via EmailJS

---

**Note**: All pages use the same theme, styled-components, and layout structure for consistency.
