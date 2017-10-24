import React from 'react';
import request from 'request';
import Units from './units';
import ManageUnitsHeader from './manageUnitsHeader.jsx';
import EmptyAssignedUnits from './EmptyAssignedUnits.jsx';
import LoadingIndicator from '../../shared/loading_indicator';
import ClassroomDropdown from '../../general_components/dropdown_selectors/classroom_dropdown';
import getParameterByName from '../../modules/get_parameter_by_name';
import getAuthToken from '../../modules/get_auth_token'

export default React.createClass({

  getInitialState() {
    return {
      allUnits: [],
      units: [],
      loaded: false,
      classrooms: this.getClassrooms(),
      selectedClassroomId: getParameterByName('classroom_id'),
    }
  },

  getClassrooms() {
    request.get(`${process.env.DEFAULT_URL}/teachers/classrooms/classrooms_i_teach`, (error, httpStatus, body) => {
      const classrooms = JSON.parse(body).classrooms;
      if (classrooms.length > 0) {
        this.setState({ classrooms}, () => this.getUnits());
      } else {
        this.setState({ empty: true, loaded: true, });
      }
    });
  },

  hashLinkScroll() {
    const hash = window.location.hash;
    if (hash !== '') {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      element ? element.scrollIntoView() : null;
    }
  },

  getUnits() {
    request.get(`${process.env.DEFAULT_URL}/teachers/units`, (error, httpStatus, body) => {
      this.setAllUnits(JSON.parse(body))
    });
  },

  getUnitsForCurrentClass() {
    if (this.state.selectedClassroomId) {
      const selectedClassroom = this.state.classrooms.find(c => c.id === Number(this.state.selectedClassroomId))
      const unitsInCurrentClassroom = _.reject(this.state.allUnits, unit => !unit.classrooms.includes(selectedClassroom.name));
      this.setState({ units: unitsInCurrentClassroom, loaded: true, });
    } else {
      this.setState({units: this.state.allUnits, loaded: true})
    }
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

  setAllUnits(data) {
    this.setState({ allUnits: this.parseUnits(data)}, this.getUnitsForCurrentClass);
    this.hashLinkScroll();
  },

  hideUnit(id) {
    let units,
      x1;
    units = this.state.units;
    x1 = _.reject(units, unit => this.getIdFromUnit(unit) == id);
    this.setState({ units: x1, });

    request.put(`${process.env.DEFAULT_URL}/teachers/units/${id}/hide`, {
      json: {authenticity_token: getAuthToken()}
    });
  },

  hideClassroomActivity(ca_id, unit_id) {
    let units,
      x1;
    units = this.state.units;
    x1 = _.map(units, (unit) => {
      if (this.getIdFromUnit(unit) === unit_id) {
        if(unit.classroom_activities) {
          unit.classroom_activities = _.reject(unit.classroom_activities, ca => ca.id === ca_id);
        } else if(unit.classroomActivities) {
          unit.classroomActivities = new Map(_.reject(Array.from(unit.classroomActivities), ca => ca[1].caId === ca_id)); // This is very bad code.
        }
      }
      return unit;
    });
    this.setState({ units: x1, });

    request.put(`${process.env.DEFAULT_URL}/teachers/classroom_activities/${ca_id}/hide`, {
      json: {authenticity_token: getAuthToken()}
    })
  },

  updateDueDate(ca_id, date) {
    request.put(`${process.env.DEFAULT_URL}/teachers/classroom_activities/${ca_id}`, {
      json: { classroom_activity: { due_date: date, }, authenticity_token: getAuthToken()},
    });
  },

  switchClassrooms(classroom) {
    if (classroom.id) {
      window.history.pushState({}, '', `/teachers/classrooms/activity_planner?classroom_id=${classroom.id}`)
    } else {
      window.history.pushState({}, '', '/teachers/classrooms/activity_planner')
    }
    this.setState({ selectedClassroomId: classroom.id, }, () => this.getUnitsForCurrentClass());
  },

  stateBasedComponent() {
    let content
    if (this.state.units.length === 0 && this.state.loaded === true) {
      if (this.state.selectedClassroomId) {
        content = <p className="no-activity-packs">There are no activity packs assigned to this classroom. To assign a new activity pack, click the <strong>Assign A New Activity</strong> button above. To assign an existing activity pack to this classroom, select another classroom from the dropdown menu and click <strong>Edit Classes & Students</strong> next to the activity pack you'd like to assign.</p>
      } else {
        content = <p className="no-activity-packs">Welcome! This is where your assigned activity packs are stored, but it's empty at the moment. Let's assign your first activity pack by clicking on the <strong>Assign A New Activity</strong> button above.</p>
      }
    } else if (!this.state.loaded) {
      return <LoadingIndicator />;
    } else {
      content = <Units
                updateDueDate={this.updateDueDate}
                editUnit={this.props.actions.editUnit}
                hideClassroomActivity={this.hideClassroomActivity}
                hideUnit={this.hideUnit}
                data={this.state.units}
              />
    }
    const allClassroomsClassroom = {name: 'All Classrooms'}
    const classrooms = [allClassroomsClassroom].concat(this.state.classrooms)
    const classroomWithSelectedId = classrooms.find(classy => classy.id === this.state.selectedClassroomId)
    const selectedClassroom = classroomWithSelectedId ? classroomWithSelectedId : allClassroomsClassroom

    return (
      <span>
        {/* TODO: fix this so it links to the activity type selection page
          <div  className= "create-unit-button-container">
					<button onClick={this.switchToCreateUnit} className="button-green create-unit">Assign A New Activity</button>
				</div>*/}
        <ManageUnitsHeader />
        <div className="classroom-selector">
          <p>Select a classroom: </p>
          <ClassroomDropdown
            classrooms={classrooms}
            callback={this.switchClassrooms}
            selectedClassroom={selectedClassroom}
          />
        </div>
        {content}
      </span>
    );
    return <span />;
  },

  getIdFromUnit(unit) {
    return unit.unitId || unit.unit.id;
  },

  render() {
    return (
      <div className="container manage-units">
        {this.stateBasedComponent()}
      </div>
    );
  },

});
