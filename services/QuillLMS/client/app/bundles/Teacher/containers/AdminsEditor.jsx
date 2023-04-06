'use strict';
import React from 'react';
import Resource from '../components/cms/resources/resource.jsx';
import Cms from './Cms.jsx';

export default class extends React.Component {
  resourceComponentGenerator = (cmsComponent) => {

    let initialModel = {
      id: null,
      name: null,
      email: null,
      password: null
    };

    let savingKeys = ['id', 'name', 'email', 'password']
    let fieldsToNormalize = []

    let formFields = [
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
