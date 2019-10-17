import React from 'react';

import Stage1 from './select_activities_container';
import Stage2 from './stage2/Stage2';
import { requestGet, requestPost, } from '../../../../../modules/request';
import UnitAssignmentFollowup from './unit_assignment_followup.tsx';
import AnalyticsWrapper from '../../shared/analytics_wrapper';

export default class CreateUnit extends React.Component {
  constructor(props) {
    super(props)

    let stage = 1
    let name = ''
    if (props.location.query.unit_template_id) {
      stage = 2
      name = props.params.unitName
    }

    this.state = {
      prohibitedUnitNames: [],
      newUnitId: null,
      stage,
      selectedActivities: [],
      name,
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

    if (this.state.stage === 2) {
      this.getActivities()
    }
  }

  fetchClassrooms() {
    requestGet('/teachers/classrooms/retrieve_classrooms_i_teach_for_custom_assigning_activities', (body) => {
      this.setState({ classrooms: body.classrooms_and_their_students })
    })
  }

  getActivities() {
    requestGet('/activities/search', (body) => {
      const { activities, } = body
      const { activityIdsArray, } = this.props.params
      const activityIdsArrayAsArray = activityIdsArray.split(',')
      const selectedActivities = activities.filter(act => activityIdsArrayAsArray.includes(String(act.id)))
      this.setState({ activities: activities, selectedActivities: selectedActivities, })
    })
  }

  analytics() {
    return new AnalyticsWrapper();
  }

  getProhibitedUnitNames() {
    requestGet('/teachers/prohibited_unit_names', (data) => {
      this.setState({ prohibitedUnitNames: data.prohibitedUnitNames, });
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
          classroomGettingUpdated.classroom.emptyClassroomSelected = selectHasValue ? select : this.toggleEmptyClassroomSelected(c);
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
    requestPost('/teachers/units', data, (body) => {
      this.onCreateSuccess(body)
    })
  }

  toggleStage(stage) {
    this.setState({ stage, });
  }

  resetWindowPosition() {
    window.scrollTo(500, 0);
  }

  formatCreateRequestData() {
    let classroomPostData = this.getClassrooms().filter((c) => {
      let includeClassroom
      let selectedStudents;
      if (this.emptyClassroomSelected(c)) {
        includeClassroom = true;
      } else {
        selectedStudents = c.students.filter(s => s.isSelected)
        includeClassroom = selectedStudents.length > 0;
      }
      return includeClassroom;
    });

    classroomPostData = classroomPostData.map((c) => {
      let selectedStudentIds
      let assignOnJoin
      const selectedStudents = c.students.filter(s => s.isSelected)
      if (selectedStudents.length === c.students.length) {
        selectedStudentIds = [];
        assignOnJoin = true;
      } else {
        selectedStudentIds = selectedStudents.map(s => s.id)
      }
      return { id: c.classroom.id, student_ids: selectedStudentIds, assign_on_join: assignOnJoin, };
    })

    const selectedActivities = this.getSelectedActivities();

    const activityPostData = selectedActivities.map((sa) => {
      return {
        id: sa.id,
        due_date: this.dueDate(sa.id),
      }
    })

    const unitObject = {
      unit: {
        id: this.getId(),
        name: this.getUnitName(),
        classrooms: classroomPostData,
        activities: activityPostData,
        unit_template_id: this.props.location.query.unit_template_id
      }
    };
    return unitObject;
  }

  onCreateSuccess(response) {
    this.setState({ newUnitId: response.id, assignSuccess: true, });
    this.toggleStage(3);
  }

  determineIfInputProvidedAndValid() {
    return (this.getSelectedActivities().length > 0);
  }

  emptyClassroomSelected(c) {
    return c.classroom.emptyClassroomSelected === true
  }

  toggleEmptyClassroomSelected(c) {
    return !(this.emptyClassroomSelected(c));
  }

  areAnyStudentsSelected() {
    const classroomsWithSelectedStudents = this.getClassrooms().filter(c => {
      let includeClassroom;
      if (this.emptyClassroomSelected(c)) {
        includeClassroom = true;
      } else {
        const selectedStudents = c.students.filter(s => s.isSelected)
        includeClassroom = selectedStudents.length > 0;
      }
      return includeClassroom;
    })

    return (classroomsWithSelectedStudents.length > 0);
  }

  determineStage1ErrorMessage() {
    if (!this.getSelectedActivities().length > 0) {
      return 'Please select activities';
    }
  }

  determineStage2ErrorMessage() {
    if (!this.areAnyStudentsSelected()) {
      return { students: 'Please select students', }
    } else if (!this.isUnitNameValid()) {
      return { name: 'Please provide a name for your activity pack.', }
    } else if (!this.isUnitNameUnique()) {
      return { name: "You're using that name for a different pack. Please try again.", }
    }
  }

  dueDate(id) {
    if (this.state.model.dueDates && this.state.model.dueDates[id]) {
      return this.state.model.dueDates[id];
    }
  }

  stage1SpecificComponents() {
    return (<Stage1
      activities={this.state.activities}
      clickContinue={this.clickContinue}
      determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
      errorMessage={this.determineStage1ErrorMessage()}
      selectedActivities={this.getSelectedActivities()}
      toggleActivitySelection={this.toggleActivitySelection}
      updateUnitName={this.updateUnitName}
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
      areAnyStudentsSelected={this.areAnyStudentsSelected()}
      assignActivityDueDate={this.assignActivityDueDate}
      classrooms={this.getClassrooms()}
      data={this.assignSuccess}
      dueDates={this.state.model.dueDates}
      errorMessage={this.determineStage2ErrorMessage()}
      fetchClassrooms={this.fetchClassrooms}
      finish={this.finish}
      selectedActivities={this.getSelectedActivities()}
      toggleActivitySelection={this.toggleActivitySelection}
      toggleClassroomSelection={this.toggleClassroomSelection}
      toggleStudentSelection={this.toggleStudentSelection}
      unitName={this.getUnitName()}
      unitTemplateName={this.props.params.unitName}
      updateUnitName={this.updateUnitName}
      user={this.props.user}
    />);
  }

  stage3specificComponents() {
    const { referralCode, } = this.props
    const { classrooms, selectedActivities, name, } = this.state
    if ((this.state.assignSuccess)) {
      return (<UnitAssignmentFollowup
        classrooms={classrooms}
        referralCode={referralCode}
        selectedActivities={selectedActivities}
        unitName={name}
      />);
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
