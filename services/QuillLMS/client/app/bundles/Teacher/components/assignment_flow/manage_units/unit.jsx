import React from 'react';
import _ from 'underscore';
import Pluralize from 'pluralize';

import getAuthToken from '../../modules/get_auth_token'
import ClassroomActivity from './classroom_activity';
import AddClassroomActivityRow from './add_classroom_activity_row.jsx';
import { requestPut, } from '../../../../../modules/request/index'

export default class Unit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      unitName: (this.props.data.unitName || this.props.data.unit.name),
      savedUnitName: (this.props.data.unitName || this.props.data.unit.name),
      error: false,
    };

  }

  hideUnit = () => {
    const x = confirm('Are you sure you want to delete this Activity Pack? \n \nIt will delete all assignments given to students associated with this pack, even if those assignments have already been completed.');
    if (x) {
      this.props.hideUnit(this.getUnitId());
    }
  };

  assignedToText = () => {
    const dclassy = this.props.data.classrooms;
    // ensure classrooms is always an array as sometimes it is passed a set
    // and we need to do a number of things with it that are better with an array
    const classrooms = Array.isArray(dclassy) ? dclassy : Array.from(dclassy);
    const studentCount = this.props.data.num_students_assigned || this.props.data.studentCount;
    return (
      <div className="assigned-to">{`Assigned to ${studentCount} ${Pluralize('Student', studentCount)} in
    ${classrooms.length} ${Pluralize('class', classrooms.length)} (${classrooms.join(', ')}).`}</div>
    );
  };

  editUnit = () => {
    this.props.editUnit(this.getUnitId());
  };

  deleteOrLockedInfo = () => {
    const firstCa = this.props.data.classroomActivities.values().next().value;
    const ownedByCurrentUser = firstCa.ownedByCurrentUser;
    if (!this.props.report && !this.props.lesson && ownedByCurrentUser) {
      return <span className="delete-unit" onClick={this.hideUnit}>Delete</span>;
    } else if (!ownedByCurrentUser) {
      return <span className="locked-unit">   <img alt="" src="https://assets.quill.org/images/icons/lock-activity-pack-icon.svg"  />Created By {firstCa.ownerName}</span>;
    }
  };

  editName = () => {
    if (this.props.data.classroomActivities.values().next().value.ownedByCurrentUser) {
      let text,
        classy,
        inlineStyle;
      if (this.state.errors) {
        text = `${this.state.errors}. Click here to try again.`;
        classy = 'errors h-pointer';
        inlineStyle = { paddingTop: '4px', };
      } else {
        classy = 'edit-unit';
        text = 'Edit Name';
      }
      return <span className={classy} onClick={this.changeToEdit} style={inlineStyle}>{text}</span>;
    }
  };

  submitName = () => {
    return <span className="edit-unit" onClick={this.handleSubmit}>Submit</span>;
  };

  onSubmit = () => {
    requestPut('/teachers/units', { name: this.state.unitName, });
  };

  dueDate = () => {
    if (!this.props.report && !this.props.lesson) {
      return <span className="due-date-header">Due Date</span>;
    }
  };

  changeToEdit = () => {
    this.setState({ edit: true, });
  };

  handleNameChange = (e) => {
    this.setState({ unitName: e.target.value, });
  };

  editUnitName = () => {
    return <input onChange={this.handleNameChange} type="text" value={this.state.unitName} />;
  };

  editStudentsLink = () => {
    return this.props.report || this.props.lesson ? null : <a className="edit-unit edit-students" href={`/teachers/classrooms/activity_planner/units/${this.getUnitId()}/students/edit`}>Edit Classes & Students</a>;
  };

  handleSubmit = () => {
    requestPut(
      `${process.env.DEFAULT_URL}/teachers/units/${this.props.data.unitId}`,
      { unit: { name: this.state.unitName, }, },
      (body) => {
        this.setState({
          edit: false,
          errors: undefined,
          savedUnitName: this.state.unitName,
        });
      },
      (body) => {
        this.setState({
          errors: body.errors,
          edit: false,
          unitName: this.state.savedUnitName,
        });
      }
    )

  };

  showUnitName = () => {
    return <span className="h-pointer">{this.state.unitName}</span>;
  };

  showOrEditName = () => {
    return this.state.edit ? this.editUnitName() : this.showUnitName();
  };

  nameActionLink = () => {
    if (this.state.edit) {
      return this.submitName();
    } else if (this.props.report || this.props.lesson) {
      return null;
    }
    return this.editName();

    // return this.state.edit ? this.submitName() : this.editName()
  };

  getUnitId = () => {
    return this.props.data.unitId || this.props.data.unit.id;
  };

  addClassroomActivityRow = () => {
    if (this.props.data.classroomActivities.values().next().value.ownedByCurrentUser) {
      return this.props.report || this.props.lesson ? null : <AddClassroomActivityRow unitId={this.getUnitId()} unitName={this.props.data.unitName || this.props.data.unit.name} />;
    }
  };

  renderClassroomActivities = () => {
    const classroomActivitiesArr = [];
    if (this.props.data.classroom_activities) {
      this.props.data.classroom_activities.forEach((ca) => {
        classroomActivitiesArr.push(
          <ClassroomActivity
            activityWithRecommendationsIds={this.state.activityWithRecommendationsIds}
            data={ca}
            hideClassroomActivity={this.props.hideClassroomActivity}
            key={`${ca.id}-${this.props.data.unit.id}`}
            lesson={this.props.lesson}
            report={this.props.report}
            unitId={this.props.data.unit.id}
            updateDueDate={this.props.updateDueDate}
          />
        );
      });
    } else if (this.props.data.classroomActivities) {
      this.props.data.classroomActivities.forEach((ca, key) => {
        classroomActivitiesArr.push(
          <ClassroomActivity
            activityWithRecommendationsIds={this.state.activityWithRecommendationsIds}
            data={ca}
            hideClassroomActivity={this.props.hideClassroomActivity}
            key={`${this.props.data.unitId}-${key}`}
            lesson={this.props.lesson}
            report={this.props.report}
            unitId={this.props.data.unitId}
            updateDueDate={this.props.updateDueDate}
          />
        );
      })
    }
    return classroomActivitiesArr;
  };

  render() {
    if (this.props.data.classroomActivities.size === 0) {
      return null;
    }

    return (
      <section>
        <div className="row unit-header-row" id={this.getUnitId()}>
          <span className="unit-name">
            {this.showOrEditName()}
          </span>
          {this.nameActionLink()}
          {this.deleteOrLockedInfo()}
        </div>
        <div className="unit-label row">
          {this.assignedToText()}
          {this.editStudentsLink()}
          {this.dueDate()}
        </div>
        <div className="table assigned-activities">
          {this.renderClassroomActivities()}
          {this.addClassroomActivityRow()}
        </div>
      </section>
    );
  }
}
