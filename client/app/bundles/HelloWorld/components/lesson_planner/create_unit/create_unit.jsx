import React from 'react';
import UnitStage1 from './stage1/unit_stage1';
import Stage2 from './stage2/Stage2';
import UnitTemplatesAssigned from '../unit_template_assigned';
import _ from 'underscore';
import $ from 'jquery';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    analytics: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      prohibitedUnitNames: [],
      newUnitId: null,
    };
  },

  componentDidMount() {
    this.getProhibitedUnitNames();
  },

  getProhibitedUnitNames() {
	  const that = this;
    $.get('/teachers/prohibited_unit_names').done((data) => {
      that.setState({ prohibitedUnitNames: data.prohibitedUnitNames, });
    });
  },

  isUnitNameUnique() {
    const unit = this.getUnitName();
    return !this.state.prohibitedUnitNames.includes(unit.toLowerCase());
  },

  getStage() {
    return this.props.data.createUnitData.stage;
  },

  getSelectedActivities() {
    return this.props.data.createUnitData.model.selectedActivities;
  },

  getClassrooms() {
    if (this.props.data.createUnitData.options) {
      return this.props.data.createUnitData.options.classrooms || [];
    }
    return undefined;
  },

  getUnitName() {
    return this.props.data.createUnitData.model.name || '';
  },

  getId() {
    return this.props.data.createUnitData.model.id;
  },

  toggleClassroomSelection(classroom) {
    const classrooms = this.getClassrooms();
    if (!classrooms) {
      return;
    }
    const updated = _.map(classrooms, function (c) {
      if (c.classroom.id == classroom.id) {
        if (c.students.length == 0) {
          c.emptyClassroomSelected = (this.toggleEmptyClassroomSelected(c));
        } else {
          const selected = _.where(c.students, { isSelected: true, });
          let updatedStudents;
          if (selected.length == c.students.length) {
            updatedStudents = _.map(c.students, (s) => {
              s.isSelected = false;
              return s;
            });
          } else {
            updatedStudents = _.map(c.students, (s) => {
              s.isSelected = true;
              return s;
            });
          }
          c.students = updatedStudents;
        }
      }
      return c;
    }, this);
    this.setState({ classrooms: updated, });
  },

  toggleStudentSelection(student, classroom, flag) {
    const updated = _.map(this.getClassrooms(), (c) => {
      if (c.classroom.id == classroom.id) {
        const updated_students = _.map(c.students, (s) => {
          if (s.id == student.id) {
            s.isSelected = flag;
          }
          return s;
        });
        c.students = updated_students;
      }
      return c;
    }, this);
    this.setState({ classrooms: updated, });
  },

  updateUnitName(unitName) {
    this.isUnitNameValid();
    this.props.actions.update({ name: unitName, });
  },

  clickContinue() {
    this.props.analytics.track('click Continue in lesson planner');
    this.props.actions.toggleStage(2);
    this.resetWindowPosition();
  },

  resetWindowPosition() {
    window.scrollTo(500, 0);
  },

  finish() {
    $.ajax({
      type: 'POST',
      url: '/teachers/units',
      data: JSON.stringify(this.formatCreateRequestData()),
      dataType: 'json',
      contentType: 'application/json',
      success: response => this.onCreateSuccess(response),
    });
  },

  formatCreateRequestData() {
    let classroomPostData = _.select(this.getClassrooms(), function (c) {
      let includeClassroom,
        selectedStudents;
      if (this.emptyClassroomSelected(c)) {
        includeClassroom = true;
      } else {
        selectedStudents = _.where(c.students, { isSelected: true, });
        includeClassroom = selectedStudents.length > 0;
      }
      return includeClassroom;
    }, this);

    classroomPostData = _.map(classroomPostData, (c) => {
      let selectedStudentIds;
      const selectedStudents = _.where(c.students, { isSelected: true, });
      if (selectedStudents.length == c.students.length) {
        selectedStudentIds = [];
      } else {
        selectedStudentIds = _.map(selectedStudents, s => s.id);
      }
      return { id: c.classroom.id, student_ids: selectedStudentIds, };
    });

    const sas = this.getSelectedActivities();

    const activityPostData = _.map(sas, function (sa) {
      return {
        id: sa.id,
        due_date: this.dueDate(sa.id),
      };
    }, this);

    const x = {
      unit: {
        id: this.getId(),
        name: this.getUnitName(),
        classrooms: classroomPostData,
        activities: activityPostData,
      },
    };
    return x;
  },

  onCreateSuccess(response) {
    this.setState({ newUnitId: response.id, });
    this.props.actions.toggleStage(3);
  },

  isUnitNameValid() {
    return ((this.getUnitName() != null) && (this.getUnitName() != ''));
  },

  determineIfInputProvidedAndValid() {
		// TODO: pull this into stage 2 or delete
    // const validUnitName = this.isUnitNameValid();
    // let isUnique;
    // if (validUnitName) {
    //   isUnique = this.isUnitNameUnique();
    // }
    return (this.getSelectedActivities().length > 0);
  },

  emptyClassroomSelected(c) {
    const val = (c.emptyClassroomSelected === true);
    return val;
  },

  toggleEmptyClassroomSelected(c) {
    return !(this.emptyClassroomSelected(c));
  },

  areAnyStudentsSelected() {
    const x = _.select(this.getClassrooms(), function (c) {
      let includeClassroom;
      if (this.emptyClassroomSelected(c)) {
        includeClassroom = true;
      } else {
        const y = _.where(c.students, { isSelected: true, });
        includeClassroom = y.length > 0;
      }
      return includeClassroom;
    }, this);

    return (x.length > 0);
  },

  determineStage1ErrorMessage() {
    if (!this.getSelectedActivities().length > 0) {
      return 'Please select activities';
    }
  },

  determineStage2ErrorMessage() {
    if (!this.areAnyStudentsSelected()) {
      return 'Please select students';
    } else if (!this.isUnitNameValid()) {
      return 'Please provide a name for your activity pack.';
    } else if (!this.isUnitNameUnique()) {
      return 'Please select a unique name for your activity pack.';
    }
  },

  dueDate(id) {
    if (this.props.data.createUnitData.model.dueDates && this.props.data.createUnitData.model.dueDates[id]) {
      return this.props.data.createUnitData.model.dueDates[id];
    }
  },

  stage1SpecificComponents() {
    return (<UnitStage1
      toggleActivitySelection={this.props.actions.toggleActivitySelection}
      selectedActivities={this.getSelectedActivities()}
      determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
      errorMessage={this.determineStage1ErrorMessage()}
      clickContinue={this.clickContinue}
    />);
  },

  stage2SpecificComponents() {
    return (<Stage2
      selectedActivities={this.getSelectedActivities()}
      data={this.props.data.assignSuccessData}
      unitName={this.getUnitName()} updateUnitName={this.updateUnitName}
      dueDates={this.props.data.createUnitData.model.dueDates}
      actions={this.props.actions.assignSuccessActions}
      classrooms={this.getClassrooms()}
      toggleActivitySelection={this.props.actions.toggleActivitySelection}
      toggleClassroomSelection={this.toggleClassroomSelection}
      toggleStudentSelection={this.toggleStudentSelection}
      finish={this.finish}
      unitName={this.getUnitName()}
      assignActivityDueDate={this.props.actions.assignActivityDueDate}
      areAnyStudentsSelected={this.areAnyStudentsSelected()}
      errorMessage={this.determineStage2ErrorMessage()}
    />);
  },

  stage3specificComponents() {
    if ((!!this.props.actions.assignSuccessActions) && (!!this.props.data.assignSuccessData)) {
      return (<UnitTemplatesAssigned actions={this.props.actions.assignSuccessActions} data={this.props.data.assignSuccessData} />);
    }
    window.location.href = `/teachers/classrooms/activity_planner#${this.state.newUnitId}`;
  },

  render() {
    let stageSpecificComponents;

    if (this.getStage() === 1) {
      stageSpecificComponents = this.stage1SpecificComponents();
    } else if (this.getStage() === 2) {
      stageSpecificComponents = this.stage2SpecificComponents();
    } else if (this.getStage() === 3) {
      stageSpecificComponents = this.stage3specificComponents();
    }
    return (
      <span>
        <div className="container">
          {stageSpecificComponents}
        </div>
      </span>

    );
  },
});
