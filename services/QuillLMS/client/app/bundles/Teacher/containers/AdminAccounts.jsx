'use strict'
import Resource from '../components/cms/resources/resource.jsx'
import Cms from './Cms.jsx'
import React from 'react'

export default class extends React.Component {
  resourceComponentGenerator = (cmsComponent) => {

    let initialModel = {
      id: null,
      name: null,
      admins: []
    };

    let savingKeys = ['id', 'name', 'admins', 'teachers'];
    let fieldsToNormalize = [];

    let formFields = [
      {
        name: 'name'
      }
    ];

    let nestedResources = [
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
            <Resource
              fieldsToNormalize={fieldsToNormalize}
              formFields={formFields}
              initialModel={initialModel}
              nestedResources={nestedResources}
              resource={cmsComponent.state.resourceToEdit}
              resourceNamePlural='admin_accounts'
              resourceNameSingular='admin_account'
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
        resourceNamePlural='admin_accounts'
        resourceNameSingular='admin_account'
      />

    );
  }
}
