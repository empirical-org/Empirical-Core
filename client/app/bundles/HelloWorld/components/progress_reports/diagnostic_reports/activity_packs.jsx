import React from 'react'
import request from 'request';
import Units from '../../lesson_planner/manage_units/units.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyProgressReport from '../../shared/EmptyProgressReport.jsx'
import ClassroomDropdown from '../../general_components/dropdown_selectors/classroom_dropdown';
import getParameterByName from '../../modules/get_parameter_by_name';

'use strict'

export default React.createClass({

	getInitialState: function() {
		return {
			allUnits: [],
			units: [],
			loaded: false,
			classrooms: this.getClassrooms(),
			selectedClassroomId: getParameterByName('classroom_id'),
		}
	},

	componentWillMount() {
		document.getElementsByClassName('diagnostic-tab')[0].classList.remove('active');
		document.getElementsByClassName('activity-analysis-tab')[0].classList.add('active');
	},

	componentDidMount: function() {
		request.get({
			url: `${process.env.DEFAULT_URL}/teachers/units`,
			data: { report: true }
		}, (error, httpStatus, body) => {
			if(error) {
				alert('Unable to download your reports at this time.');
			} else {
				this.setAllUnits(JSON.parse(body));
			}
		});
		window.onpopstate = () => {
			this.setState({ loaded: false, selectedClassroomId: getParameterByName('classroom_id') });
			this.getUnitsForCurrentClass();
		};
	},

	getClassrooms() {
		request.get(`${process.env.DEFAULT_URL}/teachers/classrooms/classrooms_i_teach`, (error, httpStatus, body) => {
			const classrooms = JSON.parse(body).classrooms;
			if(classrooms.length > 0) {
				this.setState({ classrooms }, () => this.getUnits());
			} else {
				this.setState({ empty: true, loaded: true, });
			}
  	});
	},

	getUnits() {
		request.get(`${process.env.DEFAULT_URL}/teachers/units`, (error, httpStatus, body) => {
			this.setAllUnits(JSON.parse(body));
		});
	},

	getUnitsForCurrentClass() {
		if(this.state.selectedClassroomId) {
			const selectedClassroom = this.state.classrooms.find(c => c.id === Number(this.state.selectedClassroomId))
			const unitsInCurrentClassroom = _.reject(this.state.allUnits, unit => !unit.classrooms.includes(selectedClassroom.name));
			this.setState({ units: unitsInCurrentClassroom, loaded: true, });
		} else {
			this.setState({ units: this.state.allUnits, loaded: true })
		}
	},

	setAllUnits(data) {
		this.setState({ allUnits: this.parseUnits(data)}, this.getUnitsForCurrentClass);
	},

	generateNewCaUnit(u) {
    const caObj = {
      studentCount: Number(u.array_length ? u.array_length : u.class_size),
      classrooms: [u.class_name],
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
        if (!caUnit.classrooms.includes(u.class_name)) {
          // add the info and student count from the classroom if it hasn't already been done
          caUnit.classrooms.push(u.class_name);
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

	switchClassrooms(classroom) {
		const path = '/teachers/progress_reports/diagnostic_reports/#/activity_packs'
   	window.history.pushState({}, '', classroom.id ? `${path}?classroom_id=${classroom.id}` : path);
 		this.setState({ selectedClassroomId: classroom.id, }, () => this.getUnitsForCurrentClass());
  },

	stateBasedComponent: function() {
		if(!this.state.loaded) {
			return <LoadingSpinner />;
		}

		if(this.state.units.length === 0 && this.state.selectedClassroomId) {
			return (
				<EmptyProgressReport
					missing='activitiesForSelectedClassroom'
					onButtonClick={() => {
						this.setState({ selectedClassroomId: null, loaded: false });
						this.getUnitsForCurrentClass();
					}}
				/>
			);
		} else if(this.state.units.length === 0) {
			return (
				<EmptyProgressReport missing='activities'/>
			);
		} else {
			const allClassroomsClassroom = { name: 'All Classrooms' }
			const classrooms = [allClassroomsClassroom].concat(this.state.classrooms);
			const classroomWithSelectedId = classrooms.find(classroom => classroom.id === this.state.selectedClassroomId);
			const selectedClassroom = classroomWithSelectedId ? classroomWithSelectedId : allClassroomsClassroom;

			return (
				<div className='activity-analysis'>
					<h1>Activity Analysis</h1>
					<p>Open an activity analysis to view students' responses, the overall results on each question, and the concepts students need to practice.</p>
					<div className="classroom-selector">
						<p>Select a classroom:</p>
						<ClassroomDropdown
							classrooms={classrooms}
							callback={this.switchClassrooms}
							selectedClassroom={selectedClassroom}
						/>
					</div>
					<Units report={Boolean(true)} data={this.state.units}/>
				</div>
			);
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
