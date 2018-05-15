'use strict';
$(function () {
  var ele = $('#cms-unit-template-categories');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.Cms.UnitTemplateCategories, props);
    React.render(comp, ele[0]);
  }
});

EC.Cms.UnitTemplateCategories = React.createClass({

  resourceComponentGenerator: function (cmsComponent) {
    var initialModel = {
      name: null
    };

    var savingKeys = ['name', 'id', 'primary_color', 'secondary_color'];

    var formFields = [
      {
        name: 'name'
      },
      {
        name: 'primary_color',
        label: 'primary color'
      },
      {
        name: 'secondary_color',
        label: 'secondary color'
      }
    ];

    return (<EC.Resource
                  resourceNameSingular='unit_template_category'
                  resourceNamePlural='unit_template_categories'
                  resource={cmsComponent.state.resourceToEdit}
                  returnToIndex={cmsComponent.returnToIndex}
                  initialModel={initialModel}
                  savingKeys={savingKeys}
                  formFields={formFields}/>

    );
  },

  render: function () {
    return (
      <EC.Cms resourceNameSingular='unit_template_category'
              resourceNamePlural='unit_template_categories'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});