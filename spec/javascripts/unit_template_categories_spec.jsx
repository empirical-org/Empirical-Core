'use strict';

var TestUtils = React.addons.TestUtils;


describe('UnitTemplateCategories', function () {
  beforeEach(function () {
    this.component = TestUtils.renderIntoDocument(
      <EC.UnitTemplateCategoriesCms />
    );
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });
})