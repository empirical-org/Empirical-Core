import * as React from 'react'
import Cms from './Cms.jsx'
import Resource from '../components/cms/resources/resource.jsx'

export default class UnitTemplateCategories extends React.Component {

  resourceComponentGenerator(cmsComponent) {
    const initialModel = {
      name: null
    };

    const savingKeys = ['name', 'id', 'primary_color', 'secondary_color'];

    const formFields = [
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

    return (
      <Resource
        formFields={formFields}
        initialModel={initialModel}
        resource={cmsComponent.state.resourceToEdit}
        resourceNamePlural='unit_template_categories'
        resourceNameSingular='unit_template_category'
        returnToIndex={cmsComponent.returnToIndex}
        savingKeys={savingKeys}
      />
    );
  }

  render() {
    return (
      <Cms
        resourceComponentGenerator={this.resourceComponentGenerator}
        resourceNamePlural='unit_template_categories'
        resourceNameSingular='unit_template_category'
      />
    )
  }
}
