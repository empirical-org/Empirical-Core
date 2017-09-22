import React from 'react'
import request from 'request'
import Units from './manage_units/units'
import LoadingIndicator from '../shared/loading_indicator'
import ClassroomDropdown from '../general_components/dropdown_selectors/classroom_dropdown'

export default class ClassroomLessons extends React.Component {
  constructor(props) {
    super()

    this.state = {
      allLessons: [],
      lessons: [],
      classrooms: this.getClassrooms(),
      loaded: false,
      selectedClassroomId: props.routeParams.classroomId,
    }

    this.switchClassrooms = this.switchClassrooms.bind(this)

  }

  getClassrooms() {
    request.get(`${process.env.DEFAULT_URL}/teachers/classrooms_i_teach_with_lessons`, (error, httpStatus, body) => {
      const classrooms = JSON.parse(body).classrooms
      if (classrooms.length > 0) {
        this.setState({classrooms: classrooms, selectedClassroomId: this.props.routeParams.classroomId || classrooms[0].id}, () => this.getAllLessons())
      } else {
        this.setState({empty: true, loaded: true})
      }
    })
  }

  getAllLessons() {
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/lesson_units`
    }, (error, httpStatus, body) => {
      const lessons = JSON.parse(body);
      this.setState({allLessons: lessons}, () => this.getLessonsForCurrentClass());
    })
  }

  getLessonsForCurrentClass() {
    const lessons_in_current_classroom = _.reject(this.state.allLessons, lesson => lesson.classroom_id !== this.state.selectedClassroomId);
    this.setState({lessons: lessons_in_current_classroom, loaded: true});
  }

  renderHeader() {
    return <div className="my-lessons-header">
      <h1>My Lessons</h1>
      <p>This is a list of all your assigned lessons for the selected class. You can change the selected class below.</p>
      <p><span>Note:</span> If you want to re-do a lesson with your class, re-assign the lesson then launch it.</p>
    </div>
  }

  renderEmptyState() {
    return <div className="empty-lessons manage-units">
      <div className="content">
        <h1>You have no lessons assigned!</h1>
        <p>In order to launch a lesson with your class, you need to first assign to a class and then launch.</p>
        <p>With Quill Lessons, teachers can use Quill to lead whole-class lessons and see and display student responses in real-time.</p>
        <div className="buttons">
          <a href="/teachers/classrooms/assign_activities/create-unit?tool=lessons" className="bg-quillgreen text-white">Assign Lessons</a>
          <a href="/tool/lessons" className="bg-white text-quillgreen">Learn More</a>
        </div>
      </div>
      <img src={`${process.env.CDN_URL}/images/illustrations/empty_state_illustration_lessons.svg`} />
    </div>
  }

  switchClassrooms(classroom) {
    this.props.history.push(`/teachers/classrooms/activity_planner/lessons/${classroom.id}`)
    this.setState({selectedClassroomId: classroom.id}, () => this.getLessonsForCurrentClass());
  }

  generateNewCaUnit(u) {
    const caObj = {
      studentCount: Number(u.array_length ? u.array_length : u.class_size),
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
      dueDate: u.due_date, });
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
        if (!caUnit.classrooms.has(u.class_name)) {
          // add the info and student count from the classroom if it hasn't already been done
          caUnit.classrooms.add(u.class_name);
          caUnit.studentCount += Number(u.array_length ? u.array_length : u.class_size);
        }
        // add the activity info if it doesn't exist
        caUnit.classroomActivities.set(u.activity_id,
          caUnit.classroomActivities[u.activity_id] || {
          name: u.activity_name,
          caId: u.classroom_activity_id,
          activityUid: u.activity_uid,
          activityClassificationId: u.activity_classification_id,
          createdAt: u.ca_created_at,
          dueDate: u.due_date, });
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
      return this.renderEmptyState()
    } else if (this.state.loaded) {
      return(
        <div id="lesson_planner">
          <div className="container my-lessons manage-units">
            {this.renderHeader()}
            <ClassroomDropdown classrooms={this.state.classrooms}
                               callback={this.switchClassrooms}
                               selectedClassroom={this.state.classrooms.find((classy) => classy.id === Number(this.state.selectedClassroomId))}
            />
            <Units
              data={this.parseUnits(this.state.lessons)}
              lesson={true}
            />
            </div>
          </div>)
    } else {
      return <LoadingIndicator />
    }
  }
}
