import React from 'react'

import Cms from './Cms.jsx'

import UnitTemplate from '../components/unit_templates/unit_template.jsx'


export default class extends React.Component {
  resourceComponentGenerator = (cmsComponent) => {
    // FIXME : replace below with more general EC.Resource and the appropriate props
    return (<UnitTemplate
      returnToIndex={cmsComponent.returnToIndex}
      unitTemplate={cmsComponent.state.resourceToEdit}
    />);
  };

  render() {
    return (
      <div className="cms-unit-templates">
        <Cms
          resourceComponentGenerator={this.resourceComponentGenerator}
          resourceNamePlural='unit_templates'
          resourceNameSingular='unit_template'
        />
      </div>

    )
  }
}
