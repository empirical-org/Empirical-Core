import React from 'react'
import Units from '../../lesson_planner/manage_units/units.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyProgressReport from '../../shared/EmptyProgressReport.jsx'
import $ from 'jquery'

'use strict'

export default React.createClass({

	getInitialState: function() {
		return {units: [], loaded: false}
	},

	componentWillMount(){
		$('.diagnostic-tab').removeClass('active');
		$('.activity-analysis-tab').addClass('active');
	},

	componentDidMount: function() {
		$.ajax({url: '/teachers/units', data: {report: true}, success: this.displayUnits, error: function() {alert('Unable to download your reports at this time.')}});
	},

	displayUnits: function(data) {
		this.setState({units: this.parseUnits(data), loaded: true});
	},

	switchToExploreActivityPacks: function(){
		window.location.href = '/teachers/classrooms/activity_planner?tab=exploreActivityPacks';
	},

	generateNewCaUnit(u) {
    const caObj = {
      studentCount: Number(u.array_length ? u.array_length : u.class_size),
      classrooms: new Set([u.class_name]),
      classroomActivities: new Map(),
      unitId: u.unit_id,
      unitCreated: u.unit_created_at,
      unitName: u.unit_name,
    };
    caObj.classroomActivities.set(u.activity_id, {
      name: u.activity_name,
      activityId: u.activity_id,
      created_at: u.classroom_activity_created_at,
      caId: u.classroom_activity_id,
      activityClassificationId: u.activity_classification_id,
			classroomId: u.classroom_id,
      dueDate: u.due_date, });
    return caObj;
  },

  parseUnits(data) {
    const parsedUnits = {};
    data.forEach((u) => {
      if (!parsedUnits[u.unit_id]) {
        // if this unit doesn't exist yet, go create it with the info from the first ca
        parsedUnits[u.unit_id] = this.generateNewCaUnit(u);
      } else {
        const caUnit = parsedUnits[u.unit_id];
        if (!caUnit.classrooms.has(u.class_name)) {
          // add the info and student count from the classroom if it hasn't already been done
          caUnit.classrooms.add(u.class_name);
          caUnit.studentCount += Number(u.array_length ? u.array_length : u.class_size);
        }
        // add the activity info if it doesn't exist
        caUnit.classroomActivities.set(u.activity_id,
          caUnit.classroomActivities[u.activity_id] || {
          name: u.activity_name,
          caId: u.classroom_activity_id,
					activityId: u.activity_id,
          created_at: u.classroom_activity_created_at,
          activityClassificationId: u.activity_classification_id,
					classroomId: u.classroom_id,
          createdAt: u.ca_created_at,
          dueDate: u.due_date, });
      }
    });
    return this.orderUnits(parsedUnits);
  },

  orderUnits(units) {
    const unitsArr = [];
    Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
    return unitsArr;
  },

	stateBasedComponent: function() {
		if (this.state.loaded) {
			if (this.state.units.length === 0) {
				return (
					<EmptyProgressReport missing='activities'/>
				);
			} else {
				return (
					<div className='activity-analysis'>
						<h1>Activity Analysis</h1>
						<p>Open an activity analysis to view students' responses, the overall results on each question, and the concepts students need to practice.</p>
						<Units report={Boolean(true)} data={this.state.units}/>
					</div>
				);
			}
		} else {
			return (
			<LoadingSpinner />
			)
		}
	},

	render: function() {

		return (
			<div className="container manage-units">
				{this.stateBasedComponent()}
			</div>
		);

	}

});
