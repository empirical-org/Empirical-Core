'use strict';

var TestUtils = React.addons.TestUtils;


describe('CMS::UnitTemplate', function () {
  beforeEach(function () {
    this.component = TestUtils.renderIntoDocument(
      <EC.Cms.UnitTemplate />
    );
    this.component.getInitialState();
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });

  it('has loaded its options', function () {
    expect(this.component.state.options).to.not.be.empty();
  });
})