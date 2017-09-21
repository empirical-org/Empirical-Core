import React from 'react';
import $ from 'jquery';
import Units from './units';
import ManageUnitsHeader from './manageUnitsHeader.jsx';
import EmptyAssignedUnits from './EmptyAssignedUnits.jsx';
import LoadingIndicator from '../../shared/loading_indicator';

export default React.createClass({

  getInitialState() {
    return {
      units: [],
      loaded: false,
    };
  },

  componentWillMount() {
    $.ajax({
      url: '/teachers/units',
      data: {},
      success: this.displayUnits,
      error() {
      },
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
          activityClassificationId: u.activity_classification_id,
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

  displayUnits(data) {
    this.setState({ units: this.parseUnits(data), loaded: true, });
    this.hashLinkScroll();
  },

  hideUnit(id) {
    let units,
      x1;
    units = this.state.units;
    x1 = _.reject(units, unit => unit.unit.id == id);
    this.setState({ units: x1, });

    $.ajax({
      type: 'put',
      url: `/teachers/units/${id}/hide`,
      success() {
      },
      error() {
      },
    });
  },
  hideClassroomActivity(ca_id, unit_id) {
    let units,
      x1;
    units = this.state.units;
    x1 = _.map(units, (unit) => {
      if (unit.unit.id === unit_id) {
        unit.classroom_activities = _.reject(unit.classroom_activities, ca => ca.id === ca_id);
      }
      return unit;
    });
    this.setState({ units: x1, });

    $.ajax({
      type: 'put',
      url: `/teachers/classroom_activities/${ca_id}/hide`,
      success() {
      },
      error() {
      },
    });
  },

  updateDueDate(ca_id, date) {
    $.ajax({
      type: 'put',
      dataType: 'json',
      data: { classroom_activity: { due_date: date, }, },
      url: `/teachers/classroom_activities/${ca_id}`,
      success() {
      },
      error() {
      },

    });
  },

  switchToCreateUnit() {
    this.props.actions.toggleTab('createUnit');
  },

  stateBasedComponent() {
    if (this.state.units.length === 0 && this.state.loaded === true) {
      return <EmptyAssignedUnits />;
    } else if (!this.state.loaded) {
      return <LoadingIndicator />;
    }
    return (
      <span>
        {/* TODO: fix this so it links to the activity type selection page
          <div  className= "create-unit-button-container">
					<button onClick={this.switchToCreateUnit} className="button-green create-unit">Assign A New Activity</button>
				</div>*/}
        <ManageUnitsHeader />
        <Units
          updateDueDate={this.updateDueDate}
          editUnit={this.props.actions.editUnit}
          hideClassroomActivity={this.hideClassroomActivity}
          hideUnit={this.hideUnit}
          data={this.state.units}
        />
      </span>
    );
    return <span />;
  },

  render() {
    return (
      <div className="container manage-units">
        {this.stateBasedComponent()}
      </div>
    );
  },

});
