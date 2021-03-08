import React from 'react';

import Stage1 from './select_activities_container';
import Stage2 from './stage2/Stage2';
import UnitAssignmentFollowup from './unit_assignment_followup.tsx';
import {
  CLASSROOMS,
  UNIT_NAME,
  UNIT_TEMPLATE_NAME,
  UNIT_TEMPLATE_ID,
  ACTIVITY_IDS_ARRAY,
  UNIT_ID,
} from '../assignmentFlowConstants.ts'
import parsedQueryParams from '../parsedQueryParams'
import { requestGet, requestPost, } from '../../../../../modules/request';

export default class CreateUnit extends React.Component {
  constructor(props) {
    super(props)

    let stage = 1
    let name = ''
    let assignSuccess = false
    let classrooms = []
    const pathArray = props.location.pathname.split('/')
    const path = pathArray[pathArray.length - 1]
    const previouslyStoredName = props.match.params.unitName || window.localStorage.getItem(UNIT_NAME) || window.localStorage.getItem(UNIT_TEMPLATE_NAME)
    const previouslyStoredClassrooms = window.localStorage.getItem(CLASSROOMS) ? JSON.parse(window.localStorage.getItem(CLASSROOMS)) : []
    if (parsedQueryParams().unit_template_id || parsedQueryParams().diagnostic_unit_template_id || path === 'select-classes') {
      stage = 2
      name = previouslyStoredName
      classrooms = previouslyStoredClassrooms
    } else if (['next', 'referral', 'add-students'].includes(path)) {
      stage = 3;
      name = previouslyStoredName
      assignSuccess = true
      classrooms = previouslyStoredClassrooms
    }

    this.state = {
      prohibitedUnitNames: [],
      newUnitId: null,
      stage,
      selectedActivities: [],
      name,
      classrooms,
      assignSuccess,
      model: { dueDates: {}, },
    }
  }

  componentDidMount = () => {
    const { classrooms, stage, } = this.state
    this.getProhibitedUnitNames();

    this.fetchClassrooms()

    if (stage === 1 && this.unitTemplateId()) {
      window.localStorage.removeItem(UNIT_TEMPLATE_ID)
      window.localStorage.removeItem(UNIT_TEMPLATE_NAME)
      window.localStorage.removeItem(UNIT_NAME)
      window.localStorage.removeItem(ACTIVITY_IDS_ARRAY)
      window.localStorage.removeItem(CLASSROOMS)
    }

    if (stage === 2 || window.localStorage.getItem(ACTIVITY_IDS_ARRAY)) {
      this.getActivities()
    }
  }

  onCreateSuccess = (response) => {
    const { classrooms, name, } = this.state
    this.setState({ newUnitId: response.id, assignSuccess: true, }, () => {
      window.localStorage.setItem(UNIT_NAME, name)
      window.localStorage.setItem(UNIT_ID, response.id)
      const assignedClassrooms = classrooms.filter(c => c.classroom.emptyClassroomSelected || c.students.find(s => s.isSelected))
      if (assignedClassrooms.every(c => c.classroom.emptyClassroomSelected)) {
        this.props.history.push('/assign/add-students')
      } else {
        this.props.history.push('/assign/referral')
      }
      this.setStage(3);
    });
  }

  getActivities = () => {
    const { stage, } = this.state
    const privateFlag = stage === 2 ? "?flag=private" : ''
    requestGet(`/activities/search${privateFlag}`, (body) => {
      const { activities, } = body
      const activityIdsArray = this.props.match.params.activityIdsArray || window.localStorage.getItem(ACTIVITY_IDS_ARRAY)
      const activityIdsArrayAsArray = activityIdsArray.split(',')
      const selectedActivities = activityIdsArrayAsArray.map(id => activities.find(act => String(act.id) === id)).filter(Boolean)
      this.setState({ activities: activities, selectedActivities: selectedActivities, })
    })
  }

  getClassrooms = () => this.state.classrooms

  getId = () => {
    return this.state.model.id;
  }

  getProhibitedUnitNames = () => {
    requestGet('/teachers/prohibited_unit_names', (data) => {
      this.setState({ prohibitedUnitNames: data.prohibitedUnitNames, });
    });
  }

  getSelectedActivities = () => this.state.selectedActivities

  getStage = () => this.state.stage;

  getUnitName = () => this.state.name

  setStage = (stage) => {
    this.setState({ stage, });
  }

