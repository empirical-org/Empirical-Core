import React from 'react';
import request from 'request';
import _ from 'underscore';

import ActivityPack from './activity_pack'

import LoadingIndicator from '../../shared/loading_indicator';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown';
import getParameterByName from '../../modules/get_parameter_by_name';
import getAuthToken from '../../modules/get_auth_token';
import { DropdownInput, } from '../../../../Shared/index'
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../../progress_reports/progress_report_constants'

const clipboardSrc = `${process.env.CDN_URL}/images/illustrations/clipboard.svg`

const allClassroomKey = 'All Classes';

export default class ManageUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allUnits: [],
      units: [],
      loaded: false,
      classrooms: [],
      selectedClassroomId: getParameterByName('classroom_id') || allClassroomKey,
      activityWithRecommendationsIds: [],
    };
  }

  componentDidMount() {
    this.getClassrooms()
    this.getRecommendationIds();
    window.onpopstate = () => {
      this.setState({ loaded: false, selectedClassroomId: getParameterByName('classroom_id'), });
      this.getUnitsForCurrentClass();
    };
  }

  getClassrooms = () => {
    const { selectedClassroomId, } = this.state
    request.get(`${process.env.DEFAULT_URL}/teachers/classrooms/classrooms_i_teach`, (error, httpStatus, body) => {
      const classrooms = JSON.parse(body).classrooms;
      const localStorageSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)
      const classroomFromLocalStorageClassroomId = classrooms.find(c => Number(c.id) === Number(localStorageSelectedClassroomId))
      if ((!selectedClassroomId || selectedClassroomId === allClassroomKey) && classroomFromLocalStorageClassroomId) {
        this.setState({selectedClassroomId: Number(localStorageSelectedClassroomId)})
      }
      this.handleClassrooms(classrooms);
    });
  };

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
  };

  handleClassrooms = (classrooms) => {
    if (classrooms.length > 0) {
      this.setState({ classrooms, }, () => this.getUnits());
    } else {
      this.setState({ empty: true, loaded: true, });
    }
  };

  hashLinkScroll = () => {
    const hash = window.location.hash;
    if (hash !== '') {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      element ? element.scrollIntoView() : null;
    }
  };

  getUnits = () => {
    request.get(`${process.env.DEFAULT_URL}/teachers/units`, (error, httpStatus, body) => {
      this.setAllUnits(JSON.parse(body));
    });
  };

  getUnitsForCurrentClass = () => {
    const { selectedClassroomId, classrooms, allUnits, } = this.state
    if (selectedClassroomId && selectedClassroomId !== allClassroomKey) {
      // TODO: Refactor this. It is ridiculous that we need to find a classroom and match on name. Instead, the units should just have a list of classroom_ids that we can match on.
      const selectedClassroom = classrooms.find(c => c.id === Number(selectedClassroomId));
      const unitsInCurrentClassroom = allUnits.filter(unit => unit.classrooms.find(c => c.name === selectedClassroom.name));
      this.setState({ units: unitsInCurrentClassroom, loaded: true, });
    } else {
      this.setState(prevState => ({ units: prevState.allUnits, loaded: true, }));
    }
  };

  generateNewCaUnit = (u) => {
    const classroom = { name: u.class_name, totalStudentCount: u.class_size, assignedStudentCount: u.number_of_assigned_students ? u.number_of_assigned_students : u.class_size, };
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
      cuId: u.classroom_unit_id,
      activityClassificationId: u.activity_classification_id,
      classroomId: u.classroom_id,
      dueDate: u.due_date ? u.due_date.replace(' ', 'T') : null,
      publishDate: u.publish_date ? u.publish_date.replace(' ', 'T') : null,
      scheduled: u.scheduled,
      ownedByCurrentUser: u.owned_by_current_user,
      ownerName: u.owner_name,
      uaId: u.unit_activity_id,
    });
    return caObj;
  };

  parseUnits = (data) => {
    const parsedUnits = {};
    data.forEach((u) => {
      if (!parsedUnits[u.unit_id]) {
        // if this unit doesn't exist yet, go create it with the info from the first ca
        parsedUnits[u.unit_id] = this.generateNewCaUnit(u);
      } else {
        const caUnit = parsedUnits[u.unit_id];
        if (caUnit.classrooms.findIndex(c => c.name === u.class_name) === -1) {
          // add the info and student count from the classroom if it hasn't already been done
          const classroom = { name: u.class_name, totalStudentCount: u.class_size, assignedStudentCount: u.number_of_assigned_students ? u.number_of_assigned_students : u.class_size, };
          caUnit.classrooms.push(classroom);
        }
        // add the activity info if it doesn't exist
        caUnit.classroomActivities.set(u.activity_id,
          caUnit.classroomActivities[u.activity_id] || {
            name: u.activity_name,
            cuId: u.classroom_unit_id,
            activityId: u.activity_id,
            created_at: u.unit_activity_created_at,
            activityClassificationId: u.activity_classification_id,
            classroomId: u.classroom_id,
            createdAt: u.ca_created_at,
            dueDate: u.due_date ? u.due_date.replace(' ', 'T') : null,
            publishDate: u.publish_date ? u.publish_date.replace(' ', 'T') : null,
            scheduled: u.scheduled,
            ownedByCurrentUser: u.owned_by_current_user,
            ownerName: u.owner_name,
            uaId: u.unit_activity_id,
          });
      }
    });
    return this.orderUnits(parsedUnits);
  };

  orderUnits = (units) => {
    const unitsArr = [];
    Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
    return unitsArr;
  };

  setAllUnits = (data) => {
    this.setState({ allUnits: this.parseUnits(data), }, this.getUnitsForCurrentClass);
    this.hashLinkScroll();
  };

  switchClassrooms = (classroom) => {
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)
    if (classroom.id) {
      window.history.pushState({}, '', `/teachers/classrooms/activity_planner?classroom_id=${classroom.id}`);
    } else {
      window.history.pushState({}, '', '/teachers/classrooms/activity_planner');
    }
    this.setState({ selectedClassroomId: classroom.value, }, () => this.getUnitsForCurrentClass());
  };

  stateBasedComponent = () => {
    const { actions, } = this.props
    const { units, selectedClassroomId, classrooms, } = this.state

    if (!units.length) {
      return (
        <div className="my-activities-empty-state container">
          <img alt="Clipboard with notes written on it" src={clipboardSrc} />
          <h2>Start by assigning activities</h2>
          <p>Nothing to see here yet! Once you assign activities, they will show up here.</p>
        </div>
      )
    }

    const activityPacks = units.map(unit => (
      <ActivityPack
        data={unit}
        getUnits={this.getUnits}
        key={unit.unitId}
        selectedClassroomId={selectedClassroomId}
      />
    ))

    return (
      <section className="activity-packs container">
        {activityPacks}
      </section>
    )
  };

  getIdFromUnit = (unit) => {
    return unit.unitId || unit.unit.id;
  };

  render() {
    const { classrooms, selectedClassroomId, loaded, } = this.state

    if (!loaded) { return <LoadingIndicator /> }

    const allClassroomsClassroom = { label: allClassroomKey, value: allClassroomKey, };
    const classroomOptions = classrooms.map(c => {
      c.value = c.id
      c.label = c.name
      return c
    })
    const allOptions = [allClassroomsClassroom, ...classroomOptions]
    const selectedOption = allOptions.find(opt => String(opt.value) === String(selectedClassroomId))

    return (
      <div className="my-activities">
        <section className="my-activities-header">
          <div className="container">
            <div className="top-line">
              <h1>My Activity Packs</h1>
              <a className="quill-button contained primary medium focus-on-light" href="/assign">Assign activities</a>
            </div>
            <DropdownInput
              handleChange={this.switchClassrooms}
              options={allOptions}
              value={selectedOption}
            />
          </div>
        </section>
        {this.stateBasedComponent()}
      </div>
    );
  }
}
