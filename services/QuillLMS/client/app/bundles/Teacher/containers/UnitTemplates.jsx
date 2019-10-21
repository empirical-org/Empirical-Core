import React from 'react'
import UnitTemplate from '../components/unit_templates/unit_template.jsx'
import Cms from './Cms.jsx'


export default React.createClass({

  resourceComponentGenerator: function (cmsComponent) {
    // FIXME : replace below with more general EC.Resource and the appropriate props
    return (<UnitTemplate
      returnToIndex={cmsComponent.returnToIndex}
      unitTemplate={cmsComponent.state.resourceToEdit}
    />);
  },

  render: function () {
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

});
