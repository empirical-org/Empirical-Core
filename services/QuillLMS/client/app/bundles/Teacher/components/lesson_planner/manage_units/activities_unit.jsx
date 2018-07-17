import React from 'react';
import _ from 'underscore';
import ClassroomActivity from './classroom_activity';
import Pluralize from 'pluralize';
import AddClassroomActivityRow from './add_classroom_activity_row.jsx';
import moment from 'moment'

export default React.createClass({
  getInitialState() {
    return {
      edit: false,
      unitName: (this.props.data.unitName || this.props.data.unit.name),
      savedUnitName: (this.props.data.unitName || this.props.data.unit.name),
      error: false,
      showTooltip: false,
      classroomActivities: (this.props.data.classroomActivities || this.props.data.classroom_activities)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.classroomActivities && (nextProps.data.classroomActivities.length === this.state.classroomActivities.length)) {
      this.setState({classroomActivities: nextProps.data.classroomActivities})
    } else if (nextProps.data.classroom_activities && (nextProps.data.classroom_activities.length === this.state.classroomActivities.length)) {
      this.setState({classroomActivities: nextProps.data.classroom_activities})
    }
  },

  hideUnit() {
    const x = confirm('Are you sure you want to delete this Activity Pack? \n \nIt will delete all assignments given to students associated with this pack, even if those assignments have already been completed.');
    if (x) {
      this.props.hideUnit(this.getUnitId());
    }
  },

  assignedToSection() {
    const dclassy = this.props.data.classrooms;
    // ensure classrooms is always an array as sometimes it is passed a set
    // and we need to do a number of things with it that are better with an array
    const classrooms = Array.isArray(dclassy) ? dclassy : [...dclassy];
    const classroomList = this.classroomList(classrooms)
    return (<div className="assigned-to">
      <span className="heading">Assigned to {classrooms.length} {Pluralize('class', classrooms.length)}:</span>
      <ul>
        {classroomList}
      </ul>
    </div>);
  },

  classroomList(classrooms) {
    if (classrooms.length >= 4 && !this.state.showAllClassrooms) {
      const classroomsArray = classrooms.slice(0, 3).map((c, i) => <li key={i}>{c.name} <span>({c.assignedStudentCount}/{c.totalStudentCount} {Pluralize('student', c.totalStudentCount)})</span></li>)
      classroomsArray.push(<li className="see-all" onClick={() => this.setState({showAllClassrooms: true})}>Show all {classrooms.length} classes <i className="fa fa-icon fa-chevron-down"/></li>)
      return classroomsArray
    } else {
      return classrooms.map((c, i) => <li key={i}>{c.name} <span>({c.assignedStudentCount}/{c.totalStudentCount} {Pluralize('student', c.totalStudentCount)})</span></li>)
    }
  },

  editUnit() {
    this.props.editUnit(this.getUnitId());
  },

  deleteOrLockedInfo() {
    const firstCa = this.state.classroomActivities.values().next().value
    const ownedByCurrentUser = firstCa.ownedByCurrentUser
    if (!this.props.report && !this.props.lesson && ownedByCurrentUser) {
      return <span className="delete-unit" onClick={this.hideUnit}>Delete Activity Pack</span>;
    } else if (!ownedByCurrentUser) {
      return <span
        className='locked-unit'
        onMouseEnter={this.toggleTooltip}
        onMouseLeave={this.toggleTooltip}
        >
          <img src="https://assets.quill.org/images/icons/lock-activity-pack-icon.svg"/>
          Created By {firstCa.ownerName}
          {this.renderTooltip()}
        </span>
    }
  },

  editName() {
    if(this.state.classroomActivities.values().next().value.ownedByCurrentUser) {
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
    }
  },

  submitName() {
    return <span className="edit-unit" onClick={this.handleSubmit}>Submit</span>;
  },

  onSubmit() {
    request.put('/teachers/units', { name: this.state.unitName, });
  },

  toggleTooltip() {
    this.setState({showTooltip: !this.state.showTooltip})
  },

  renderTooltip() {
  const visible = this.state.showTooltip ? 'visible' : 'invisible'
    const ownerName = this.state.classroomActivities.values().next().value.ownerName
    return <div className={`tooltip ${visible}`}>
      <i className="fa fa-caret-up"/>
      <p>Since {ownerName} created this activity pack, you are unable to edit this activity pack. You can ask the creator to edit it.</p>
      <p>If you would like to assign additional practice activities, you can create a new pack for your students.</p>
    </div>
  },

  changeToEdit() {
    this.setState({ edit: true, });
  },

  handleNameChange(e) {
    this.setState({ unitName: e.target.value, });
  },

  editUnitName() {
    return <input type="text" onChange={this.handleNameChange} value={this.state.unitName} />;
  },

  editStudentsLink() {
    return this.props.report || this.props.lesson ? null : <a className="edit-unit edit-students" href={`/teachers/classrooms/activity_planner/units/${this.getUnitId()}/students/edit`}>Edit Classes & Students</a>;
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

  getUnitId() {
    return this.props.data.unitId || this.props.data.unit.id;
  },

  addClassroomActivityRow() {
    if(this.state.classroomActivities.values().next().value.ownedByCurrentUser) {
      return this.props.report || this.props.lesson ? null : <AddClassroomActivityRow unitId={this.getUnitId()} unitName={this.props.data.unitName || this.props.data.unit.name} />;
    }
  },

  updateAllDueDates(date) {
    const newClassroomActivities = new Map(this.state.classroomActivities)
    const uaIds = []
    this.state.classroomActivities.forEach((v, k) => {
      uaIds.push(v.uaId)
      const classroomActivity = newClassroomActivities.get(k)
      classroomActivity.dueDate = moment(date)
      newClassroomActivities.set(k, classroomActivity)
    })
    this.setState({classroomActivities: newClassroomActivities})
    this.props.updateMultipleDueDates(uaIds, date)
  },

  numberOfStudentsAssignedToUnit() {
    const dclassy = this.props.data.classrooms;
    // ensure classrooms is always an array as sometimes it is passed as a set
    const classrooms = Array.isArray(dclassy) ? dclassy : [...dclassy];
    let numberOfStudentsAssignedToUnit = 0;
    classrooms.forEach(c => {
      numberOfStudentsAssignedToUnit += Number(c.assignedStudentCount);
    });
    return numberOfStudentsAssignedToUnit;
  },

  renderClassroomActivities() {
    const classroomActivitiesArr = [];
      for (const [key, ca] of this.state.classroomActivities) {
        const isFirst = this.state.classroomActivities.values().next().value.caId === ca.caId
        classroomActivitiesArr.push(
          <ClassroomActivity
            key={`${this.props.data.unitId}-${key}`}
            report={this.props.report}
            activityReport={this.props.activityReport}
            lesson={this.props.lesson}
            updateDueDate={this.props.updateDueDate}
            hideUnitActivity={this.props.hideUnitActivity}
            unitId={this.props.data.unitId}
            data={ca}
            updateAllDueDates={this.updateAllDueDates}
            isFirst={isFirst}
            numberOfStudentsAssignedToUnit={this.numberOfStudentsAssignedToUnit()}
          />
        );
    }
    return classroomActivitiesArr;
  },

  render() {
    if (this.state.classroomActivities.size === 0) {
      return null;
    }

    return (
      <section className="activities-unit">
        <div className="row unit-header-row" id={this.getUnitId()}>
          <div className="left">
            <span className="unit-name">
              {this.showOrEditName()}
            </span>
            <span>
              {this.nameActionLink()}
              {this.deleteOrLockedInfo()}
            </span>
          </div>
          <div className="right">
            {this.assignedToSection()}
          </div>
          {this.editStudentsLink()}
        </div>
        <div className="table assigned-activities">
          {this.renderClassroomActivities()}
          {this.addClassroomActivityRow()}
        </div>
      </section>
    );
  },
});
