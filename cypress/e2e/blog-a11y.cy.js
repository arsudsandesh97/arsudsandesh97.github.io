describe('Blog Accessibility Flow', () => {
  it('should navigate through the blog using keyboard', () => {
    cy.visit('/blog');
    
    // 1. Tab to Search
    cy.get('body').tab(); // Assuming first focusable element is skip link or home link
    cy.focused().should('have.attr', 'href', '/'); // Back to Home link
    
    cy.get('body').tab();
    cy.focused().should('have.attr', 'id', 'blog-search');
    
    // 2. Type query
    cy.focused().type('React');
    
    // 3. Verify Live Region announcement (mocked or checked via DOM)
    cy.get('[aria-live="polite"]').should('contain', 'posts');
    
    // 4. Tab to Tag List
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'listbox');
    
    // 5. Navigate Tags with Arrows
    cy.focused().type('{rightarrow}');
    cy.focused().should('have.attr', 'role', 'option');
    cy.focused().should('not.contain', 'All'); // Should be on first tag
    
    // 6. Select Tag
    cy.focused().type('{enter}');
    cy.focused().should('have.attr', 'aria-selected', 'true');
    
    // 7. Tab to First Post
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'link');
    cy.focused().should('have.attr', 'aria-label');
    
    // 8. Open Post
    cy.focused().type('{enter}');
    cy.url().should('include', '/blog/');
  });
});
