'use strict';
$(function () {
  var ele = $('#cms-unit-templates');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.Cms.UnitTemplates, props);
    React.render(comp, ele[0]);
  }
});


EC.Cms.UnitTemplates = React.createClass({

  resourceComponentGenerator: function (cmsComponent) {
    // FIXME : replace below with more genearl EC.Resource and the appropriate props
    return (<EC.Cms.UnitTemplate unitTemplate={cmsComponent.state.resourceToEdit}
                     returnToIndex={cmsComponent.returnToIndex}/>);
  },

  render: function () {
    return (
      <EC.Cms resourceNameSingular='unit_template'
              resourceNamePlural='unit_templates'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    )
  }

});