import React from 'react';

import { requestGet, } from '../../../../../modules/request/index';
import { Spinner } from '../../../../Shared/index';
import { ACTIVITY_ANALYSIS_FEATURED_BLOG_ID } from '../../../constants/featuredBlogPost';
import Units from '../../assignment_flow/manage_units/activities_units.jsx';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown';
import getParameterByName from '../../modules/get_parameter_by_name';
import EmptyProgressReport from '../../shared/EmptyProgressReport.jsx';
import ArticleSpotlight from '../../shared/articleSpotlight';
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../progress_report_constants';

function ActivityPacks() {
  const [allUnits, setAllUnits] = React.useState([]);
  const [units, setUnits] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = React.useState(getParameterByName('classroom_id'));
  const [classrooms, setClassrooms] = React.useState([]);

  React.useEffect(() => {
    handleNavigationClasses()
    getClassrooms();
    window.onpopstate = handlePopState;

    return () => {
      window.onpopstate = null;
    };
  }, []);

  React.useEffect(() => {
    if (loaded) {
      getUnitsForCurrentClass()
    }
  }, [selectedClassroomId])

  React.useEffect(() => {
    if (!classrooms.length) { return }

    getUnits();
  }, [classrooms])

  function handlePopState() {
    setLoaded(false);
    setSelectedClassroomId(getParameterByName('classroom_id'));
    getUnitsForCurrentClass();
  };

  function handleNavigationClasses() {
    document.getElementsByClassName('diagnostic-tab')[0]?.classList?.remove('active');
    document.getElementsByClassName('activity-analysis-tab')[0]?.classList?.add('active');
    const mobileActivityAnalysisTab = document.getElementById('mobile-activity-analysis-tab-checkmark')
    const mobileDiagnosticTab = document.getElementById('mobile-diagnostics-tab-checkmark')
    const mobileDropdown = document.getElementById('mobile-subnav-toggle')

    if (mobileDropdown && mobileActivityAnalysisTab && mobileDiagnosticTab) {
      mobileDropdown.classList.remove('open');
      mobileActivityAnalysisTab.classList.add('active');
      mobileDiagnosticTab.classList.remove('active');
    }
    // this is an override since we can only access the current_path from the backend so we just pass back an empty space
    // from the NavigationHelper module
    if (mobileDropdown && mobileDropdown.children[0] && mobileDropdown.children[0].children[0]) {
      const subTabElement = mobileDropdown.children[0].children[0]
      if (subTabElement.textContent === ' ' || subTabElement.textContent === 'Diagnostics') {
        subTabElement.textContent = 'Activity Analysis'
      }
    }
  }

  function getClassrooms() {
    requestGet(`${process.env.DEFAULT_URL}/teachers/classrooms/classrooms_i_teach`, (body) => {
      const newClassrooms = body.classrooms;
      if (newClassrooms.length > 0) {
        const localStorageSelectedClassroomId = window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID);
        if (!selectedClassroomId && localStorageSelectedClassroomId && newClassrooms.find(c => Number(c.id) === Number(localStorageSelectedClassroomId))) {
          setSelectedClassroomId(Number(localStorageSelectedClassroomId));
        }
        setClassrooms(newClassrooms);
      } else {
        setLoaded(true);
      }
    });
  };

  function getUnits() {
    requestGet(
      `${process.env.DEFAULT_URL}/teachers/units?report=true`,
      (body) => {
        const parsedUnits = parseUnits(body);
        setAllUnits(parsedUnits)
        getUnitsForCurrentClass(parsedUnits)
        populateCompletionAndAverageScore(body, parsedUnits)
      }
    )
  };

  function getUnitsForCurrentClass(parsedUnits) {
    const units = parsedUnits || allUnits
    if (selectedClassroomId) {
      const selectedClassroom = classrooms.find(c => c.id === Number(selectedClassroomId));

      if (!selectedClassroom) { return }

      const unitsInCurrentClassroom = units.filter(unit => unit.classrooms.find(classroom => selectedClassroom.name === classroom.name));
      setUnits(unitsInCurrentClassroom);
    } else {
      setUnits(units);
    }
  }

  function parseUnits(data) {
    const parsedUnits = {};
    data.forEach((u) => {
      const assignedStudentCount = u.number_of_assigned_students || u.class_size;
      if (!parsedUnits[u.unit_id]) {
        parsedUnits[u.unit_id] = generateNewCaUnit(u, assignedStudentCount);
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
        caUnit.classroomActivities.set(u.activity_id, classroomActivityData(u, assignedStudentCount, completedCount, cumulativeScore));
      }
    });
    return Object.values(parsedUnits); // Convert to array as per original structure
  };

  function populateCompletionAndAverageScore(data, parsedUnits) {
    const promises = data.map((u) => {
      return requestGetScoreInfo(u).then((body) => {
        updateScoreInfo(u, body, parsedUnits)
      });
    });

    Promise.all(promises).then(() => {
      setLoaded(true);
    });
  };

  function requestGetScoreInfo(u) {
    return new Promise((resolve) => {
      requestGet(
        `${process.env.DEFAULT_URL}/teachers/units/score_info_for_activity/${u.activity_id}?classroom_unit_id=${u.classroom_unit_id}`,
        resolve
      );
    });
  };

  function updateScoreInfo(unitActivityUpdate, scoreInfo, parsedUnits) {
    const updatedUnits = parsedUnits.map(unit => {
      if (unit.unitId === unitActivityUpdate.unit_id) {
        const updatedActivities = new Map(unit.classroomActivities);
        const activity = updatedActivities.get(unitActivityUpdate.activity_id);

        if (activity) {
          activity.cumulativeScore += scoreInfo.cumulative_score;
          activity.completedCount += scoreInfo.completed_count;
        }

        return { ...unit, classroomActivities: updatedActivities };
      }
      return unit;
    });

    setAllUnits(updatedUnits)
  };


  function generateNewCaUnit(u, assignedStudentCount) {
    const classroom = {
      name: u.class_name,
      totalStudentCount: u.class_size,
      assignedStudentCount,
      cuId: u.classroom_unit_id
    };
    return {
      classrooms: [classroom],
      classroomActivities: new Map().set(u.activity_id, classroomActivityData(u, assignedStudentCount)),
      unitId: u.unit_id,
      unitCreated: u.unit_created_at,
      unitName: u.unit_name,
    };
  };

  function classroomActivityData(u, assignedStudentCount, completedCount, cumulativeScore) {
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
      cumulativeScore: cumulativeScore || u.classroom_cumulative_score || 0,
      completedCount: completedCount || u.completed_count || 0,
    };
  };

  function switchClassrooms(classroom) {
    const path = '/teachers/progress_reports/diagnostic_reports/#/activity_packs';
    window.history.pushState({}, '', classroom.id ? `${path}?classroom_id=${classroom.id}` : path);
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)
    setSelectedClassroomId(classroom.id)
  };

  function renderContent() {
    if (!loaded) {
      return <Spinner />;
    }

    if (!classrooms || classrooms.length === 0) {
      return <EmptyProgressReport missing="classrooms" />;
    }

    if (units.length === 0 && selectedClassroomId) {
      return (
        <EmptyProgressReport
          missing="activitiesForSelectedClassroom"
          onButtonClick={resetSelectedClassroom}
        />
      );
    }

    if (units.length === 0) {
      return <EmptyProgressReport missing="activities" />;
    }

    return (
      <Units
        activityReport={true}
        data={units}
        report={true}
      />
    );
  }

  function resetSelectedClassroom() {
    setSelectedClassroomId(null);
    setLoaded(false);
    getUnitsForCurrentClass();
  }

  function stateBasedComponent() {
    const allClassroomsOption = { name: 'All Classrooms' };
    const classroomOptions = [allClassroomsOption, ...classrooms];

    const selectedClassroom = classroomOptions.find(classroom =>
      classroom?.id === Number(selectedClassroomId)
    ) || allClassroomsOption;

    return (
      <div className="activity-analysis">
        <h1>Activity Analysis</h1>
        <p>Open an activity analysis to view students' responses, the overall results on each question, and the concepts students need to practice.</p>
        <div className="classroom-selector">
          <p>Select a classroom:</p>
          <ItemDropdown
            callback={switchClassrooms}
            items={classroomOptions}
            selectedItem={selectedClassroom}
          />
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container manage-units gray-background-accommodate-footer">
        {stateBasedComponent()}
      </div>
      <ArticleSpotlight blogPostId={ACTIVITY_ANALYSIS_FEATURED_BLOG_ID} />
    </React.Fragment>
  );
}

export default ActivityPacks;
