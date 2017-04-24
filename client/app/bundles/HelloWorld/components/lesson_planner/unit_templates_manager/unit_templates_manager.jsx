'use strict'

import React from 'react'
import _l from 'lodash'
import _ from 'underscore'
import UnitTemplateMinis from './unit_template_minis/unit_template_minis'
import UnitTemplateProfile from './unit_template_profile/unit_template_profile'
import ScrollToTop from '../../shared/scroll_to_top'
import fnl from '../../modules/fnl'
import updaterGenerator from '../../modules/updater'
import Server from '../../modules/server/server'
import WindowPosition from '../../modules/windowPosition'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import LoadingIndicator from '../../shared/loading_indicator'

export default React.createClass({

  componentDidMount: function() {
  	this.fetchUnitTemplateModels();
    this.fetchTeacher();
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

    this.deepExtendState = this.modules.updaterGenerator.updater(null)
    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

    return this.initialState()
  },

  unitTemplatesManagerActions: function() {
    return {
      toggleTab: this.toggleTab,
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

  fetchTeacher: function() {
    const that = this
    $.ajax({
      url: '/current_user_json',
      success: function(data) {
        that.setTeacher(data)
      }
    })
  },

  setTeacher: function(data) {
    this.setState({
      signedInTeacher: !_l.isEmpty(data)
    })
  },

  fetchUnitTemplateModels: function() {
    const request = this.modules.unitTemplatesServer.getModels(this.updateUnitTemplateModels);
  },

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

  showUnitTemplates: function() {
    return this.state.unitTemplatesManager.models.length < 1
    ? <LoadingIndicator />
    : <UnitTemplateMinis signedInTeacher={this.state.signedInTeacher} data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()} />
  },

  render: function () {
    return (
      <span>
        <ScrollToTop />
        <div className='unit-templates-manager'>
          {this.showUnitTemplates()}
        </div>
      </span>
    );
  }
})
