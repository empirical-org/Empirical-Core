'use strict';

var TestUtils = React.addons.TestUtils;


describe('Cms::UnitTemplateCategories', function () {
  beforeEach(function () {
    this.component = TestUtils.renderIntoDocument(
      <EC.Cms.UnitTemplateCategories />
    );
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });
})