'use strict'

 import React from 'react'
 import $ from 'jquery'
 import _ from 'underscore'
 import _l from "lodash"
 import  UnitTemplatesAssigned from '../components/lesson_planner/unit_template_assigned'
 import CreateUnit from '../components/lesson_planner/create_unit/create_unit'
 import ManageUnits from '../components/lesson_planner/manage_units/manage_units'
 import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
 import UnitTabs	 from '../components/lesson_planner/unit_tabs'
 import fnl from '../components/modules/fnl'
 import updaterGenerator from '../components/modules/updater'
 import Server from '../components/modules/server/server'
 import WindowPosition from '../components/modules/windowPosition'
 import AnalyticsWrapper from '../components/shared/analytics_wrapper'
 import AssignANewActivity from '../components/lesson_planner/create_unit/assign_a_new_activity.jsx'


 export default React.createClass({
	propTypes: {
		grade: React.PropTypes.string.isRequired,
		tab: React.PropTypes.string.isRequired,
		classroomName: React.PropTypes.string.isRequired,
		classroomId: React.PropTypes.string.isRequired,
		students: React.PropTypes.string.isRequired,
	},

  analytics: function(){
    return new AnalyticsWrapper();
  },



  blankState: function () {
    return {
      tab: 'manageUnits', // 'createUnit', 'exploreActivityPacks'
      createUnit: {
        stage: 1,
        options: {
          classrooms: []
        },
        model: {
          id: null,
          name: null,
          selectedActivities: [],
          dueDates: {}
        }
      },
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

    var state = this.blankState();

    var grade = this.props.grade;
    if (grade) {
      state.unitTemplatesManager.grade = grade;
    }

    var tab = ($('#activity-planner').data('tab'));
    if (tab) {
      state.tab = tab;
    }
    //FIXME: this concern should be handled with a react-router
    var individualUnitTemplate = $('.teachers-unit-template')[0]
    if (individualUnitTemplate) {
      state.tab = 'exploreActivityPacks';
      state.unitTemplatesManager.model_id = $('.teachers-unit-template').data('id');
    }
    return state;
	},

  editUnit: function(unitId) {
    $.ajax({
      url: ['/teachers/units/', unitId, '/edit'].join(''),
      success: this.editUnitRequestSuccess
    })
  },

  editUnitRequestSuccess: function (data) {
    this.updateCreateUnitModel({id: data.id, name: data.name, dueDates: data.dueDates, selectedActivities: data.selectedActivities})
    this.updateCreateUnit({options: {classrooms: data.classrooms}})
    this.setState({tab: 'createUnit'})
  },

  assignActivityDueDate: function(activity, dueDate) {
    var dueDates = this.state.createUnit.model.dueDates || {}
    dueDates[activity.id] = dueDate;
    this.updateCreateUnitModel({dueDates: dueDates})
  },


  selectModel: function (ut) {
    var relatedModels = _l.filter(this.state.unitTemplatesManager.models, {unit_template_category: {id: ut.unit_template_category.id}})
    this.updateUnitTemplatesManager({stage: 'profile', model: ut, relatedModels: relatedModels})
    this.modules.windowPosition.reset();
  },

  _modelsInGrade: function (grade) {
    return _.reject(this.state.unitTemplatesManager.models, function (m){
      return _.indexOf(m.grades, grade)
    });
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

  showAllGrades: function () {
    this.updateUnitTemplatesManager({grade: null});
    window.scrollTo(0, 0);
  },

  filterByGrade: function () {
    var grade  = this.state.unitTemplatesManager.grade;
    if (grade) {
      var uts = this._modelsInGrade(grade)
    } else {
      var uts = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts});
  },

  filterByCategory: function (categoryId) {
    if (categoryId) {
      var uts = _l.filter(this.state.unitTemplatesManager.models, {unit_template_category: {id: categoryId}})
    } else {
      var uts = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts, selectedCategoryId: categoryId});
  },

  fetchUnitTemplateModels: function () {
    this.modules.unitTemplatesServer.getModels(this.updateUnitTemplateModels);
  },

  componentDidMount: function () {
    if (this.state.tab == 'exploreActivityPacks') {
      this.fetchUnitTemplateModels();
    }
  },

	toggleTab: function (tab) {
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
		} else if (tab == 'exploreActivityPacks') {
			this.deepExtendState({tab: tab, unitTemplatesManager: {stage: 'index', firstAssignButtonClicked: false, model_id: null, model: null}});
      this.fetchUnitTemplateModels();
		} else {
			this.setState({tab: tab});
		}
	},

	toggleStage: function (stage) {
		this.updateCreateUnit({stage: stage})
		if (!this.state.createUnit.options.classrooms.length) {
      this.fetchClassrooms();
    }
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

	getInviteStudentsUrl: function() {
		return ('/teachers/classrooms/' + this.props.classroomId + '/invite_students');
	},

  getSelectedActivities: function () {
  	return this.state.createUnit.model.selectedActivities;
  },

  toggleActivitySelection: function (activity, true_or_false) {
    var selectedActivities = this.state.createUnit.model.selectedActivities
		if (true_or_false) {
			this.analytics().track('select activity in lesson planner', {name: activity.name, id: activity.id});
		}
		var sas = this.modules.fnl.toggleById(this.getSelectedActivities(), activity);
		this.updateCreateUnitModel({selectedActivities: sas});
	},

  clickAssignButton: function () {
    this.updateUnitTemplatesManager({firstAssignButtonClicked: true});
  },

  fastAssign: function () {
    $.ajax({
      url: '/teachers/unit_templates/fast_assign',
      data: {id: this.state.unitTemplatesManager.model.id},
      type: 'POST',
      success: this.onFastAssignSuccess
    });
  },

  onFastAssignSuccess: function () {
		var lastActivity = this.state.unitTemplatesManager.model;
		this.analytics().track('click Create Unit', {});
		this.deepExtendState(this.blankState());
		this.updateUnitTemplatesManager({lastActivityAssigned: lastActivity});
		this.fetchClassrooms();
		this.updateUnitTemplatesManager({assignSuccess: true});
  },

	unitTemplatesAssignedActions: function() {
		return {
			studentsPresent: this.props.students,
			getInviteStudentsUrl: this.getInviteStudentsUrl,
			getLastClassroomName: this.props.classroomName,
			unitTemplatesManagerActions: this.unitTemplatesManagerActions
		};
	},

	customAssign: function () {
		this.fetchClassrooms();
		var unitTemplate = this.state.unitTemplatesManager.model;
		var state = this.state;
		var hash = {
			tab: 'createUnit',
      unitTemplatesManager: {firstAssignButtonClicked: false},
			createUnit: {
				stage: 2,
				model: {
					name: unitTemplate.name,
					selectedActivities: unitTemplate.activities
				}
			}
		};
		this.deepExtendState(hash);
	},

	unitTemplatesManagerActions: function () {
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




	render: function () {
		var tabSpecificComponents;
		if (this.state.unitTemplatesManager.assignSuccess === true)  {
			tabSpecificComponents = <UnitTemplatesAssigned
																		data={this.state.unitTemplatesManager.lastActivityAssigned}
																		actions={this.unitTemplatesAssignedActions()}/>;
		} else if (this.state.tab == 'createUnit') {
			tabSpecificComponents = <CreateUnit data={{createUnitData: this.state.createUnit,
																						assignSuccessData: this.state.unitTemplatesManager.model}}
																						 actions={{toggleStage: this.toggleStage,
                                                       toggleTab: this.toggleTab,
                                                       assignActivityDueDate: this.assignActivityDueDate,
                                                       update: this.updateCreateUnitModel,
                                                       toggleActivitySelection: this.toggleActivitySelection,
																										 	 assignSuccessActions: 	this.unitTemplatesAssignedActions()}}
																						 analytics={this.analytics()}/>;
		} else if (this.state.tab == 'manageUnits') {
			tabSpecificComponents = <ManageUnits actions={{toggleTab: this.toggleTab, editUnit: this.editUnit}} />;
		} else if (this.state.tab == 'exploreActivityPacks') {
			tabSpecificComponents = <UnitTemplatesManager
																		data={this.state.unitTemplatesManager}
																		actions={this.unitTemplatesManagerActions()}/>;
    } else if (this.state.tab === 'assignANewActivity') {
			tabSpecificComponents = <AssignANewActivity toggleTab={this.toggleTab}/>;
																}

		return (
			<span>
				<UnitTabs tab={this.state.tab} toggleTab={this.toggleTab}/>
				<div id="lesson_planner" >
					{tabSpecificComponents}
				</div>
			</span>
		);

	}
});
