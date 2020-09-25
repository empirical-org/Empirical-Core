'use strict';
import React from 'react'

import Cms from './Cms.jsx'

import Resource from '../components/cms/resources/resource.jsx'

export default class extends React.Component {
  resourceComponentGenerator = (cmsComponent) => {

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
              fieldsToNormalize={fieldsToNormalize}
              formFields={formFields}
              initialModel={initialModel}
              resource={cmsComponent.state.resourceToEdit}
              resourceNamePlural='admins'
              resourceNameSingular='admin'
              returnToIndex={cmsComponent.returnToIndex}
              savingKeys={savingKeys}
            />
          </div>
        </div>
      </div>
           );
  };

  render() {
    return (
      <Cms
        resourceComponentGenerator={this.resourceComponentGenerator}
        resourceNamePlural='admins'
        resourceNameSingular='admin'
      />

    );
  }
}
