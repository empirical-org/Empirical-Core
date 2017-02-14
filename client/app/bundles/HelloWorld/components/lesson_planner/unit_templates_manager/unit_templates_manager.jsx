'use strict'

 import React from 'react'
 import _l from 'lodash'

 import UnitTabs from '../unit_tabs'
 import UnitTemplateMinis from './unit_template_minis/unit_template_minis'
 import UnitTemplateProfile from './unit_template_profile/unit_template_profile'
 import fnl from '../../modules/fnl'
 import updaterGenerator from '../../modules/updater'
 import Server from '../../modules/server/server'
 import WindowPosition from '../../modules/windowPosition'

 export default React.createClass({

   componentDidMount: function() {
   		this.fetchUnitTemplateModels();
   },

  getInitialState() {

    this.modules = {
      fnl: new fnl,
      updaterGenerator: new updaterGenerator(this),
      unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
      windowPosition: new WindowPosition()
    }

    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

    return {
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
        grade: null
       }
      }
    },

    unitTemplatesManagerActions: function() {
      return {
        toggleTab: this.toggleTab,
        customAssign: this.customAssign,
        fastAssign: this.fastAssign,
        clickAssignButton: this.clickAssignButton,
        returnToIndex: this.returnToIndex,
        filterByCategory: this.filterByCategory,
        filterByGrade: this.filterByGrade,
        selectModel: this.selectModel,
        showAllGrades: this.showAllGrades
      };
    },

    _modelsInGrade: function(grade) {
      return _.reject(this.state.unitTemplatesManager.models, function(m) {
        return _.indexOf(m.grades, grade)
      });
    },

    updateUnitTemplateModels: function(models) {
      var categories = _.chain(models).pluck('unit_template_category').uniq(_.property('id')).value();
      var newHash = {
        models: models,
        displayedModels: models,
        categories: categories
      }
      var model_id = this.state.unitTemplatesManager.model_id // would be set if we arrived here from a deep link
      if (model_id) {
        newHash.model = _.findWhere(models, {id: model_id});
        newHash.stage = 'profile'
      }
      this.updateUnitTemplatesManager(newHash)
      if (this.props.params.category) {
        this.filterByCategory()
      }
    },

    returnToIndex: function() {
      this.updateUnitTemplatesManager({stage: 'index'})
      window.scrollTo(0, 0);
    },

    showAllGrades: function() {
      this.updateUnitTemplatesManager({grade: null});
      window.scrollTo(0, 0);
    },

    filterByGrade: function() {
      var grade = this.state.unitTemplatesManager.grade;
      var uts;
      if (grade) {
        uts = this._modelsInGrade(grade)
      } else {
        uts = this.state.unitTemplatesManager.models;
      }
      this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts});
    },

    filterByCategory: function() {
      let unitTemplates, selectedCategoryId
      const categoryName = this.props.params.category
      if (categoryName) {
        selectedCategoryId = this.state.unitTemplatesManager.categories.find((cat) => cat.name === categoryName).id
        unitTemplates = _l.filter(this.state.unitTemplatesManager.models, {
          unit_template_category: {
            name: categoryName
          }
        })
      } else {
        unitTemplates = this.state.unitTemplatesManager.models;
      }
      this.updateUnitTemplatesManager({stage: 'index', displayedModels: unitTemplates, selectedCategoryId: selectedCategoryId});
    },

    fetchUnitTemplateModels: function() {
      this.modules.unitTemplatesServer.getModels(this.updateUnitTemplateModels);
    },

    fastAssign: function() {
      $.ajax({
        url: '/teachers/unit_templates/fast_assign',
        data: {
          id: this.state.unitTemplatesManager.model.id
        },
        type: 'POST',
        success: this.onFastAssignSuccess,
        error: (response) => {
          const errorMessage = jQuery.parseJSON(response.responseText).error_message
          window.alert(errorMessage)
        }
      })
    },

    customAssign: function() {
      this.fastAssign()
    },

    selectModel: function(ut) {
      var relatedModels = _l.filter(this.state.unitTemplatesManager.models, {
        unit_template_category: {
          id: ut.unit_template_category.id
        }
      })
      this.updateUnitTemplatesManager({stage: 'profile', model: ut, relatedModels: relatedModels})
      this.modules.windowPosition.reset();
    },


  stageSpecificComponents: function () {
    if (this.state.unitTemplatesManager.stage === 'index') {
      return <UnitTemplateMinis data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()} />
    }
    else {
      return <UnitTemplateProfile data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()} />
    }
  },

  render: function () {
    return (
      <span>
        <UnitTabs tab={tabParam || this.state.tab} toggleTab={this.toggleTab}/>
        <div className='unit-templates-manager'>
          {this.stageSpecificComponents()}
        </div>
      </span>
    );
  }
})
