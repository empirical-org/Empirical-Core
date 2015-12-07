'use strict';

var TestUtils = React.addons.TestUtils;

describe('UnitTemplates', function () {
  beforeEach(function () {

    var props = {
      loadActivityPackIntoUnitCreator: function () {}
    }

    var renderer = TestUtils.createRenderer()

    renderer.render(
      <EC.UnitTemplatesManager loadActivityPackIntoUnitCreator={props.loadActivityPackIntoUnitCreator} />
    )

    this.output = renderer.getRenderOutput()
  });

  it('exists', function () {
    expect(this.output.type).to.be('div')
  });
})