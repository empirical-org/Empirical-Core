import React from 'react';

import Stage1 from './select_activities_container';
import ShareToStudents from './share_activity_pack/shareToStudents';
import Stage2 from './stage2/Stage2';
import UnitAssignmentFollowup from './unit_assignment_followup.tsx';

import { requestGet, requestPost } from '../../../../../modules/request';
import {
    ACTIVITY_IDS_ARRAY, ASSIGNED_CLASSROOMS, CLASSROOMS, UNIT_ID, UNIT_NAME, UNIT_TEMPLATE_ID, UNIT_TEMPLATE_NAME
} from '../assignmentFlowConstants';
import parsedQueryParams from '../parsedQueryParams';

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
      model: {
        dueDates: {},
        publishDates: {}
      },
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
      window.localStorage.removeItem(ASSIGNED_CLASSROOMS)
    }

    if (stage === 2 || window.localStorage.getItem(ACTIVITY_IDS_ARRAY)) {
      this.getActivities()
    }
  }

  onCreateSuccess = (response) => {
    const { history, } = this.props
    const { classrooms, name, } = this.state
    const { id } = response;
    this.setState({ newUnitId: id, assignSuccess: true, }, () => {
      const assignedClassrooms = classrooms.filter(c => c.classroom.emptyClassroomSelected || c.students.find(s => s.isSelected))
      window.localStorage.setItem(UNIT_NAME, name)
      window.localStorage.setItem(UNIT_ID, id)
      window.localStorage.setItem(ASSIGNED_CLASSROOMS, JSON.stringify(assignedClassrooms))
      if (assignedClassrooms.every(c => c.classroom.emptyClassroomSelected)) {
        history.push('/assign/add-students')
      } else {
        history.push('/assign/referral')
      }
      this.setStage(3);
    });
  }

  getActivities = () => {
    const { match, } = this.props
    const { stage, } = this.state
    const privateFlag = [2, 3].includes(stage) ? "?flagset=private" : ''
    requestGet(`/activities/search${privateFlag}`, (body) => {
      const { activities, } = body
      const activityIdsArray = match.params.activityIdsArray || window.localStorage.getItem(ACTIVITY_IDS_ARRAY)
      const activityIdsArrayAsArray = activityIdsArray.split(',')
      const selectedActivities = activityIdsArrayAsArray.map(id => activities.find(act => String(act.id) === id)).filter(Boolean)
      this.setState({ activities: activities, selectedActivities: selectedActivities, })
    })
  }

  getClassrooms = () => {
    const { classrooms, } = this.state
    return classrooms
  }

  getId = () => {
    const { model, } = this.state
    return model.id;
  }

  getProhibitedUnitNames = () => {
    requestGet('/teachers/prohibited_unit_names', (data) => {
      this.setState({ prohibitedUnitNames: data.prohibitedUnitNames, });
    });
  }

  getSelectedActivities = () => {
    const { selectedActivities, } = this.state
    return selectedActivities
  }

  getStage = () => {
    const { stage, } = this.state
    return stage
  }

  getUnitName = () => {
    const { name, } = this.state
    return name
  }

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

  assignActivityDate = (activity, date, dateKey) => {
    const { model, } = this.state
    model[dateKey][activity.id] = date;
    this.setState({ model, });
  }

  clickContinue = () => {
    const { history, } = this.props
    history.push('/assign/select-classes')
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
    const { model, } = this.state
    if (model.dueDates && model.dueDates[id]) {
      return model.dueDates[id];
    }
  }

  publishDate = (id) => {
    const { model, } = this.state
    if (model.publishDates && model.publishDates[id]) {
      return model.publishDates[id];
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
        publish_date: this.publishDate(sa.id)
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
    const { prohibitedUnitNames, } = this.state
    const unit = this.getUnitName();
    return !prohibitedUnitNames.includes(unit.toLowerCase());
  }

  isUnitNameValid = () => this.getUnitName() && this.getUnitName().length

  resetWindowPosition = () => {
    window.scrollTo(500, 0);
  }

  stage1SpecificComponents = () => {
    const { activities, } = this.state
    const { showLessonsBanner, showEvidenceBanner, flagset, } = this.props
    return (
      <Stage1
        activities={activities}
        clickContinue={this.clickContinue}
        determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
        errorMessage={this.determineStage1ErrorMessage()}
        flagset={flagset}
        selectedActivities={this.getSelectedActivities()}
        setSelectedActivities={this.setSelectedActivities}
        showEvidenceBanner={showEvidenceBanner}
        showLessonsBanner={showLessonsBanner}
        toggleActivitySelection={this.toggleActivitySelection}
        updateUnitName={this.updateUnitName}
      />
    );
  }

  restrictedActivityBeingAssigned = () => {
    const { assignedPreTests, } = this.props
    const { selectedActivities, } = this.state

    const restrictedActivityIds = assignedPreTests.map(pretest => pretest.post_test_id)
    return selectedActivities && selectedActivities.find(act => restrictedActivityIds.includes(act.id))
  }

  lockedClassroomIds = () => {
    const { assignedPreTests, } = this.props
    const { classrooms, } = this.state
    let lockedClassroomIds = []

    const restrictedActivity = this.restrictedActivityBeingAssigned()

    if (restrictedActivity) {
      const relevantPretest = assignedPreTests.find(pretest => pretest.post_test_id === restrictedActivity.id)
      lockedClassroomIds = classrooms.filter(c => !relevantPretest.assigned_classroom_ids.includes(c.classroom.id)).map(c => c.classroom.id)
    }

    return lockedClassroomIds
  }

  notYetCompletedPreTestStudentNames = () => {
    const { assignedPreTests, } = this.props
    const { classrooms, } = this.state

    const restrictedActivity = this.restrictedActivityBeingAssigned()
    if (!restrictedActivity) { return [] }

    const relevantPretest = assignedPreTests.find(pretest => pretest.post_test_id === restrictedActivity.id)
    const studentsBeingAssignedWhoDidNotCompletePreTest = []
    classrooms.forEach(c => {
      const studentsBeingAssigned = c.students.filter(s => s.isSelected)
      const relevantPreTestClassroom = relevantPretest.all_classrooms.find(ac => ac.id === c.classroom.id)
      studentsBeingAssigned.forEach(s => {
        if (!relevantPreTestClassroom.completed_pre_test_student_ids.includes(s.id)) {
          studentsBeingAssignedWhoDidNotCompletePreTest.push(s.name)
        }
      })
    })
    return studentsBeingAssignedWhoDidNotCompletePreTest
  }

  alreadyCompletedDiagnosticStudentNames = () => {
    const { assignedPreTests, } = this.props
    const { selectedActivities, } = this.state

    const preTestActivityIds = assignedPreTests.map(pretest => pretest.id)
    const postTestActivityIds = assignedPreTests.map(pretest => pretest.post_test_id)

    const preTestBeingAssigned = selectedActivities && selectedActivities.find(act => preTestActivityIds.includes(act.id))
    const postTestBeingAssigned = selectedActivities && selectedActivities.find(act => postTestActivityIds.includes(act.id))
    let students = []

    if (preTestBeingAssigned) {
      const relevantPretest = assignedPreTests.find(pretest => pretest.id === preTestBeingAssigned.id)
      students = this.potentiallyOverwrittenStudentNames(relevantPretest, 'completed_pre_test_student_ids')
    } else if (postTestBeingAssigned) {
      const relevantPretest = assignedPreTests.find(pretest => pretest.post_test_id === postTestBeingAssigned.id)
      students = this.potentiallyOverwrittenStudentNames(relevantPretest, 'completed_post_test_student_ids')
    }
    return [... new Set(students.flat())]
  }

  potentiallyOverwrittenStudentNames = (relevantPretest, relevantStudentIdKey) => {
    const { classrooms, } = this.state
    return relevantPretest.all_classrooms.map(classroom => {
      const classroomFromState = classrooms.find(classroomFromState => classroomFromState.classroom.id === classroom.id)
      const studentNamesWhoCouldBeOverwritten = []
      classroom[relevantStudentIdKey].forEach(id => {
        const studentFromState = classroomFromState.students.find(student => student.id === id)
        const isOverwriteCandidate = studentFromState && studentFromState.isSelected // student is both still in classroom and selected to be assigned
        if (isOverwriteCandidate) {
          studentNamesWhoCouldBeOverwritten.push(studentFromState.name)
        }
      })
      return studentNamesWhoCouldBeOverwritten
    })
  }

  stage2SpecificComponents = () => {
    const { model, } = this.state
    const { cleverLink, user, showGradeLevelWarning, } = this.props

    const restrictedActivity = this.restrictedActivityBeingAssigned()

    return (
      <Stage2
        alreadyCompletedDiagnosticStudentNames={this.alreadyCompletedDiagnosticStudentNames()}
        areAnyStudentsSelected={this.areAnyStudentsSelected()}
        assignActivityDate={this.assignActivityDate}
        classrooms={this.getClassrooms()}
        cleverLink={cleverLink}
        data={this.assignSuccess}
        dueDates={model.dueDates}
        errorMessage={this.determineStage2ErrorMessage()}
        fetchClassrooms={this.fetchClassrooms}
        finish={this.finish}
        isFromDiagnosticPath={!!parsedQueryParams().diagnostic_unit_template_id}
        lockedClassroomIds={this.lockedClassroomIds()}
        notYetCompletedPreTestStudentNames={this.notYetCompletedPreTestStudentNames()}
        publishDates={model.publishDates}
        restrictedActivity={restrictedActivity}
        selectedActivities={this.getSelectedActivities()}
        showGradeLevelWarning={showGradeLevelWarning}
        toggleActivitySelection={this.toggleActivitySelection}
        toggleClassroomSelection={this.toggleClassroomSelection}
        toggleStudentSelection={this.toggleStudentSelection}
        unitName={this.getUnitName()}
        unitTemplateId={this.unitTemplateId()}
        unitTemplateName={this.unitTemplateName()}
        updateUnitName={this.updateUnitName}
        user={user}
      />
    )
  }

  moveToStage4 = () => {
    this.setStage(4);
  }

  stage3specificComponents = () => {
    const { assignSuccess, name, selectedActivities } = this.state;
    if (assignSuccess) {
      const activityPackData = {
        name: name,
        activityCount: selectedActivities && selectedActivities.length,
        activities: selectedActivities
      }
      return(
        <ShareToStudents
          activityPackData={activityPackData}
          moveToStage4={this.moveToStage4}
        />
      );
    }
  }

  stage4specificComponents = () => {
    const { referralCode, location, history, } = this.props
    const { classrooms, selectedActivities, name, assignSuccess, newUnitId, } = this.state
    if (assignSuccess) {
      return (
        <UnitAssignmentFollowup
          classrooms={classrooms}
          history={history}
          location={location}
          referralCode={referralCode}
          referralCode={referralCode}
          selectedActivities={selectedActivities}
          unitName={name}
        />
      );
    }

    if (_.map(selectedActivities, activity => { return activity.activity_classification.id }).includes(6)) {
      // There is a lesson here, so we should send the teacher to the Lessons page.
      window.location.href = `/teachers/classrooms/activity_planner/lessons#${newUnitId}`;
    } else {
      window.location.href = `/teachers/classrooms/activity_planner#${newUnitId}`;
    }
  }

  toggleActivitySelection = (activity) => {
    const { selectedActivities, } = this.state
    activity.selected = !activity.selected
    const indexOfActivity = selectedActivities.findIndex(act => act.id === activity.id);
    const newActivityArray = selectedActivities.slice();
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
      window.localStorage.setItem(ACTIVITY_IDS_ARRAY, newActivityArrayIds)
    })
  }

  toggleClassroomSelection = (classroom = null, select = null) => {
    const classrooms = this.getClassrooms();
    const selectHasValue = select === true || select === false
    if (!classrooms) {
      return;
    }

    const lockedClassroomIds = this.lockedClassroomIds()
    const updated = classrooms.map((c) => {
      if (lockedClassroomIds.includes(c.classroom.id)) { return c }
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

  unitTemplateName = () => {
    const { match, } = this.props
    match.params.unitName || window.localStorage.getItem(UNIT_TEMPLATE_NAME)
  }

  updateUnitName = (e) => {
    this.isUnitNameValid();
    this.setState({ name: e.target.value, });
  }

  render = () => {
    const { stage } = this.state;
    let stageSpecificComponents;

    if (stage === 1) {
      stageSpecificComponents = this.stage1SpecificComponents();
    } else if (stage === 2) {
      stageSpecificComponents = this.stage2SpecificComponents();
    } else if (stage === 3) {
      stageSpecificComponents = this.stage3specificComponents();
    } else if (stage === 4) {
      stageSpecificComponents = this.stage4specificComponents();
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
