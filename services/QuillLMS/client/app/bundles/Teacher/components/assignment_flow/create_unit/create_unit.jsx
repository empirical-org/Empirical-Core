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
    let assignSuccess = false
    let previouslyStoredName = props.params.unitName || window.localStorage.getItem('unitName') || window.localStorage.getItem('unitTemplateName')
    if (props.location.query.unit_template_id || props.route.path === 'select-classes') {
      stage = 2
      name = previouslyStoredName
    } else if (['next', 'referral', 'add-students'].includes(props.route.path)) {
      name = previouslyStoredName
      assignSuccess = true
    }
    debugger;

    this.state = {
      prohibitedUnitNames: [],
      newUnitId: null,
      stage,
      selectedActivities: [],
      name,
      classrooms: [],
      assignSuccess,
      model: { dueDates: {}, },
    }
  }

  componentDidMount = () => {
    this.getProhibitedUnitNames();
    this.fetchClassrooms()

    if (this.state.stage === 2) {
      this.getActivities()
    }
  }

  unitTemplateName = () => this.props.params.unitName || window.localStorage.getItem('unitTemplateName')

  unitTemplateId = () => this.props.location.query.unit_template_id || window.localStorage.getItem('unitTemplateId')

  fetchClassrooms = () => {
    requestGet('/teachers/classrooms/retrieve_classrooms_i_teach_for_custom_assigning_activities', (body) => {
      this.setState({ classrooms: body.classrooms_and_their_students })
    })
  }

  getActivities = () => {
    requestGet('/activities/search', (body) => {
      const { activities, } = body
      const activityIdsArray = this.props.params.activityIdsArray || window.localStorage.getItem('activityIdsArray')
      const activityIdsArrayAsArray = activityIdsArray.split(',')
      const selectedActivities = activities.filter(act => activityIdsArrayAsArray.includes(String(act.id)))
      this.setState({ activities: activities, selectedActivities: selectedActivities, })
    })
  }

  analytics = () => new AnalyticsWrapper()

  getProhibitedUnitNames = () => {
    requestGet('/teachers/prohibited_unit_names', (data) => {
      this.setState({ prohibitedUnitNames: data.prohibitedUnitNames, });
    });
  }

  isUnitNameUnique = () => {
    const unit = this.getUnitName();
    return !this.state.prohibitedUnitNames.includes(unit.toLowerCase());
  }

  getStage = () => this.state.stage;

  getSelectedActivities = () => this.state.selectedActivities

  getClassrooms = () => this.state.classrooms

  getUnitName = () => this.state.name

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
    this.setState({ classrooms: updated, });
  }

  getId = () => {
    return this.state.model.id;
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
    this.setState({ classrooms: updated, });
  }

  updateUnitName = (e) => {
    this.isUnitNameValid();
    this.setState({ name: e.target.value, });
  }

  clickContinue = () => {
    this.analytics().track('click Continue in lesson planner');
    this.props.router.push('/assign/select-classes')
    this.toggleStage(2);
    this.resetWindowPosition();
  }

  finish = () => {
    const data = this.formatCreateRequestData()
    requestPost('/teachers/units', data, (body) => {
      this.onCreateSuccess(body)
    })
  }

  toggleStage = (stage) => {
    this.setState({ stage, });
  }

  resetWindowPosition = () => {
    window.scrollTo(500, 0);
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

  onCreateSuccess = (response) => {
    this.setState({ newUnitId: response.id, assignSuccess: true, }, () => {
      this.toggleStage(3);
    });
  }

  determineIfInputProvidedAndValid = () => {
    return (this.getSelectedActivities().length > 0);
  }

  emptyClassroomSelected = (c) => {
    return c.classroom.emptyClassroomSelected === true
  }

  toggleEmptyClassroomSelected = (c) => {
    return !(this.emptyClassroomSelected(c));
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
      return { name: "You're using that name for a different pack. Please try again.", }
    }
  }

  dueDate = (id) => {
    if (this.state.model.dueDates && this.state.model.dueDates[id]) {
      return this.state.model.dueDates[id];
    }
  }

  stage1SpecificComponents = () => {
    return (<Stage1
      activities={this.state.activities}
      selectedActivities={this.getSelectedActivities()}
      determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
      errorMessage={this.determineStage1ErrorMessage()}
      updateUnitName={this.updateUnitName}
      toggleActivitySelection={this.toggleActivitySelection}
      clickContinue={this.clickContinue}
    />);
  }

  assignActivityDueDate = (activity, dueDate) => {
    const model = Object.assign({}, this.state.model);
    model.dueDates[activity.id] = dueDate;
    this.setState({ model, });
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
    const newActivityArrayIds = newActivityArray.map(a => a.id).join(',')
    this.setState({ selectedActivities: newActivityArray, }, () => {
      window.localStorage.setItem('activityIdsArray',  newActivityArrayIds)
    })
  }

  stage2SpecificComponents = () => {
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
      unitTemplateName={this.unitTemplateName()}
      unitTemplateId={this.unitTemplateId()}
      assignActivityDueDate={this.assignActivityDueDate}
      areAnyStudentsSelected={this.areAnyStudentsSelected()}
      errorMessage={this.determineStage2ErrorMessage()}
      user={this.props.user}
      fetchClassrooms={this.fetchClassrooms}
    />);
  }

  stage3specificComponents = () => {
    const { referralCode, router, } = this.props
    const { classrooms, selectedActivities, name, } = this.state
    if ((this.state.assignSuccess)) {
      return (<UnitAssignmentFollowup
        classrooms={classrooms}
        selectedActivities={selectedActivities}
        unitName={name}
        referralCode={referralCode}
        router={router}
      />);
    }

    if(_.map(this.state.selectedActivities, activity => { return activity.activity_classification.id }).includes(6)) {
      // There is a lesson here, so we should send the teacher to the Lessons page.
      window.location.href = `/teachers/classrooms/activity_planner/lessons#${this.state.newUnitId}`;
    } else {
      window.location.href = `/teachers/classrooms/activity_planner#${this.state.newUnitId}`;
    }
  }

  isUnitNameValid = () => {
    return ((this.getUnitName() != null) && (this.getUnitName() !== ''));
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