  areAnyStudentsSelected = () => {
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

  assignActivityDueDate = (activity, dueDate) => {
    const model = Object.assign({}, this.state.model);
    model.dueDates[activity.id] = dueDate;
    this.setState({ model, });
  }

  clickContinue = () => {
    this.props.history.push('/assign/select-classes')
    this.setStage(2);
    this.resetWindowPosition();
  }

  determineIfInputProvidedAndValid = () => {
    return (this.getSelectedActivities().length > 0);
  }

  determineStage1ErrorMessage = () => {
    if (!this.getSelectedActivities().length > 0) {
      return 'Please select activities';
    }
  }

  determineStage2ErrorMessage = () => {
    if (!this.areAnyStudentsSelected()) {
      return { students: 'Please select students', }
    } else if (!this.isUnitNameValid()) {
      return { name: 'Please provide a name for your activity pack.', }
    } else if (!this.isUnitNameUnique()) {
      return { name: "Each activity pack needs a unique name. You're already using that name for another activity pack. Please choose a different name.", }
    }
  }

  dueDate = (id) => {
    if (this.state.model.dueDates && this.state.model.dueDates[id]) {
      return this.state.model.dueDates[id];
    }
  }

  emptyClassroomSelected = (c) => {
    return c.classroom.emptyClassroomSelected === true
  }

  fetchClassrooms = () => {
    requestGet('/teachers/classrooms/retrieve_classrooms_i_teach_for_custom_assigning_activities', (body) => {
      window.localStorage.setItem(CLASSROOMS, JSON.stringify(body.classrooms_and_their_students))
      this.setState({ classrooms: body.classrooms_and_their_students })
    })
  }

  finish = () => {
    const data = this.formatCreateRequestData()
    requestPost('/teachers/units', data, (body) => {
      this.onCreateSuccess(body)
    })
  }

  formatCreateRequestData = () => {
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
        unit_template_id: this.unitTemplateId()
      }
    };
    return unitObject;
  }

  isUnitNameUnique = () => {
    const unit = this.getUnitName();
    return !this.state.prohibitedUnitNames.includes(unit.toLowerCase());
  }

  isUnitNameValid = () => this.getUnitName() && this.getUnitName().length

  resetWindowPosition = () => {
    window.scrollTo(500, 0);
  }

  stage1SpecificComponents = () => {
    const { showLessonsBanner, } = this.props
    return (<Stage1
      activities={this.state.activities}
      clickContinue={this.clickContinue}
      determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
      errorMessage={this.determineStage1ErrorMessage()}
      selectedActivities={this.getSelectedActivities()}
      setSelectedActivities={this.setSelectedActivities}
      showLessonsBanner={showLessonsBanner}
      toggleActivitySelection={this.toggleActivitySelection}
      updateUnitName={this.updateUnitName}
    />);
  }

  stage2SpecificComponents = () => {
    const { user, } = this.props
    return (<Stage2
      areAnyStudentsSelected={this.areAnyStudentsSelected()}
      areAnyStudentsSelected={this.areAnyStudentsSelected()}
      assignActivityDueDate={this.assignActivityDueDate}
      assignActivityDueDate={this.assignActivityDueDate}
      classrooms={this.getClassrooms()}
      data={this.assignSuccess}
      dueDates={this.state.model.dueDates}
      errorMessage={this.determineStage2ErrorMessage()}
      errorMessage={this.determineStage2ErrorMessage()}
      fetchClassrooms={this.fetchClassrooms}
      fetchClassrooms={this.fetchClassrooms}
      finish={this.finish}
      isFromDiagnosticPath={!!parsedQueryParams().diagnostic_unit_template_id}
      selectedActivities={this.getSelectedActivities()}
      toggleActivitySelection={this.toggleActivitySelection}
      toggleClassroomSelection={this.toggleClassroomSelection}
      toggleStudentSelection={this.toggleStudentSelection}
      unitName={this.getUnitName()}
      unitTemplateId={this.unitTemplateId()}
      unitTemplateName={this.unitTemplateName()}
      updateUnitName={this.updateUnitName}
      user={user}
    />);
  }

  stage3specificComponents = () => {
    const { referralCode, location, history, } = this.props
    const { classrooms, selectedActivities, name, } = this.state
    if ((this.state.assignSuccess)) {
      return (<UnitAssignmentFollowup
        classrooms={classrooms}
        history={history}
        location={location}
        referralCode={referralCode}
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

  toggleActivitySelection = (activity) => {
    activity.selected = !activity.selected
    const indexOfActivity = this.state.selectedActivities.findIndex(act => act.id === activity.id);
    const newActivityArray = this.state.selectedActivities.slice();
    if (indexOfActivity === -1) {
      newActivityArray.push(activity);
    } else {
      newActivityArray.splice(indexOfActivity, 1);
    }
    this.setSelectedActivities(newActivityArray)
  }

  setSelectedActivities = (newActivityArray) => {
    const newActivityArrayIds = newActivityArray.map(a => a.id).join(',')
    this.setState({ selectedActivities: newActivityArray, }, () => {
      window.localStorage.setItem(ACTIVITY_IDS_ARRAY,  newActivityArrayIds)
    })
  }

  toggleClassroomSelection = (classroom = null, select = null) => {
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
    this.setState({ classrooms: updated, }, () => window.localStorage.setItem(CLASSROOMS, JSON.stringify(updated)));
  }

  toggleEmptyClassroomSelected = (c) => {
    return !(this.emptyClassroomSelected(c));
  }

  toggleStudentSelection = (studentIds, classroomId) => {
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
    this.setState({ classrooms: updated, }, () => window.localStorage.setItem(CLASSROOMS, JSON.stringify(updated)));
  }

  unitTemplateId = () => parsedQueryParams().unit_template_id || parsedQueryParams().diagnostic_unit_template_id || window.localStorage.getItem(UNIT_TEMPLATE_ID)

  unitTemplateName = () => this.props.match.params.unitName || window.localStorage.getItem(UNIT_TEMPLATE_NAME)

  updateUnitName = (e) => {
    this.isUnitNameValid();
    this.setState({ name: e.target.value, });
  }

  render = () => {
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
        <div id="activity-planner">
          {stageSpecificComponents}
        </div>
      </span>

    );
  }
}
