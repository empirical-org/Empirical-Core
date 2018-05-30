'use strict';

var TestUtils = React.addons.TestUtils;


describe('UnitTemplates', function () {
  beforeEach(function () {

    var props = {
      data: {
        models: [],
        categories: []
      },
      eventHandlers: {
        selectModel: function () {},
        filterByCategory: function () {}
    }

    this.component = TestUtils.renderIntoDocument(
      <EC.UnitTemplates data={props.data}
                        eventHandlers={props.eventHandlers} />
    );
    this.component.getInitialState();
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });
})