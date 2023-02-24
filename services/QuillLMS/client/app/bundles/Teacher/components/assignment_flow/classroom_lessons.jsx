import React from 'react';

import Units from './manage_units/units';

import LoadingIndicator from '../shared/loading_indicator';
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown';
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../progress_reports/progress_report_constants'
import { requestGet, } from '../../../../modules/request'

export default class ClassroomLessons extends React.Component {
  constructor(props) {
    super(props);

    const { classroomId, } = props.match.params

    this.state = {
      allLessons: [],
      lessons: [],
      classrooms: this.getClassrooms(classroomId),
      loaded: false,
      selectedClassroomId: classroomId,
      lessonUidsWithEditions: []
    };
  }

  getAllLessons = () => {
    requestGet(`${import.meta.env.VITE_DEFAULT_URL}/teachers/lesson_units`, (body) => {
      this.setState({ allLessons: body, }, () => this.getLessonsForCurrentClass());
    });
  }

  getClassrooms = (classroomId) => {
    requestGet(`${import.meta.env.VITE_DEFAULT_URL}/teachers/classrooms_i_teach_with_lessons`, (body) => {
      const classrooms = body.classrooms;
      if (classrooms.length > 0) {
        const localStorageSelectedClassroomId = Number(window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID))
        const classroomFromLocalStorageClassroomId = classrooms.find(c => Number(c.id) === localStorageSelectedClassroomId)
        const classroomIdToUse = classroomFromLocalStorageClassroomId && !classroomId ? localStorageSelectedClassroomId : classroomId
        this.setState({ classrooms, selectedClassroomId: classroomIdToUse || classrooms[0].id, }, () => this.getAllLessons());
      } else {
        this.setState({ empty: true, loaded: true, });
      }
    });
  }

  getLessonsForCurrentClass = () => {
    const { allLessons, selectedClassroomId, } = this.state
    const lessonsInCurrentClassroom = _.reject(allLessons, lesson => lesson.classroom_id !== selectedClassroomId);
    this.setState({ lessons: lessonsInCurrentClassroom}, () => this.getLessonsWithEditions());
  }

  getLessonsWithEditions = () => {
    // TODO: Figure out if we should be pulling this data from RethinkDB instead
    // Use 'git blame' on this file to see the commit where this TODO was added to see what the code originally looked like
    this.setState({lessonUidsWithEditions: [], loaded: true})
  }

  generateNewCaUnit(u) {
    const { lessonUidsWithEditions, } = this.state
    const {
      number_of_assigned_students,
      class_size,
      class_name,
      unit_id,
      unit_created_at,
      unit_name,
      activity_id,
      activity_name,
      activity_uid,
      unit_activity_created_at,
      classroom_unit_id,
      unit_activity_id,
      activity_classification_id,
      classroom_id,
      owned_by_current_user,
      due_date,
      supporting_info,
      completed,
      started_count,
      owner_name,
    } = u
    const studentCount = Number(number_of_assigned_students || class_size)
    const hasEditions = lessonUidsWithEditions.indexOf(activity_uid) !== -1
    const caObj = {
      studentCount: studentCount,
      classrooms: new Set([class_name]),
      classroomActivities: new Map(),
      unitId: unit_id,
      unitCreated: unit_created_at,
      unitName: unit_name,
    };
    caObj.classroomActivities.set(activity_id, {
      name: activity_name,
      activityId: activity_id,
      activityUid: activity_uid,
      created_at: unit_activity_created_at,
      cuId: classroom_unit_id,
      uaId: unit_activity_id,
      activityClassificationId: activity_classification_id,
      classroomId: classroom_id,
      dueDate: due_date,
      supportingInfo: supporting_info,
      completed,
      studentCount,
      started: started_count > 0,
      hasEditions: hasEditions,
      ownedByCurrentUser: owned_by_current_user,
      ownerName: owner_name
    });
    return caObj;
  }

  orderUnits(units) {
    const unitsArr = [];
    Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
    return unitsArr;
  }

  parseUnits(data) {
    const { lessonUidsWithEditions, } = this.state
    const parsedUnits = {};
    data.forEach((u) => {
      const {
        number_of_assigned_students,
        class_size,
        class_name,
        unit_id,
        unit_created_at,
        unit_name,
        activity_id,
        activity_name,
        activity_uid,
        unit_activity_created_at,
        classroom_unit_id,
        unit_activity_id,
        activity_classification_id,
        classroom_id,
        owned_by_current_user,
        due_date,
        supporting_info,
        completed,
        started_count,
        owner_name,
      } = u
      if (!parsedUnits[unit_id]) {
        // if this unit doesn't exist yet, go create it with the info from the first ca
        parsedUnits[unit_id] = this.generateNewCaUnit(u);
      } else {
        const caUnit = parsedUnits[unit_id];
        const hasEditions = lessonUidsWithEditions.indexOf(activity_uid) !== -1
        const studentCount = Number(number_of_assigned_students ? number_of_assigned_students : class_size)
        if (!caUnit.classrooms.has(class_name)) {
          // add the info and student count from the classroom if it hasn't already been done
          caUnit.classrooms.add(class_name);
          caUnit.studentCount += studentCount;
        }
        // add the activity info if it doesn't exist
        caUnit.classroomActivities.set(activity_id,
          caUnit.classroomActivities[activity_id] || {
            name: activity_name,
            activityId: activity_id,
            activityUid: activity_uid,
            created_at: unit_activity_created_at,
            cuId: classroom_unit_id,
            uaId: unit_activity_id,
            activityClassificationId: activity_classification_id,
            classroomId: classroom_id,
            dueDate: due_date,
            supportingInfo: supporting_info,
            completed,
            studentCount,
            started: started_count > 0,
            hasEditions: hasEditions,
            ownedByCurrentUser: owned_by_current_user,
            ownerName: owner_name
          });
      }
    });
    return this.orderUnits(parsedUnits);
  }

  switchClassrooms = (classroom) => {
    const { history, } = this.props
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)
    history.push(`/teachers/classrooms/activity_planner/lessons/${classroom.id}`);
    this.setState({ selectedClassroomId: classroom.id, }, () => this.getLessonsForCurrentClass());
  }

  renderEmptyState() {
    const assignLessonsLink = <a className="bg-quillgreen text-white" href="/assign/activity-library?activityClassificationFilters[]=lessons" target="_blank">Assign Lessons</a>  // eslint-disable-line react/jsx-no-target-blank
    const learnMoreLink = <a className="bg-white text-quillgreen" href="/tools/lessons" target="_blank">Learn More</a> // eslint-disable-line react/jsx-no-target-blank
    return (
      <div className="empty-lessons manage-units gray-background-accommodate-footer">
        <div className="content">
          <h1>You have no lessons assigned!</h1>
          <p>In order to launch a lesson, you need to assign a lesson to one of your classes.</p>
          <p>With Quill Lessons, teachers can use Quill to lead whole-class lessons and to see and display student responses in real-time.</p>
          <div className="buttons">
            {assignLessonsLink}
            {learnMoreLink}
          </div>
        </div>
        <img alt="cartoon of a teacher gesturing at a projector screen showing Quill Lessons content" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/empty_state_illustration_lessons.svg`} />
      </div>
    );
  }

  renderFeedbackNote() {
    return (
      <div className="feedback-note">
      We would love to hear about your experience with Quill Lessons. Please share your feedback by filling out this <a href="https://goo.gl/forms/podicVxtfRR8CVVO2" rel="noopener noreferrer" target="_blank">short feedback form</a>.
      </div>
    )
  }

  renderHeader() {
    /* eslint-disable react/jsx-no-target-blank */
    const paragraphWithLinks = <p>Before you launch a lessons activity with your students, we recommend you check out <a href={`${import.meta.env.VITE_DEFAULT_URL}/tutorials/lessons/1`} target="_blank">this tutorial</a> on how to lead a lesson. We have also put together a <a href="https://support.quill.org/using-quill-tools/quill-lessons/getting-started-how-to-set-up-your-first-quill-lesson" target="_blank">comprehensive guide</a> that will explain how to set up lessons in your classroom.</p>
    /* eslint-enable react/jsx-no-target-blank */

    return (
      <div className="my-lessons-header">
        <h1>Launch Lessons</h1>
        {paragraphWithLinks}
        <p><span>Note:</span> If you want to re-do a lesson with your class, re-assign the lesson then launch it.</p>
      </div>
    );
  }

  render() {
    const { empty, loaded, classrooms, lessons, selectedClassroomId, } = this.state
    if (empty) {
      return this.renderEmptyState();
    } else if (loaded) {
      return (
        <div className="gray-background-accommodate-footer" id="lesson_planner">
          <div className="container my-lessons manage-units">
            {this.renderHeader()}
            <ItemDropdown
              callback={this.switchClassrooms}
              items={classrooms}
              selectedItem={classrooms.find(classy => classy.id === selectedClassroomId)}
            />
            <Units
              data={this.parseUnits(lessons)}
              lesson
            />
            {this.renderFeedbackNote()}
          </div>
        </div>
      );
    }
    return <LoadingIndicator />;
  }
}
