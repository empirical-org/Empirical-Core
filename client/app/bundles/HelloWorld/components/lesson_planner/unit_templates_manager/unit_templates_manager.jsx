'use strict'

 import React from 'react'
 import UnitTemplateMinis from './unit_template_minis/unit_template_minis'
 import UnitTemplateProfile from './unit_template_profile/unit_template_profile'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },


  stageSpecificComponents: function () {
    if (this.props.data.stage === 'index') {
      return <UnitTemplateMinis data={this.props.data} actions={this.props.actions} />
    }
    else {
      return <UnitTemplateProfile data={this.props.data} actions={this.props.actions} />
    }
  },

  render: function () {
    return (
      <div className='unit-templates-manager'>
        {this.stageSpecificComponents()}
      </div>
    );
  }
})
