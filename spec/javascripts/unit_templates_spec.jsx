'use strict';

var TestUtils = React.addons.TestUtils;


describe('UnitTemplates', function () {
  beforeEach(function () {

    spyOn( $, 'ajax' ).andCallFake( function (params) { 
      params.success({unit_templates: ['ut1']}); 
    });

    this.component = TestUtils.renderIntoDocument(
      <EC.UnitTemplates />
    );
    this.component.getInitialState();
  });

  it('exists', function () {
    expect(this.component).to.be.ok()
  });

  it('has loaded its models', function () {
    expect(this.component.state.models.length).to.equal(300);
  });
})