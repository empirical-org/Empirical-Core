'use strict';
$(function () {
  var ele = $('#cms-authors');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.Authors, props);
    React.render(comp, ele[0]);
  }
});

EC.Authors = React.createClass({

  resourceComponentGenerator: function (cmsComponent) {

    var initialModel = {
      id: null,
      name: null
      //avatar: null
    };

    var savingKeys = ['id', 'name']

    var formFields = [
      {
        name: 'name',
      },
      {
        name: 'avatar'
      }
    ];

    return (<EC.Resource
                     resourceNameSingular='author'
                     resourceNamePlural='authors'
                     initialModel={initialModel}
                     resource={cmsComponent.state.resourceToEdit}
                     formFields={formFields}
                     savingKeys={savingKeys}
                     returnToIndex={cmsComponent.returnToIndex} />
           );
  },

  render: function () {
    return (
      <EC.Cms resourceNameSingular='author'
              resourceNamePlural='authors'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});