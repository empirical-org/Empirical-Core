'use strict';
import React from 'react'
import Resource from '../components/cms/resources/resource.jsx'
import Cms from './Cms.jsx'

export default React.createClass({

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
            <Resource
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
      <Cms resourceNameSingular='admin'
              resourceNamePlural='admins'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});
