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
      formFields={formFields}
      initialModel={initialModel}
      resource={cmsComponent.state.resourceToEdit}
      resourceNamePlural='unit_template_categories'
      resourceNameSingular='unit_template_category'
      returnToIndex={cmsComponent.returnToIndex}
      savingKeys={savingKeys}
    />

    );
  },

  render: function () {
    return (
      <EC.Cms
        resourceComponentGenerator={this.resourceComponentGenerator}
        resourceNamePlural='unit_template_categories'
        resourceNameSingular='unit_template_category'
      />

    );
  }
});