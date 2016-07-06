'use strict';
$(function () {
  var ele = $('#cms-admin-accounts');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.cms.AdminAccounts, props);
    React.render(comp, ele[0]);
  }
});

EC.cms.AdminAccounts = React.createClass({

  resourceComponentGenerator: function (cmsComponent) {

    var initialModel = {
      id: null,
      name: null,
      admins: []
    };

    var savingKeys = ['id', 'name', 'admins', 'teachers']
    var fieldsToNormalize = []

    var formFields = [
      {
        name: 'name'
      }
    ];

    var nestedResources = [
      {
        name: 'admins',
        message: 'must be an existing admin (can create one in the Admin cms)',
        formFields: [{name: 'email'}],
        identifier: 'email',
        findOrCreate: 'find'
      },
      {
        name: 'teachers',
        message: 'must be an existing teacher',
        formFields: [{name: 'email'}],
        identifier: 'email',
        findOrCreate: 'find'
      }
    ]



    return (
      <div>
        <div className='row'>
          <div className='col-xs-12'>
            <EC.Resource
               resourceNameSingular='admin_account'
               resourceNamePlural='admin_accounts'
               initialModel={initialModel}
               resource={cmsComponent.state.resourceToEdit}
               formFields={formFields}
               savingKeys={savingKeys}
               fieldsToNormalize={fieldsToNormalize}
               nestedResources={nestedResources}
               returnToIndex={cmsComponent.returnToIndex} />
          </div>
        </div>
      </div>
           );
  },

  render: function () {
    return (
      <EC.Cms resourceNameSingular='admin_account'
              resourceNamePlural='admin_accounts'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});
