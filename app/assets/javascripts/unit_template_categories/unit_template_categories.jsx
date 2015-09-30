'use strict';
$(function () {
  var ele = $('#cms-unit-template-categories');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.UnitTemplateCategoriesCms, props);
    React.render(comp, ele[0]);
  }
});

EC.UnitTemplateCategoriesCms = React.createClass({

  resourceComponentGenerator: function (cmsComponent) {
    return (<EC.UnitTemplateCategory
                     unitTemplateCategory={cmsComponent.resourceToEdit}
                     returnToIndex={cmsComponent.returnToIndex}/>);
  },

  render: function () {
    return (
      <EC.Cms resourceName='unit_template_category'
              resourceNamePlural='unit_template_categories'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});