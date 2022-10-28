import React from 'react';

import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../progress_report_constants'
import { Spinner } from '../../../../Shared/index';
import Units from '../../assignment_flow/manage_units/activities_units.jsx';
import EmptyProgressReport from '../../shared/EmptyProgressReport.jsx';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown';
import getParameterByName from '../../modules/get_parameter_by_name';
import { requestGet, } from '../../../../../modules/request/index'

export default class ActivityPacks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allUnits: [],
      units: [],
      loaded: false,
      selectedClassroomId: getParameterByName('classroom_id'),
      activityWithRecommendationsIds: [],
    }
  }

  UNSAFE_componentWillMount() {
    document.getElementsByClassName('diagnostic-tab')[0].classList.remove('active');
    document.getElementsByClassName('activity-analysis-tab')[0].classList.add('active');
  }

  componentDidMount() {
    this.getClassrooms();
    this.getRecommendationIds();
    window.onpopstate = () => {
      this.setState({ loaded: false, selectedClassroomId: getParameterByName('classroom_id'), });
      this.getUnitsForCurrentClass();
    };
  }

  getClassrooms = () => {
    const { selectedClassroomId, } = this.state

    requestGet(
      `${process.env.DEFAULT_URL}/teachers/classrooms/classrooms_i_teach`,
      (body) => {
        const classrooms = body.classrooms;
        if (classrooms.length > 0) {
          const newState = { classrooms, }
          const localStorageSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)
          if (!selectedClassroomId && localStorageSelectedClassroomId && classrooms.find(c => Number(c.id) === Number(localStorageSelectedClassroomId))) {
            newState.selectedClassroomId = Number(localStorageSelectedClassroomId)
          }
          this.setState(newState, () => this.getUnits());
        } else {
          this.setState({ empty: true, loaded: true, });
        }
      }
    )
  }

  getRecommendationIds = () => {
    fetch(`${process.env.DEFAULT_URL}/teachers/progress_reports/activity_with_recommendations_ids`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      this.setState({ activityWithRecommendationsIds: response.activityWithRecommendationsIds, });
    }).catch((error) => {
      // to do, use Sentry to capture error
    });
  }

  getUnits = () => {
    requestGet(
      `${process.env.DEFAULT_URL}/teachers/units?report=true`,
      (body) => {
        this.setAllUnits(body);
        this.populateCompletionAndAverageScore(body);
      }
    )
  }

  getUnitsForCurrentClass = () => {
    const { selectedClassroomId, allUnits, classrooms, } = this.state
    if (selectedClassroomId) {
      const selectedClassroom = classrooms.find(c => c.id === Number(selectedClassroomId));
      const unitsInCurrentClassroom = allUnits.filter(unit => unit.classrooms.find(classroom => selectedClassroom.name === classroom.name));
      this.setState({ units: unitsInCurrentClassroom, });
    } else {
      this.setState({ units: allUnits, });
    }
  }

  setAllUnits = (data) => {
    this.setState({ allUnits: this.parseUnits(data), }, this.getUnitsForCurrentClass);
  }

  addMissingInfo = (data) => {
    alert('adding missing information');
  }

  assignedStudentCount(u) {
    return u.number_of_assigned_students ? u.number_of_assigned_students : u.class_size;
  }

  classroomActivityData = (u, assignedStudentCount, completedCount, cumulativeScore) => {
    return {
      name: u.activity_name,
      uaId: u.unit_activity_id,
      cuId: u.classroom_unit_id,
      activityId: u.activity_id,
      created_at: u.unit_activity_created_at,
      activityClassificationId: u.activity_classification_id,
      classroomId: u.classroom_id,
      ownedByCurrentUser: u.owned_by_current_user,
      ownerName: u.owner_name,
      createdAt: u.ca_created_at,
      dueDate: u.due_date,
      numberOfAssignedStudents: assignedStudentCount,
      cumulativeScore: cumulativeScore || 0,
      completedCount: completedCount || 0,
    };
  }

  generateNewCaUnit = (u) => {
    const assignedStudentCount = this.assignedStudentCount(u);
    const classroom = { name: u.class_name, totalStudentCount: u.class_size, assignedStudentCount, cuId: u.classroom_unit_id };
    const caObj = {
      classrooms: [classroom],
      classroomActivities: new Map(),
      unitId: u.unit_id,
      unitCreated: u.unit_created_at,
      unitName: u.unit_name,
    };
    caObj.classroomActivities.set(u.activity_id, {
      name: u.activity_name,
      activityId: u.activity_id,
      created_at: u.unit_activity_created_at,
      uaId: u.unit_activity_id,
      cuId: u.classroom_unit_id,
      activityClassificationId: u.activity_classification_id,
      classroomId: u.classroom_id,
      ownedByCurrentUser: u.owned_by_current_user,
      ownerName: u.owner_name,
      dueDate: u.due_date,
      numberOfAssignedStudents: assignedStudentCount,
      completedCount: u.completed_count || 0,
      cumulativeScore: u.classroom_cumulative_score || 0,
    });
    return caObj;
  }

  orderUnits(units) {
    const unitsArr = [];
    Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
    return unitsArr;
  }

  parseUnits = (data) => {
    const parsedUnits = {};
    data.forEach((u) => {
      const assignedStudentCount = this.assignedStudentCount(u);
      if (!parsedUnits[u.unit_id]) {
        // if this unit doesn't exist yet, go create it with the info from the first ca
        parsedUnits[u.unit_id] = this.generateNewCaUnit(u);
      } else {
        const caUnit = parsedUnits[u.unit_id];
        if (caUnit.classrooms.findIndex(c => c.name === u.class_name) === -1) {
          // add the info and student count from the classroom if it hasn't already been done
          const classroom = { name: u.class_name, totalStudentCount: u.class_size, assignedStudentCount, cuId: u.classroom_unit_id};
          caUnit.classrooms.push(classroom);
        }
        // if the activity info already exists, add to the completed count
        // otherwise, add the activity info if it doesn't already exist
        let completedCount,
          cumulativeScore;
        if (caUnit.classroomActivities.has(u.activity_id)) {
          completedCount = Number(caUnit.classroomActivities.get(u.activity_id).completedCount) + Number(u.completed_count || 0);
          cumulativeScore = Number(caUnit.classroomActivities.get(u.activity_id).cumulativeScore) + Number(u.classroom_cumulative_score || 0);
        } else {
          cumulativeScore = Number(u.classroom_cumulative_score || 0);
          completedCount = Number(u.completed_count || 0);
        }
        //completedCount = Number(4); // number of srudents who completed
        //cumulativeScore = Number(332); // cumulative percentage for those //completed --- 83*4
        caUnit.classroomActivities.set(u.activity_id, this.classroomActivityData(u, assignedStudentCount, completedCount, cumulativeScore));
      }
    });
    return this.orderUnits(parsedUnits);
  }

  populateCompletionAndAverageScore = (data) => {
    const { allUnits, } = this.state
    const requests = data.map((u) => {
      return new Promise(resolve => {
        requestGet(
          `${process.env.DEFAULT_URL}/teachers/units/score_info_for_activity/${u.activity_id}?classroom_unit_id=${u.classroom_unit_id}`,
          (body) => {
            allUnits.forEach((stateUnit) => {
              const unitActivity = stateUnit.classroomActivities.get(u.activity_id)
              if (typeof unitActivity != 'undefined' && stateUnit.classrooms.find(c => Number(c.cuId) === Number(u.classroom_unit_id))) {
                unitActivity.cumulativeScore += body.cumulative_score;
                unitActivity.completedCount += body.completed_count;
              }
            })
            resolve()
          }
        )
      })
    });
    Promise.all(requests).then(() => this.setState({ loaded: true }));
  }

  stateBasedComponent = () => {
    const { loaded, classrooms, selectedClassroomId, units, activityWithRecommendationsIds, } = this.state
    if (!loaded) {
      return <Spinner />;
    }
    let content;

    const allClassroomsClassroom = { name: 'All Classrooms', };
    const classroomOptions = [allClassroomsClassroom].concat(classrooms);
    const classroomWithSelectedId = classroomOptions.find(classroom =>
      classroom && classroom.id === Number(selectedClassroomId)
    );
    const selectedClassroom = classroomWithSelectedId || allClassroomsClassroom;

    if (!classrooms || classrooms.filter(Boolean).length === 0) {
      content = <EmptyProgressReport missing="classrooms" />;
    } else if (units.length === 0 && selectedClassroomId) {
      content = (
        <EmptyProgressReport
          missing="activitiesForSelectedClassroom"
          onButtonClick={() => {
            this.setState({ selectedClassroomId: null, loaded: false, });
            this.getUnitsForCurrentClass();
          }}
        />);
    } else if (units.length === 0) {
      content = <EmptyProgressReport missing="activities" />;
    } else {
      content = (<Units
        activityReport={Boolean(true)}
        activityWithRecommendationsIds={activityWithRecommendationsIds}
        data={units}
        report={Boolean(true)}
      />);
    }

    return (
      <div className="activity-analysis">
        <h1>Activity Analysis</h1>
        <p>Open an activity analysis to view students' responses, the overall results on each question, and the concepts students need to practice.</p>
        <div className="classroom-selector">
          <p>Select a classroom:</p>
          <ItemDropdown
            callback={this.switchClassrooms}
            items={classroomOptions.filter(Boolean)}
            selectedItem={selectedClassroom}
          />
        </div>
        {content}
      </div>
    );
  }

  switchClassrooms = (classroom) => {
    const path = '/teachers/progress_reports/diagnostic_reports/#/activity_packs';
   	window.history.pushState({}, '', classroom.id ? `${path}?classroom_id=${classroom.id}` : path);
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)
 		this.setState({ selectedClassroomId: classroom.id, }, () => this.getUnitsForCurrentClass());
  }

  render() {
    return (
      <div className="container manage-units">
        {this.stateBasedComponent()}
      </div>
    );
  }
}
