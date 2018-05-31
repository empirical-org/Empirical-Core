import React from 'react';
import request from 'request';
import Units from './manage_units/units';
import LoadingIndicator from '../shared/loading_indicator';
import ItemDropdown from '../general_components/dropdown_selectors/item_dropdown';

export default class ClassroomLessons extends React.Component {
  constructor(props) {
    super();

    this.state = {
      allLessons: [],
      lessons: [],
      classrooms: this.getClassrooms(),
      loaded: false,
      selectedClassroomId: `${props.routeParams.classroomId}`,
      lessonUidsWithEditions: []
    };

    this.switchClassrooms = this.switchClassrooms.bind(this);
    this.getLessonsWithEditions = this.getLessonsWithEditions.bind(this)
  }

  getClassrooms() {
    request.get(`${process.env.DEFAULT_URL}/teachers/classrooms_i_teach_with_lessons`, (error, httpStatus, body) => {
      const classrooms = JSON.parse(body).classrooms;
      if (classrooms.length > 0) {
        this.setState({ classrooms, selectedClassroomId: this.props.routeParams.classroomId || `${classrooms[0].id}`, }, () => this.getAllLessons());
      } else {
        this.setState({ empty: true, loaded: true, });
      }
    });
  }

  getAllLessons() {
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/lesson_units`,
    }, (error, httpStatus, body) => {
      this.setState({ allLessons: JSON.parse(body), }, () => this.getLessonsForCurrentClass());
    });
  }

  getLessonsForCurrentClass() {
    const lessons_in_current_classroom = _.reject(this.state.allLessons, lesson => lesson.classroom_id !== this.state.selectedClassroomId);
    this.setState({ lessons: lessons_in_current_classroom}, () => this.getLessonsWithEditions());
  }

  getLessonsWithEditions() {
    const teacherId = this.state.classrooms[0].teacher_id
    request.get(`${process.env.FIREBASE_DATABASE_URL}/v2/lessons_editions.json`, (error, httpStatus, body) => {
      const editions = JSON.parse(body)
      const lessonUidsWithEditions = []
      Object.keys(editions).forEach(e => {
        const edition = editions[e]
        if (edition.user_id === teacherId && lessonUidsWithEditions.indexOf(edition.lesson_id) === -1) {
          lessonUidsWithEditions.push(edition.lesson_id)
        }
      })
      this.setState({lessonUidsWithEditions: lessonUidsWithEditions, loaded: true})
    })
  }

  renderHeader() {
    return (<div className="my-lessons-header">
      <h1>Launch Lessons</h1>
      <p>Before you launch a lessons activity with your students, we recommend you check out <a target="_blank" href={`${process.env.DEFAULT_URL}/tutorials/lessons/1`}>this tutorial</a> on how to lead a lesson. We have also put together a <a target="_blank" href="https://support.quill.org/using-quill-tools/quill-lessons/getting-started-how-to-set-up-your-first-quill-lesson">comprehensive guide</a> that will explain how to set up lessons in your classroom.</p>
      <p><span>Note:</span> If you want to re-do a lesson with your class, re-assign the lesson then launch it.</p>
    </div>);
  }

  renderFeedbackNote() {
    return <div className="feedback-note">
      We would love to hear about your experience with Quill Lessons. Please share your feedback by filling out this <a target="_blank" href="https://goo.gl/forms/podicVxtfRR8CVVO2">short feedback form</a>.
    </div>
  }

  renderEmptyState() {
    return (<div className="empty-lessons manage-units">
      <div className="content">
        <h1>You have no lessons assigned!</h1>
        <p>In order to launch a lesson, you need to assign a lesson to one of your classes.</p>
        <p>With Quill Lessons, teachers can use Quill to lead whole-class lessons and to see and display student responses in real-time.</p>
        <div className="buttons">
          <a target="_blank" href="/teachers/classrooms/assign_activities/create-unit?tool=lessons" className="bg-quillgreen text-white">Assign Lessons</a>
          <a target="_blank" href="/tool/lessons" className="bg-white text-quillgreen">Learn More</a>
        </div>
      </div>
      <img src={`${process.env.CDN_URL}/images/illustrations/empty_state_illustration_lessons.svg`} />
    </div>);
  }

  switchClassrooms(classroom) {
    this.props.history.push(`/teachers/classrooms/activity_planner/lessons/${classroom.id}`);
    this.setState({ selectedClassroomId: `${classroom.id}`, }, () => this.getLessonsForCurrentClass());
  }

  generateNewCaUnit(u) {
    const studentCount = Number(u.number_of_assigned_students ? u.number_of_assigned_students : u.class_size)
    const hasEditions = this.state.lessonUidsWithEditions.indexOf(u.activity_uid) !== -1
    const caObj = {
      studentCount: studentCount,
      classrooms: new Set([u.class_name]),
      classroomActivities: new Map(),
      unitId: u.unit_id,
      unitCreated: u.unit_created_at,
      unitName: u.unit_name,
    };
    caObj.classroomActivities.set(u.activity_id, {
      name: u.activity_name,
      activityId: u.activity_id,
      activityUid: u.activity_uid,
      created_at: u.classroom_activity_created_at,
      caId: u.classroom_activity_id,
      activityClassificationId: u.activity_classification_id,
			classroomId: u.classroom_id,
      dueDate: u.due_date,
      supportingInfo: u.supporting_info,
      completed: u.completed,
      studentCount: studentCount,
      started: u.started_count > 0,
      hasEditions: hasEditions,
      ownedByCurrentUser: u.owned_by_current_user === 't',
      ownerName: u.owner_name
    });
    return caObj;
  }

  parseUnits(data) {
    const parsedUnits = {};
    data.forEach((u) => {
      if (!parsedUnits[u.unit_id]) {
        // if this unit doesn't exist yet, go create it with the info from the first ca
        parsedUnits[u.unit_id] = this.generateNewCaUnit(u);
      } else {
        const caUnit = parsedUnits[u.unit_id];
        const hasEditions = this.state.lessonUidsWithEditions.indexOf(u.activity_uid) !== -1
        const studentCount = Number(u.number_of_assigned_students ? u.number_of_assigned_students : u.class_size)
        if (!caUnit.classrooms.has(u.class_name)) {
          // add the info and student count from the classroom if it hasn't already been done
          caUnit.classrooms.add(u.class_name);
          caUnit.studentCount += studentCount;
        }
        // add the activity info if it doesn't exist
        caUnit.classroomActivities.set(u.activity_id,
          caUnit.classroomActivities[u.activity_id] || {
          name: u.activity_name,
          caId: u.classroom_activity_id,
          activityUid: u.activity_uid,
          created_at: u.classroom_activity_created_at,
          activityClassificationId: u.activity_classification_id,
					classroomId: u.classroom_id,
          createdAt: u.ca_created_at,
          dueDate: u.due_date,
          supportingInfo: u.supporting_info,
          completed: u.completed,
          studentCount: studentCount,
          started: u.started_count > 0,
          hasEditions: hasEditions,
          ownedByCurrentUser: u.owned_by_current_user === 't'
        });
      }
    });
    return this.orderUnits(parsedUnits);
  }

  orderUnits(units) {
    const unitsArr = [];
    Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
    return unitsArr;
  }

  render() {
    if (this.state.empty) {
      return this.renderEmptyState();
    } else if (this.state.loaded) {

      return (
        <div id="lesson_planner">
          <div className="container my-lessons manage-units">
            {this.renderHeader()}
            <ItemDropdown
              items={this.state.classrooms}
              callback={this.switchClassrooms}
              selectedItem={this.state.classrooms.find(classy => classy.id === this.state.selectedClassroomId)}
            />
            <Units
              data={this.parseUnits(this.state.lessons)}
              lesson
            />
            {this.renderFeedbackNote()}
          </div>
        </div>);
    }
    return <LoadingIndicator />;
  }
}
