import React from 'react';
import UnitStage1 from './stage1/unit_stage1';
import Stage2 from './stage2/Stage2';
import UnitTemplatesAssigned from '../unit_template_assigned';
import _ from 'underscore';
import request from 'request';
import AnalyticsWrapper from '../../shared/analytics_wrapper';
import getAuthToken from '../../modules/get_auth_token'

export default class CreateUnit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prohibitedUnitNames: [],
      newUnitId: null,
      stage: 1,
      selectedActivities: [],
      name: '',
      classrooms: [],
      assignSuccess: false,
      model: { dueDates: {}, },
    }

    this.fetchClassrooms = this.fetchClassrooms.bind(this)
    this.getProhibitedUnitNames = this.getProhibitedUnitNames.bind(this)
    this.isUnitNameUnique = this.isUnitNameUnique.bind(this)
    this.getStage = this.getStage.bind(this)
    this.getSelectedActivities = this.getSelectedActivities.bind(this)
    this.getClassrooms = this.getClassrooms.bind(this)
    this.getUnitName = this.getUnitName.bind(this)
    this.toggleClassroomSelection = this.toggleClassroomSelection.bind(this)
    this.getId = this.getId.bind(this)
    this.toggleStudentSelection = this.toggleStudentSelection.bind(this)
    this.updateUnitName = this.updateUnitName.bind(this)
    this.clickContinue = this.clickContinue.bind(this)
    this.finish = this.finish.bind(this)
    this.toggleStage = this.toggleStage.bind(this)
    this.resetWindowPosition = this.resetWindowPosition.bind(this)
    this.formatCreateRequestData = this.formatCreateRequestData.bind(this)
    this.onCreateSuccess = this.onCreateSuccess.bind(this)
    this.determineIfInputProvidedAndValid = this.determineIfInputProvidedAndValid.bind(this)
    this.emptyClassroomSelected = this.emptyClassroomSelected.bind(this)
    this.toggleEmptyClassroomSelected = this.toggleEmptyClassroomSelected.bind(this)
    this.areAnyStudentsSelected = this.areAnyStudentsSelected.bind(this)
    this.determineStage1ErrorMessage = this.determineStage1ErrorMessage.bind(this)
    this.determineStage2ErrorMessage = this.determineStage2ErrorMessage.bind(this)
    this.dueDate = this.dueDate.bind(this)
    this.stage1SpecificComponents = this.stage1SpecificComponents.bind(this)
    this.assignActivityDueDate = this.assignActivityDueDate.bind(this)
    this.toggleActivitySelection = this.toggleActivitySelection.bind(this)
    this.stage2SpecificComponents = this.stage2SpecificComponents.bind(this)
    this.stage3specificComponents = this.stage3specificComponents.bind(this)
    this.isUnitNameValid = this.isUnitNameValid.bind(this)
  }

  componentDidMount() {
    this.getProhibitedUnitNames();
    this.fetchClassrooms()
  }

  fetchClassrooms() {
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/classrooms/retrieve_classrooms_i_teach_for_custom_assigning_activities`,
    }, (e, r, body) => {
      const parsedBody = JSON.parse(body)
      if (r.statusCode === 200) {
        this.setState({ classrooms: parsedBody.classrooms_and_their_students })
      }
    })
  }

  analytics() {
    return new AnalyticsWrapper();
  }

  getProhibitedUnitNames() {
	  const that = this;
    $.get('/teachers/prohibited_unit_names').done((data) => {
      that.setState({ prohibitedUnitNames: data.prohibitedUnitNames, });
    });
  }

  isUnitNameUnique() {
    const unit = this.getUnitName();
    return !this.state.prohibitedUnitNames.includes(unit.toLowerCase());
  }

  getStage() {
    return this.state.stage;
  }

  getSelectedActivities() {
    return this.state.selectedActivities;
  }

  getClassrooms() {
    return this.state.classrooms
  }

  getUnitName() {
    return this.state.name;
  }

  toggleClassroomSelection(classroom = null, select = null) {
    const classrooms = this.getClassrooms();
    const selectHasValue = select === true || select === false
    if (!classrooms) {
      return;
    }
    const updated = classrooms.map((c) => {
      const classroomGettingUpdated = c
      if (!classroom || classroomGettingUpdated.classroom.id === classroom.id) {
        const { students, } = classroomGettingUpdated
        if (!students.length) {
          classroomGettingUpdated.emptyClassroomSelected = selectHasValue ? select : this.toggleEmptyClassroomSelected(c);
        } else {
          const selected = students.filter(s => s.isSelected)
          const updatedStudents = students.map((s) => {
            const student = s
            student.isSelected = selectHasValue ? select : !selected.length
            return student;
          })
          classroomGettingUpdated.students = updatedStudents;
        }
      }
      return c;
    })
    this.setState({ classrooms: updated, });
  }

  getId() {
    return this.state.model.id;
  }

  toggleStudentSelection(studentIds, classroomId) {
    const allClassrooms = this.getClassrooms()
    const updated = allClassrooms.map((c) => {
      const changedClassroom = c
      if (changedClassroom.classroom.id === classroomId) {
        const updateStudents = changedClassroom.students.map((s) => {
          const student = s
          student.isSelected = studentIds.includes(student.id)
          return student;
        });
        changedClassroom.students = updateStudents;
      }
      return changedClassroom;
    })
    this.setState({ classrooms: updated, });
  }

  updateUnitName(e) {
    this.isUnitNameValid();
    this.setState({ name: e.target.value, });
  }

  clickContinue() {
    this.analytics().track('click Continue in lesson planner');
    this.toggleStage(2);
    this.resetWindowPosition();
  }

  finish() {
    const data = this.formatCreateRequestData()
    data.authenticity_token = getAuthToken()
    request.post({
      url: `${process.env.DEFAULT_URL}/teachers/units`,
      json: data
    },
    (e, r, body) => {
      if (r.statusCode === 200) {
        this.onCreateSuccess(body)
      }
    });
  }

  toggleStage(stage) {
    this.setState({ stage, });
  }

  resetWindowPosition() {
    window.scrollTo(500, 0);
  }

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
      }
    };
    return x;
  }

  onCreateSuccess(response) {
    this.setState({ newUnitId: response.id, });
    this.toggleStage(3);
  }

  determineIfInputProvidedAndValid() {
    return (this.getSelectedActivities().length > 0);
  }

  emptyClassroomSelected(c) {
    const val = (c.emptyClassroomSelected === true);
    return val;
  }

  toggleEmptyClassroomSelected(c) {
    return !(this.emptyClassroomSelected(c));
  }

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
  }

  determineStage1ErrorMessage() {
    if (!this.getSelectedActivities().length > 0) {
      return 'Please select activities';
    }
  }

  determineStage2ErrorMessage() {
    if (!this.areAnyStudentsSelected()) {
      return 'Please select students';
    } else if (!this.isUnitNameValid()) {
      return 'Please provide a name for your activity pack.';
    } else if (!this.isUnitNameUnique()) {
      return 'Please select a unique name for your activity pack.';
    }
  }

  dueDate(id) {
    if (this.state.model.dueDates && this.state.model.dueDates[id]) {
      return this.state.model.dueDates[id];
    }
  }

  stage1SpecificComponents() {
    return (<UnitStage1
      selectedActivities={this.getSelectedActivities()}
      determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
      errorMessage={this.determineStage1ErrorMessage()}
      updateUnitName={this.updateUnitName}
      toggleActivitySelection={this.toggleActivitySelection}
      clickContinue={this.clickContinue}
    />);
  }

  assignActivityDueDate(activity, dueDate) {
    const model = Object.assign({}, this.state.model);
    model.dueDates[activity.id] = dueDate;
    this.setState({ model, });
  }

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
  }

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
      user={this.props.user}
      fetchClassrooms={this.fetchClassrooms}
    />);
  }

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
  }

  isUnitNameValid() {
    return ((this.getUnitName() != null) && (this.getUnitName() !== ''));
  }

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
  }
}
