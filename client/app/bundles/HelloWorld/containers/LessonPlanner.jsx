'use strict'

import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import _l from 'lodash'
import UnitTemplatesAssigned from '../components/lesson_planner/unit_template_assigned'
import CreateUnit from '../components/lesson_planner/create_unit/create_unit'
import ManageUnits from '../components/lesson_planner/manage_units/manage_units'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
import UnitTabs from '../components/lesson_planner/unit_tabs'
import fnl from '../components/modules/fnl'
import updaterGenerator from '../components/modules/updater'
import Server from '../components/modules/server/server'
import WindowPosition from '../components/modules/windowPosition'
import AnalyticsWrapper from '../components/shared/analytics_wrapper'
import AssignANewActivity from '../components/lesson_planner/create_unit/assign_a_new_activity.jsx'

export default React.createClass({
	propTypes: {
		grade: React.PropTypes.string,
		tab: React.PropTypes.string,
		classroomName: React.PropTypes.string,
		classroomId: React.PropTypes.string,
		students: React.PropTypes.string
	},

	analytics: function() {
		return new AnalyticsWrapper();
	},

	blankState: function() {
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
			}
		}
	},

	getInitialState: function() {
		this.modules = {
			fnl: new fnl,
			updaterGenerator: new updaterGenerator(this),
			unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
			windowPosition: new WindowPosition()
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

	editUnitRequestSuccess: function(data) {
		this.updateCreateUnitModel({id: data.id, name: data.name, dueDates: data.dueDates, selectedActivities: data.selectedActivities})
		this.updateCreateUnit({
			options: {
				classrooms: data.classrooms
			}
		})
		this.setState({tab: 'createUnit'})
	},

	assignActivityDueDate: function(activity, dueDate) {
		var dueDates = this.state.createUnit.model.dueDates || {}
		dueDates[activity.id] = dueDate;
		this.updateCreateUnitModel({dueDates: dueDates})
	},

	_modelsInGrade: function(grade) {
		return _.reject(this.state.unitTemplatesManager.models, function(m) {
			return _.indexOf(m.grades, grade)
		});
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

	toggleStage: function(stage) {
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
			success: function(data) {
				that.updateCreateUnit({
					options: {
						classrooms: data.classrooms_and_their_students
					}
				})
			}
		});
	},

	getInviteStudentsUrl: function() {
		return ('/teachers/classrooms/invite_students');
	},

	getSelectedActivities: function() {
		return this.state.createUnit.model.selectedActivities;
	},

	toggleActivitySelection: function(activity, true_or_false) {
		if (true_or_false) {
			this.analytics().track('select activity in lesson planner', {
				name: activity.name,
				id: activity.id
			});
		}
		var sas = this.modules.fnl.toggleById(this.getSelectedActivities(), activity);
		this.updateCreateUnitModel({selectedActivities: sas});
	},

	clickAssignButton: function() {
		this.updateUnitTemplatesManager({firstAssignButtonClicked: true});
	},

	unitTemplatesAssignedActions: function() {
		return {studentsPresent: this.props.students, getInviteStudentsUrl: this.getInviteStudentsUrl, getLastClassroomName: this.props.classroomName, unitTemplatesManagerActions: this.unitTemplatesManagerActions};
	},

	manageUnit: function()  {
		<ManageUnits actions={{
		 toggleTab: this.toggleTab,
		 editUnit: this.editUnit
	 }}/>;
	},

	render: function() {
		var tabSpecificComponents;
		// Ultimately, none of the tab state should exist, and we should transfer
		// entirely to react-router for managing that, along with redux for
		// the general state in this section
		const tabParam = this.props.params.tab
		// if (this.state.unitTemplatesManager.assignSuccess === true && (!tabParam || tabParam == ('featured-activity-packs' || 'explore-activity-packs'))) {
		// 	tabSpecificComponents = <UnitTemplatesAssigned data={this.state.unitTemplatesManager.lastActivityAssigned} actions={this.unitTemplatesAssignedActions()}/>;
		if ((tabParam === 'create-unit' || (this.state.tab == 'createUnit' && !tabParam))) {
			tabSpecificComponents = <CreateUnit data={{
				createUnitData: this.state.createUnit,
				assignSuccessData: this.state.unitTemplatesManager.model
			}} actions={{
				toggleStage: this.toggleStage,
				toggleTab: this.toggleTab,
				assignActivityDueDate: this.assignActivityDueDate,
				update: this.updateCreateUnitModel,
					toggleActivitySelection: this.toggleActivitySelection,
					assignSuccessActions: this.unitTemplatesAssignedActions()
				}} analytics={this.analytics()}/>;
		} else if ((tabParam === 'assign-new-activity') || (this.state.tab === 'assignANewActivity' && !tabParam)) {
			tabSpecificComponents = <AssignANewActivity toggleTab={this.toggleTab} flag={this.props.flag}/>;
		} else if ((tabParam === 'manage-units') || (this.state.tab == 'manageUnits' && !tabParam)) {
			tabSpecificComponents = <ManageUnits actions={{
			 toggleTab: this.toggleTab,
			 editUnit: this.editUnit
		 }}/>;
 	} else if (tabParam === 'explore-activity-packs' || tabParam === 'featured-activity-packs' || this.state.tab == 'exploreActivityPacks') {
			// tabSpecificComponents = <UnitTemplatesManager data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()}/>;
			tabSpecificComponents = <UnitTemplatesManager />
		}

		return (
			<span>
				<UnitTabs tab={tabParam || this.state.tab} toggleTab={this.toggleTab}/>
				<div id="lesson_planner">
					{tabSpecificComponents}
				</div>
			</span>
		);

	}
});
