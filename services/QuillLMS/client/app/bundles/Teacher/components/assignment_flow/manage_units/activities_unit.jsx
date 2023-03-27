import moment from 'moment';
import Pluralize from 'pluralize';
import React from 'react';

import AddClassroomActivityRow from './add_classroom_activity_row.jsx';
import ClassroomActivity from './classroom_activity';

import { defaultSnackbarTimeout, Snackbar } from '../../../../Shared/index';
import * as api from '../../modules/call_api';

export default class ActivitiesUnit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      unitName: (this.props.data.unitName || this.props.data.unit.name),
      savedUnitName: (this.props.data.unitName || this.props.data.unit.name),
      error: false,
      showTooltip: false,
      classroomActivities: (this.props.data.classroomActivities || this.props.data.classroom_activities),
      activityOrder: Array.from(this.props.data.classroomActivities.keys()),
      snackbarVisible: false,
      snackbarFadeTimer: null,
      allowSorting: this.props.allowSorting || false,
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.classroomActivities && (nextProps.data.classroomActivities.length === this.state.classroomActivities.length)) {
      this.setState({ classroomActivities: nextProps.data.classroomActivities, });
    } else if (nextProps.data.classroom_activities && (nextProps.data.classroom_activities.length === this.state.classroomActivities.length)) {
      this.setState({ classroomActivities: nextProps.data.classroom_activities, });
    }
  }

  getUnitId = () => {
    return this.props.data.unitId || this.props.data.unit.id;
  }


  addClassroomActivityRow = () => {
    if (this.state.classroomActivities.values().next().value.ownedByCurrentUser) {
      return this.props.report || this.props.lesson ? null : <AddClassroomActivityRow unitId={this.getUnitId()} unitName={this.props.data.unitName || this.props.data.unit.name} />;
    }
  }

  assignedToSection = () => {
    const dclassy = this.props.data.classrooms;
    // ensure classrooms is always an array as sometimes it is passed a set
    // and we need to do a number of things with it that are better with an array
    const classrooms = Array.isArray(dclassy) ? dclassy : Array.from(dclassy);
    const classroomList = this.classroomList(classrooms);
    return (
      <div className="assigned-to">
        <span className="heading">Assigned to {classrooms.length} {Pluralize('class', classrooms.length)}:</span>
        <ul>
          {classroomList}
        </ul>
      </div>
    );
  }

  changeToEdit = () => {
    this.setState({ edit: true, });
  }

  classroomList = (classrooms) => {
    if (classrooms.length >= 4 && !this.state.showAllClassrooms) {
      const classroomsArray = classrooms.slice(0, 3).map((c, i) => <li key={i}>{c.name} <span>({c.assignedStudentCount}/{c.totalStudentCount} {Pluralize('student', c.totalStudentCount)})</span></li>)
      classroomsArray.push(<button className="interactive-wrapper focus-on-light" onClick={() => this.setState({showAllClassrooms: true})} type="button"><li className="see-all" >Show all {classrooms.length} classes <i className="fas fa-icon fa-chevron-down" /></li></button>)
      return classroomsArray
    }
    return classrooms.map((c, i) => <li key={i}>{c.name} <span>({c.assignedStudentCount}/{c.totalStudentCount} {Pluralize('student', c.totalStudentCount)})</span></li>)

  }

  deleteOrLockedInfo = () => {
    const firstCa = this.state.classroomActivities.values().next().value;
    const ownedByCurrentUser = this.ownedByCurrentUser();
    if (!this.props.report && !this.props.lesson && ownedByCurrentUser) {
      return <span className="delete-unit" onClick={this.hideUnit}>Delete Activity Pack</span>;
    } else if (!ownedByCurrentUser) {
      return (
        <span
          className='locked-unit'
          onMouseEnter={this.toggleTooltip}
          onMouseLeave={this.toggleTooltip}
        >
          <img alt="" src="https://assets.quill.org/images/icons/lock-activity-pack-icon.svg" />
          Created By {firstCa.ownerName}
          {this.renderTooltip()}
        </span>
      );
    }
  }

  displaySaveSnackbar = () => {
    if (this.state.snackbarFadeTimer) {
      clearTimeout(this.state.snackbarFadeTimer);
    }
    this.setState({snackbarVisible: true, snackbarFadeTimer: setTimeout(() => {
      this.setState({snackbarVisible: false});
    }, defaultSnackbarTimeout)});
  }

  editName = () => {
    if (this.ownedByCurrentUser()) {
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
  }

  editStudentsLink = () => {
    const ownedByCurrentUser = this.ownedByCurrentUser()
    const { report, lesson, } = this.props
    if (!ownedByCurrentUser || report || lesson) {
      return null
    } else {
      return <a className="edit-unit edit-students" href={`/teachers/classrooms/activity_planner/units/${this.getUnitId()}/students/edit`}>Edit Classes & Students</a>
    }
  }

  editUnit = () => {
    this.props.editUnit(this.getUnitId());
  }

  editUnitName = () => {
    return <input onChange={this.handleNameChange} type="text" value={this.state.unitName} />;
  }

  handleNameChange = (e) => {
    this.setState({ unitName: e.target.value, });
  }

  handleSubmit = () => {
    const that = this;
    api.changeActivityPackName(that.props.data.unitId, that.state.unitName,
      () => that.setState({edit: false,
        errors: undefined,
        savedUnitName: that.state.unitName}),
      (response) => that.setState({errors: response.body.errors,
        edit: false,
        unitName: that.state.savedUnitName}));
  }

  hideUnit = () => {
    const x = confirm('Are you sure you want to delete this Activity Pack? \n \nIt will delete all assignments given to students associated with this pack, even if those assignments have already been completed.');
    if (x) {
      this.props.hideUnit(this.getUnitId());
    }
  }

  nameActionLink = () => {
    if (this.state.edit) {
      return this.submitName();
    } else if (this.props.report || this.props.lesson) {
      return null;
    }
    return this.editName();

    // return this.state.edit ? this.submitName() : this.editName()
  }

  numberOfStudentsAssignedToUnit = () => {
    const dclassy = this.props.data.classrooms;
    // ensure classrooms is always an array as sometimes it is passed as a set
    const classrooms = Array.isArray(dclassy) ? dclassy : Array.from(dclassy);
    let numberOfStudentsAssignedToUnit = 0;
    classrooms.forEach((c) => {
      numberOfStudentsAssignedToUnit += Number(c.assignedStudentCount);
    });
    return numberOfStudentsAssignedToUnit;
  }

  ownedByCurrentUser = () => {
    const firstCa = this.state.classroomActivities.values().next().value;
    return firstCa.ownedByCurrentUser;
  }

  saveSortOrder = () => {
    this.updateActivitiesApi(this.props.data.unitId, this.state.activityOrder, this.displaySaveSnackbar);
  }

  showOrEditName = () => {
    return this.state.edit ? this.editUnitName() : this.showUnitName();
  }

  showUnitName = () => {
    return <span className="h-pointer">{this.state.unitName}</span>;
  }

  submitName = () => {
    return <span className="edit-unit" onClick={this.handleSubmit}>Submit</span>;
  }

  toggleTooltip = () => {
    this.setState({ showTooltip: !this.state.showTooltip ,});
  }

  updateActivitiesApi = (unitId, activityIds, successHandler, errorHandler) => {
    api.changeActivityPackOrder(unitId, activityIds, successHandler, errorHandler);
  }

  updateAllDueDates = (date) => {
    const newClassroomActivities = new Map(this.state.classroomActivities);
    const uaIds = [];
    this.state.classroomActivities.forEach((v, k) => {
      uaIds.push(v.uaId);
      const classroomActivity = newClassroomActivities.get(k);
      classroomActivity.dueDate = moment(date);
      newClassroomActivities.set(k, classroomActivity);
    });
    this.setState({ classroomActivities: newClassroomActivities, });
    this.props.updateMultipleDueDates(uaIds, date);
  }

  renderClassroomActivities = () => {
    const { allowSorting, activityOrder, classroomActivities, } = this.state
    const {
      activityReport,
      activityWithRecommendationsIds,
      hideUnitActivity,
      data,
      lesson,
      report,
      updateDueDate,
    } = this.props
    const classroomActivitiesArr = [];
    let i = 0;
    for (let key of activityOrder) {
      const ca = classroomActivities.get(key);
      if (ca) {
        classroomActivitiesArr.push(
          <ClassroomActivity
            activityReport={activityReport}
            activityWithRecommendationsIds={activityWithRecommendationsIds}
            data={ca}
            hideUnitActivity={hideUnitActivity}
            isFirst={i === 0}
            key={`${data.unitId}-${key}`}
            lesson={lesson}
            numberOfStudentsAssignedToUnit={this.numberOfStudentsAssignedToUnit()}
            report={report}
            unitId={data.unitId}
            updateAllDueDates={this.updateAllDueDates}
            updateDueDate={updateDueDate}
          />
        );
        i += 1;
      }
    }

    return classroomActivitiesArr;
  }

  renderTooltip = () => {
    const visible = this.state.showTooltip ? 'visible' : 'invisible';
    const ownerName = this.state.classroomActivities.values().next().value.ownerName;
    return (
      <div className={`tooltip ${visible}`}>
        <i className="fas fa-caret-up" />
        <p>Since {ownerName} created this activity pack, you are unable to edit this activity pack. You can ask the creator to edit it.</p>
        <p>If you would like to assign additional practice activities, you can create a new pack for your students.</p>
      </div>
    );
  }

  render = () => {
    if (this.state.classroomActivities.size === 0) {
      return null;
    }

    return (
      <div>
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
        <Snackbar text="Activity order saved" visible={this.state.snackbarVisible} />
      </div>
    );
  }
}
