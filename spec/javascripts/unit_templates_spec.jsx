'use strict';

var TestUtils = React.addons.TestUtils;


describe('UnitTemplates', function () {
  beforeEach(function () {

    this.component = TestUtils.renderIntoDocument(
      <EC.UnitTemplates />
    );
    this.component.getInitialState();
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });
})