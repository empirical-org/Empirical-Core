import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import _l from "lodash"
// import  UnitTemplatesAssigned from '../components/lesson_planner/unit_template_assigned'
// import CreateUnit from '../components/lesson_planner/create_unit/create_unit'
import ManageUnits from '../components/lesson_planner/manage_units/manage_units'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
// import UnitTabs	 from '../components/lesson_planner/unit_tabs'
import fnl from '../components/modules/fnl'
import updaterGenerator from '../components/modules/updater'
import Server from '../components/modules/server/server'
import WindowPosition from '../components/modules/windowPosition'
import AnalyticsWrapper from '../components/shared/analytics_wrapper'


export default React.createClass({

  getInitialState: function () {
    this.modules = {
			fnl: new fnl,
			updaterGenerator: new updaterGenerator(this),
			unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
      windowPosition: new WindowPosition(),
		};

    this.deepExtendState = this.modules.updaterGenerator.updater(null)
    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateCreateUnitModel = this.modules.updaterGenerator.updater('createUnit.model');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

    var state = {
      tab: 'manageUnits', // 'createUnit', 'exploreActivityPacks'
      createUnit: {
        stage: 1,
        options: {
          classrooms: []
        },
        model: {
          name: null,
          selectedActivities: []
        }
      },
      unitTemplatesManager: {
        models: [],
        categories: [],
        stage: 'index', // index, profile,
        model: null,
        model_id: null,
        relatedModels: [],
        displayedModels: [],
        selectedCategoryId: null
      }
    }
    state.unitTemplatesManager.non_authenticated = !($('#public-activity-packs').data('authenticated'));
    //FIXME: this concern should be handled with a react-router
    var individualUnitTemplate = $('.teachers-unit-template')[0]
    if (individualUnitTemplate) {
      state.tab = 'exploreActivityPacks';
      state.unitTemplatesManager.model_id = $('.teachers-unit-template').data('id');
    }
    return state;
  },


  selectModel: function (ut) {
    var relatedModels = this._modelsInCategory(ut.unit_template_category.id)
    this.updateUnitTemplatesManager({stage: 'profile', model: ut, relatedModels: relatedModels})
    this.modules.windowPosition.reset();
  },

  _modelsInCategory: function (categoryId) {
    return _.where(this.state.unitTemplatesManager.models, {unit_template_category: {id: categoryId}})
  },

  updateUnitTemplateModels: function (models) {
    var categories =  _.chain(models)
                        .pluck('unit_template_category')
                        .uniq(_.property('id'))
                        .value();

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
  },

  returnToIndex: function () {
    this.updateUnitTemplatesManager({stage: 'index'})
    window.scrollTo(0, 0);
  },

  filterByCategory: function (categoryId) {
    if (categoryId) {
      var uts = this._modelsInCategory(categoryId)
    } else {
      var uts = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts, selectedCategoryId: categoryId});
  },

  fetchUnitTemplateModels: function () {
    this.modules.unitTemplatesServer.getModels(this.updateUnitTemplateModels);
  },

  componentDidMount: function () {
    this.fetchUnitTemplateModels();
  },

  toggleTab: function (tab) {
    if (tab == 'createUnit') {
      this.updateCreateUnit({
                              stage: 1,
                              model: {
                                name: null,
                                selectedActivities: []
                              }
                            });

      // this.setState({tab: tab})

    } else if (tab == 'exploreActivityPacks') {
      this.deepExtendState({tab: tab, unitTemplatesManager: {stage: 'index', model_id: null, model: null}})
      this.fetchUnitTemplateModels();
    } else {
      // this.setState({tab: tab})
    }
  },

  toggleStage: function (stage) {
    this.updateCreateUnit({stage: 2})
    this.fetchClassrooms();
  },

  fetchClassrooms: function() {
    var that = this;
    $.ajax({
      url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',
      context: this,
      success: function (data) {
        that.updateCreateUnit({options: {classrooms: data.classrooms_and_their_students}})
      }
    });
  },

  getSelectedActivities: function () {
    return this.state.createUnit.model.selectedActivities;
  },

  toggleActivitySelection: function (activity, true_or_false) {
    var sas = this.modules.fnl.toggle(this.getSelectedActivities(), activity);
    this.updateCreateUnitModel({selectedActivities: sas});
  },

  assign: function () {
    this.fetchClassrooms()
    var unitTemplate = this.state.unitTemplatesManager.model;
    var state = this.state;
    var hash = {
      tab: 'createUnit',
      createUnit: {
        stage: 2,
        model: {
          name: unitTemplate.name,
          selectedActivities: unitTemplate.activities
        }
      }
    }
    this.deepExtendState(hash);
  },

  signUp: function () {
    window.location.href = "/account/new";
  },

  unitTemplatesManagerActions: function () {
    return {
      assign: this.assign,
      returnToIndex: this.returnToIndex,
      filterByCategory: this.filterByCategory,
      selectModel: this.selectModel,
      signUp: this.signUp
    }
  },

  render: function () {
    var tabSpecificComponents;

    tabSpecificComponents = <UnitTemplatesManager
                                    data={this.state.unitTemplatesManager}
                                    actions={this.unitTemplatesManagerActions()}/>;

    return (
      <span>
        <div id="lesson_planner" >
          {tabSpecificComponents}
        </div>
      </span>
    );

  }
});
