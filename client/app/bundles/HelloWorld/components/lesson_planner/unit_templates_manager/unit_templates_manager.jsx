'use strict'

 import React from 'react'
 import UnitTemplateMinis from './unit_template_minis/unit_template_minis'
 import UnitTemplateProfile from './unit_template_profile/unit_template_profile'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },


   componentWillReceiveProps: function(nextProps) {
     if (this.props.params.category !== nextProps.params.category) {
      this.filterByCategory(nextProps.params.category)
    } else if (this.props.params.grade && !nextProps.params.grade) {
      this.showAllGrades()
    }
   },

   analytics: function() {
     return new AnalyticsWrapper();
   },

   initialState() {
     return {
         signedInTeacher: false,
         unitTemplatesManager: {
         firstAssignButtonClicked: false,
         assignSuccess: false,
         models: [],
         categories: [],
         stage: 'index', // index, profile,
         model: null,
         model_id: null,
         relatedModels: [],
         displayedModels: [],
         selectedCategoryId: null,
         lastActivityAssigned: null,
         grade: this.props.params.grade,
        }
       }
   },

  getInitialState() {

    this.modules = {
      fnl: new fnl,
      updaterGenerator: new updaterGenerator(this),
      unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
      windowPosition: new WindowPosition()
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
