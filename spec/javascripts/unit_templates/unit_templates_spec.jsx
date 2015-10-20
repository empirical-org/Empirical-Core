'use strict';

var TestUtils = React.addons.TestUtils;


describe('UnitTemplates', function () {
  beforeEach(function () {

    var props = {
      models: [],
      categories: [],
      selectModel: function () {}
    }

    this.component = TestUtils.renderIntoDocument(
      <EC.UnitTemplates models={props.models} categories={props.categories} selectModel={props.selectModel} />
    );
    this.component.getInitialState();
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });
})