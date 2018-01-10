import React from 'react';
import UnitStage1 from './stage1/unit_stage1';
import Stage2 from './stage2/Stage2';
import UnitTemplatesAssigned from '../unit_template_assigned';
import _ from 'underscore';
import $ from 'jquery';
import AnalyticsWrapper from '../../shared/analytics_wrapper';

export default React.createClass({
  getInitialState() {
    return {
      prohibitedUnitNames: [],
      newUnitId: null,
      stage: 1,
      selectedActivities: [],
      name: '',
      options: { classrooms: [], },
      assignSuccess: false,
      model: { dueDates: {}, },
    };
  },

  componentDidMount() {
    this.getProhibitedUnitNames();
  },

  analytics() {
    return new AnalyticsWrapper();
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
    return this.state.stage;
  },

  getSelectedActivities() {
    return this.state.selectedActivities;
  },

  getClassrooms() {
    if (this.state.options) {
      return this.state.options.classrooms;
    }
    return undefined;
  },

  getUnitName() {
    return this.state.name;
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

  getId() {
    return this.state.model.id;
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
    this.setState({ name: unitName, });
  },

  clickContinue() {
    this.analytics().track('click Continue in lesson planner');
    this.toggleStage(2);
    this.resetWindowPosition();
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

  toggleStage(stage) {
    this.setState({ stage, });
    if (!this.state.options.classrooms.length) {
      this.fetchClassrooms();
    }
  },

  fetchClassrooms() {
		 const that = this;
    $.ajax({
      url: '/teachers/classrooms/retrieve_classrooms_i_teach_for_custom_assigning_activities',
      context: this,
      success(data) {
        that.setState({
          options: {
            classrooms: data.classrooms_and_their_students,
          },
        });
      },
    });
  },

  resetWindowPosition() {
    window.scrollTo(500, 0);
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
      let selectedStudentIds,
        assign_on_join;
      const selectedStudents = _.where(c.students, { isSelected: true, });
      if (selectedStudents.length == c.students.length) {
        selectedStudentIds = [];
        assign_on_join = true;
      } else {
        selectedStudentIds = _.map(selectedStudents, s => s.id);
      }
      return { id: c.classroom.id, student_ids: selectedStudentIds, assign_on_join, };
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
    this.toggleStage(3);
  },

  onCreateSuccess(response) {
    this.setState({ newUnitId: response.id, });
    this.toggleStage(3);
  },

  determineIfInputProvidedAndValid() {
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
    if (this.state.model.dueDates && this.state.model.dueDates[id]) {
      return this.state.model.dueDates[id];
    }
  },

  stage1SpecificComponents() {
    return (<UnitStage1
      selectedActivities={this.getSelectedActivities()}
      determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
      errorMessage={this.determineStage1ErrorMessage()}
      updateUnitName={this.updateUnitName}
      toggleActivitySelection={this.toggleActivitySelection}
      clickContinue={this.clickContinue}
    />);
  },

  assignActivityDueDate(activity, dueDate) {
    const model = Object.assign({}, this.state.model);
    model.dueDates[activity.id] = dueDate;
    this.setState({ model, });
  },

  toggleActivitySelection(activity) {
    activity.selected = !activity.selected
    const indexOfActivity = this.state.selectedActivities.findIndex(act => act.id === activity.id);
    const newActivityArray = this.state.selectedActivities.slice();
    if (indexOfActivity === -1) {
      newActivityArray.push(activity);
    } else {
      newActivityArray.splice(indexOfActivity, 1);
    }
    this.setState({ selectedActivities: newActivityArray, });
  },

  stage2SpecificComponents() {
    return (<Stage2
      selectedActivities={this.getSelectedActivities()}
      data={this.assignSuccess}
      dueDates={this.state.model.dueDates}
      classrooms={this.getClassrooms()}
      updateUnitName={this.updateUnitName}
      toggleActivitySelection={this.toggleActivitySelection}
      toggleClassroomSelection={this.toggleClassroomSelection}
      toggleStudentSelection={this.toggleStudentSelection}
      finish={this.finish}
      unitName={this.getUnitName()}
      assignActivityDueDate={this.assignActivityDueDate}
      areAnyStudentsSelected={this.areAnyStudentsSelected()}
      errorMessage={this.determineStage2ErrorMessage()}
    />);
  },

  stage3specificComponents() {
    if ((this.state.assignSuccess)) {
      return (<UnitTemplatesAssigned data={this.state.assignSuccess} />);
    }

    if(_.map(this.state.selectedActivities, activity => { return activity.activity_classification.id }).includes(6)) {
      // There is a lesson here, so we should send the teacher to the Lessons page.
      window.location.href = `/teachers/classrooms/activity_planner/lessons#${this.state.newUnitId}`;
    } else {
      window.location.href = `/teachers/classrooms/activity_planner#${this.state.newUnitId}`;
    }
  },

  isUnitNameValid() {
    return ((this.getUnitName() != null) && (this.getUnitName() !== ''));
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
        <div className="container" id="activity-planner">
          {stageSpecificComponents}
        </div>
      </span>

    );
  },
});
