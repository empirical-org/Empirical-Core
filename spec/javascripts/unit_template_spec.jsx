'use strict';

var TestUtils = React.addons.TestUtils;


describe('UnitTemplate', function () {
  beforeEach(function () {
    this.component = TestUtils.renderIntoDocument(
      <EC.UnitTemplate />
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