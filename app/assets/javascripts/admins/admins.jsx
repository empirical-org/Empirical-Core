'use strict';
$(function () {
  var ele = $('#cms-admins');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.cms.Admins, props);
    React.render(comp, ele[0]);
  }
});

EC.cms.Admins = React.createClass({

  resourceComponentGenerator: function (cmsComponent) {

    var initialModel = {
      id: null,
      name: null,
      email: null,
      password: null
    };

    var savingKeys = ['id', 'name', 'email', 'password']
    var fieldsToNormalize = []

    var formFields = [
      {name: 'name'},
      {name: 'email'},

      {name: 'password',
       type: 'password'}
    ];

    return (
      <div>
        <div className='row'>
          <div className='col-xs-12'>
            <EC.Resource
               resourceNameSingular='admin'
               resourceNamePlural='admins'
               initialModel={initialModel}
               resource={cmsComponent.state.resourceToEdit}
               formFields={formFields}
               savingKeys={savingKeys}
               fieldsToNormalize={fieldsToNormalize}
               returnToIndex={cmsComponent.returnToIndex} />
          </div>
        </div>
      </div>
           );
  },

  render: function () {
    return (
      <EC.Cms resourceNameSingular='admin'
              resourceNamePlural='admins'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});