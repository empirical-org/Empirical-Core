describe('My First Test', () => {
  it('Does not do much', () => {
    cy.visit('https://www.quill.org/');
    // expect(true).to.equal(false);
    cy.contains('up');
  });
});
