import React from 'react'
import UnitTemplate from '../components/unit_templates/unit_template.jsx'
import Cms from './Cms.jsx'


export default React.createClass({

  resourceComponentGenerator: function (cmsComponent) {
    // FIXME : replace below with more general EC.Resource and the appropriate props
    return (<UnitTemplate unitTemplate={cmsComponent.state.resourceToEdit}
                     returnToIndex={cmsComponent.returnToIndex}/>);
  },

  render: function () {
    return (
      <div className="cms-unit-templates">
        <Cms resourceNameSingular='unit_template'
                resourceNamePlural='unit_templates'
                resourceComponentGenerator={this.resourceComponentGenerator}/>
      </div>

    )
  }

});
