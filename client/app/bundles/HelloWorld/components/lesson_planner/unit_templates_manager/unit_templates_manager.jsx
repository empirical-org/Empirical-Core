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
 import AnalyticsWrapper from '../../shared/analytics_wrapper'

 export default React.createClass({

   componentDidMount: function() {
   		this.fetchUnitTemplateModels();
   },

   componentWillReceiveProps: function(nextProps) {
     if (this.props.params.category !== nextProps.params.category) {
      this.filterByCategory(nextProps.params.category)
     }
   },

   analytics: function() {
     return new AnalyticsWrapper();
   },

   initialState() {
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

  getInitialState() {

    this.modules = {
      fnl: new fnl,
      updaterGenerator: new updaterGenerator(this),
      unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
      windowPosition: new WindowPosition()
    }

    this.deepExtendState = this.modules.updaterGenerator.updater(null)
    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

    return this.initialState()
    },

    unitTemplatesManagerActions: function() {
      return {
        toggleTab: this.toggleTab,
        // customAssign: this.customAssign,
        // fastAssign: this.fastAssign,
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
        this.filterByCategory(this.props.params.category)
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

    filterByCategory: function(categoryName) {
      let selectedCategoryId, unitTemplates
      if (categoryName) {
        categoryName = categoryName.toUpperCase() === 'ELL' ? categoryName.toUpperCase() : _l.capitalize(categoryName)
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

    fetchClassrooms: function() {
      var that = this;
      $.ajax({
        url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',
        context: this,
        success: function(data) {
          that.updateCreateUnit({
            options: {
              classrooms: data.classrooms_and_their_students
            }
          })
        }
      });
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

    onFastAssignSuccess: function() {
      var lastActivity = this.state.unitTemplatesManager.model;
      this.analytics().track('click Create Unit', {});
      this.deepExtendState(this.initialState());
      this.updateUnitTemplatesManager({lastActivityAssigned: lastActivity});
      this.fetchClassrooms();
      window.location = '/teachers/classrooms/activity_planner#/tab/featured-activity-packs/assigned'
    },


    customAssign: function() {
      this.fastAssign()
    },

    // selectModel: function(ut) {
    //   var relatedModels = _l.filter(this.state.unitTemplatesManager.models, {
    //     unit_template_category: {
    //       id: ut.unit_template_category.id
    //     }
    //   })
    //   this.updateUnitTemplatesManager({stage: 'profile', model: ut, relatedModels: relatedModels})
    //   this.modules.windowPosition.reset();
    // },

    toggleTab: function(tab) {
      if (tab == 'createUnit') {
        this.analytics().track('click Create Unit', {});
        this.updateCreateUnit({
          stage: 1,
          model: {
            name: null,
            selectedActivities: []
          }
        });

        this.setState({tab: tab});
      } else {
        this.setState({tab: tab});
      }
    },

  stageSpecificComponents: function () {
    // if (this.state.unitTemplatesManager.stage === 'index') {
      return <UnitTemplateMinis data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()} />
    // }
    // else {
    //   return <UnitTemplateProfile data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()} />
    // }
  },

  render: function () {
    return (
      <span>
        <UnitTabs tab="featured-activity-packs" toggleTab={this.toggleTab}/>
        <div className='unit-templates-manager'>
          {this.stageSpecificComponents()}
        </div>
      </span>
    );
  }
})
