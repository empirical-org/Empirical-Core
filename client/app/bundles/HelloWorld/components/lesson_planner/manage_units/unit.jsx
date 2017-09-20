import React from 'react';
import _ from 'underscore';
import ClassroomActivity from './classroom_activity';
import Pluralize from 'pluralize';
import AddClassroomActivityRow from './add_classroom_activity_row.jsx';

export default React.createClass({
  getInitialState() {
    return {
      edit: false,
      unitName: (this.props.data.unitName || this.props.data.unit.name),
      savedUnitName: (this.props.data.unitName || this.props.data.unit.name),
      error: false,
    };
  },

  hideUnit() {
    const x = confirm('Are you sure you want to delete this Activity Pack? \n \nIt will delete all assignments given to students associated with this pack, even if those assignments have already been completed.');
    if (x) {
      this.props.hideUnit(this.props.data.unitId || this.props.data.unit.id);
    }
  },

  assignedToText() {
    const dclassy = this.props.data.classrooms;
    // ensure classrooms is always an array as sometimes it is passed a set
    // and we need to do a number of things with it that are better with an array
    const classrooms = Array.isArray(dclassy) ? dclassy : [...dclassy];
    const studentCount = this.props.data.num_students_assigned || this.props.data.studentCount;
    return (<div className="assigned-to">{`Assigned to ${studentCount} ${Pluralize('Student', studentCount)} in
    ${classrooms.length} ${Pluralize('class', classrooms.length)} (${classrooms.join(', ')}).`}</div>);
  },

  editUnit() {
    this.props.editUnit(this.props.data.unitId || this.props.data.unit.id);
  },

  delete() {
    if (!this.props.report && !this.props.lesson) {
      return <span className="delete-unit" onClick={this.hideUnit}>Delete</span>;
    }
  },

  editName() {
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

    return <span style={inlineStyle} className={classy} onClick={this.changeToEdit}>{text}</span>;
  },

  submitName() {
    return <span className="edit-unit" onClick={this.handleSubmit}>Submit</span>;
  },

  onSubmit() {
    request.put('/teachers/units', { name: this.state.unitName, });
  },

  dueDate() {
    if (!this.props.report && !this.props.lesson) {
      return <span className="due-date-header">Due Date</span>;
    }
  },

  changeToEdit() {
    this.setState({ edit: true, });
  },

  handleNameChange(e) {
    this.setState({ unitName: e.target.value, }, console.log(this.state.unitName));
  },

  editUnitName() {
    return <input type="text" onChange={this.handleNameChange} value={this.state.unitName} />;
  },

  editStudentsLink() {
    return this.props.report || this.props.lesson ? null : <a className="edit-unit edit-students" href={`/teachers/classrooms/activity_planner/units/${this.props.data.unitId || this.props.data.unit.id}/students/edit`}>Edit Classes & Students</a>;
  },

  handleSubmit() {
    const that = this;
    $.ajax({
      type: 'PUT',
      url: `/teachers/units/${that.props.data.unitId}`,
      data: { unit: { name: that.state.unitName, }, },
      statusCode: {
        200() {
          that.setState({ edit: false,
            errors: undefined,
            savedUnitName: that.state.unitName, });
        },
        422(response) {
          that.setState({ errors: response.responseJSON.errors,
            edit: false,
            unitName: that.state.savedUnitName, });
        },
      },
      // error: this.setState.errors:
    });
  },

  showUnitName() {
    return <span className="h-pointer">{this.state.unitName}</span>;
  },

  showOrEditName() {
    return this.state.edit ? this.editUnitName() : this.showUnitName();
  },

  nameActionLink() {
    if (this.state.edit) {
      return this.submitName();
    } else if (this.props.report || this.props.lesson) {
      return null;
    }
    return this.editName();

    // return this.state.edit ? this.submitName() : this.editName()
  },

  addClassroomActivityRow() {
    return this.props.report || this.props.lesson ? null : <AddClassroomActivityRow unitId={this.props.data.unitId || this.props.data.unit.id} unitName={this.props.data.unitName || this.props.data.unit.name} />;
  },

  render() {
    const classroomActivities = _.map(this.props.data.classroom_activities, function (ca) {
      return (<ClassroomActivity
        key={ca.id}
        report={this.props.report}
        lesson={this.props.lesson}
        updateDueDate={this.props.updateDueDate}
        hideClassroomActivity={this.props.hideClassroomActivity}
        data={ca}
      />);
    }, this);
    return (
      <section>
        <div className="row unit-header-row" id={this.props.data.unitId || this.props.data.unit.id}>
          <span className="unit-name">
            {this.showOrEditName()}
          </span>
          {this.nameActionLink()}
          {this.delete()}
        </div>
        <div className="unit-label row">
          {this.assignedToText()}
          {this.editStudentsLink()}
          {this.dueDate()}
        </div>
        <div className="table assigned-activities">
          {classroomActivities}
          {this.addClassroomActivityRow()}
        </div>
      </section>
    );
  },
});
