import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';
import Pusher from 'pusher-js';
import * as _ from 'lodash'

import {
  fileDocumentIcon,
  asteriskIcon,
} from './shared'
import RecommendationsTable from './recommendationsTable'
import {
  Recommendation,
  LessonRecommendation,
  Student,
} from './interfaces'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet, requestPost, } from '../../../../../../modules/request/index';
import {
  helpIcon,
  Tooltip,
  Snackbar,
  defaultSnackbarTimeout,
} from '../../../../../Shared/index'
import useSnackbarMonitor from '../../../../../Shared/hooks/useSnackbarMonitor'

const RecommendationsButtons = ({numberSelected, assigning, assigned, assignActivityPacks, deselectAll, selectAll, selectAllRecommended}) => {
  let assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assign activity packs</button>

  if (assigning) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigning...</button>
  } else if (assigned) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigned</button>
  } else if (numberSelected) {
    assignButton = <button className="quill-button primary contained small focus-on-light" onClick={assignActivityPacks} type="button">Assign activity packs</button>
  }

  const numberSelectedElement = numberSelected ? <span className="number-selected">{numberSelected} activity pack{numberSelected === 1 ? '' : 's'} selected</span> : null
  return (<div className="recommendations-buttons">
    <div>
      <button className="quill-button fun secondary outlined focus-on-light" onClick={selectAll} type="button">Select all</button>
      <button className="quill-button fun secondary outlined focus-on-light" onClick={selectAllRecommended} type="button">Select all recommended</button>
      <button className="quill-button fun secondary outlined focus-on-light" onClick={deselectAll} type="button">Deselect all</button>
    </div>
    <div>
      {numberSelectedElement}
      {assignButton}
    </div>
  </div>)
}

const IndependentRecommendationsButtons = ({ assignActivityPacks, independentSelections, setIndependentSelections, recommendations, students, assigned, assigning, }) => {
  function handleSelectAllClick() {
    const newSelections = independentSelections.map((selection, index) => {
      selection.students = students.filter(s => s.completed).map(s => s.id)
      return selection
    })
    setIndependentSelections(newSelections)
  }

  function handleSelectAllRecommendedClick() {
    const newSelections = independentSelections.map((selection, index) => {
      selection.students = recommendations[index].students
      return selection
    })
    setIndependentSelections(newSelections)
  }

  function handleDeselectAllClick() {
    const newSelections = independentSelections.map(selection => {
      selection.students = []
      return selection
    })
    setIndependentSelections(newSelections)
  }

  const numberSelected = independentSelections.filter(selection => selection.students.length).length
  return <RecommendationsButtons assignActivityPacks={assignActivityPacks} assigned={assigned} assigning={assigning} deselectAll={handleDeselectAllClick} numberSelected={numberSelected} selectAll={handleSelectAllClick} selectAllRecommended={handleSelectAllRecommendedClick} />
}

const LessonsRecommendationsButtons = ({ lessonsSelections, assignLessonsActivityPacks, setLessonsSelections, lessonsRecommendations, assigned, assigning, }) => {
  function handleSelectAllClick() {
    const newSelections = lessonsRecommendations.map(r => r.activity_pack_id)
    setLessonsSelections(newSelections)
  }

  function handleSelectAllRecommendedClick() {
    const newSelections = lessonsRecommendations.filter(r => r.percentage_needing_instruction >= 50).map(r => r.activity_pack_id)
    setLessonsSelections(newSelections)
  }

  function handleDeselectAllClick() {
    setLessonsSelections([])
  }

  function assignActivityPacks() {
    lessonsSelections.forEach(selection => assignLessonsActivityPacks(selection))
  }

  return <RecommendationsButtons assignActivityPacks={assignActivityPacks} assigned={assigned} assigning={assigning} deselectAll={handleDeselectAllClick} numberSelected={lessonsSelections.length} selectAll={handleSelectAllClick} selectAllRecommended={handleSelectAllRecommendedClick} />
}

const Recommendations = ({ passedPreviouslyAssignedRecommendations, passedPreviouslyAssignedLessonRecommendations, passedRecommendations, passedLessonRecommendations, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedPreviouslyAssignedRecommendations && !passedRecommendations && !passedLessonRecommendations);
  const [previouslyAssignedIndependentRecommendations, setPreviouslyAssignedIndependentRecommendations] = React.useState<Recommendation[]>(passedPreviouslyAssignedRecommendations);
  const [previouslyAssignedLessonsRecommendations, setPreviouslyAssignedLessonsRecommendations] = React.useState<LessonRecommendation[]>(passedPreviouslyAssignedLessonRecommendations);
  const [independentRecommendations, setIndependentRecommendations] = React.useState<Recommendation[]>(passedRecommendations);
  const [lessonsRecommendations, setLessonsRecommendations] = React.useState<LessonRecommendation[]>(passedLessonRecommendations);
  const [independentSelections, setIndependentSelections] = React.useState<Recommendation[]>([]);
  const [lessonsSelections, setLessonsSelections] = React.useState<number[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [independentAssigning, setIndependentAssigning] = React.useState(false)
  const [independentAssigned, setIndependentAssigned] = React.useState(false)
  const [lessonsAssigning, setLessonsAssigning] = React.useState(false)
  const [lessonsAssigned, setLessonsAssigned] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  const { params, } = match
  const { activityId, classroomId, } = params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getRecommendations()
    getPreviouslyAssignedRecommendationData()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    setIndependentSelections([])
    setLessonsSelections([])
    setIndependentRecommendations(null)
    setLessonsRecommendations(null)
    setPreviouslyAssignedIndependentRecommendations(null)
    setPreviouslyAssignedLessonsRecommendations(null)
    getRecommendations()
    getPreviouslyAssignedRecommendationData()
  }, [activityId, classroomId])

  React.useEffect(() => {
    if (loading) { return }
    let newSelections = independentSelections
    if (independentSelections.length === 0) {
      newSelections = independentRecommendations.map((recommendation, i) => {
        return {
          activity_count: recommendation.activity_count,
          activity_pack_id: recommendation.activity_pack_id,
          name: recommendation.name,
          students: [...recommendation.students],
        };
      });
    }
    const newLessonsRecommendations = lessonsRecommendations.map((recommendation) => {
      if (previouslyAssignedLessonsRecommendations.includes(recommendation.activity_pack_id)) {
        return Object.assign({}, recommendation, { status: 'assigned', previously_assigned: true, });
      } else {
        return recommendation;
      }
    });
    setIndependentSelections(newSelections)
    setLessonsRecommendations(newLessonsRecommendations)
  }, [loading])

  React.useEffect(() => {
    if (independentAssigned) {
      setTimeout(() => setIndependentAssigned(false), 5000)
    }
    if (lessonsAssigned) {
      setTimeout(() => setLessonsAssigned(false), 5000)
    }
  }, [independentAssigned, lessonsAssigned])

  React.useEffect(() => {
    if (independentRecommendations && lessonsRecommendations && previouslyAssignedLessonsRecommendations && previouslyAssignedIndependentRecommendations) {
      setLoading(false)
    }
  }, [independentRecommendations, lessonsRecommendations, previouslyAssignedLessonsRecommendations, previouslyAssignedIndependentRecommendations])

  function getRecommendations() {
    requestGet(`/teachers/progress_reports/recommendations_for_classroom/${classroomId}/activity/${activityId}${unitQueryString}`, (data) => {
      setIndependentRecommendations(JSON.parse(JSON.stringify(data.recommendations)));
      setStudents(data.students)
    });
    requestGet(`/teachers/progress_reports/lesson_recommendations_for_classroom/${classroomId}/activity/${activityId}${unitQueryString}`, (data) => {
      setLessonsRecommendations(data.lessonsRecommendations);
    });
  }

  function getPreviouslyAssignedRecommendationData() {
    requestGet(`/teachers/progress_reports/previously_assigned_recommendations/${classroomId}/activity/${activityId}${unitQueryString}`, ((data) => {
      setPreviouslyAssignedIndependentRecommendations(data.previouslyAssignedIndependentRecommendations)
      setPreviouslyAssignedLessonsRecommendations(data.previouslyAssignedLessonsRecommendations)
    }));
  }

  function initializePusher(isLessons=false) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(classroomId);
    if (isLessons) {
      channel.bind('lessons-recommendations-assigned', (data) => {
        triggerSnackbar('Activity packs assigned')
        setLessonsAssigned(true)
        setLessonsAssigning(false)
        getPreviouslyAssignedRecommendationData();
      });
    } else {
      channel.bind('personalized-recommendations-assigned', (data) => {
        triggerSnackbar('Activity packs assigned')
        setIndependentAssigned(true)
        setIndependentAssigning(false)
        getPreviouslyAssignedRecommendationData();
      });
    }
  }

  function triggerSnackbar(snackbarCopy) {
    setSnackbarText(snackbarCopy)
    setShowSnackbar(true)
  }

  function assignLessonsActivityPacks(unitTemplateIds) {
    initializePusher(true)
    requestPost('/teachers/progress_reports/assign_selected_packs/', { whole_class: true, unit_template_ids: unitTemplateIds, classroom_id: params.classroomId }, (data) => {}, (data) => {
      alert('We had trouble processing your request. Please check your network connection and try again.');
    })
  }

  function formatSelectionsForAssignment() {
    const independentSelectionsArr = independentSelections.map((activityPack, index) => {
      const students = _.uniq(activityPack.students.concat(previouslyAssignedIndependentRecommendations[index].students))
      return {
        id: activityPack.activity_pack_id,
        classrooms: [
          {
            id: classroomId,
            student_ids: students,
          }
        ],
      }
    });
    return { selections: independentSelectionsArr ,};
  }

  function assignIndependentActivityPacks() {
    const dataToPass = {
      ...formatSelectionsForAssignment(),
      assigning_all_recommended_packs: _.isEqual(independentSelections, independentRecommendations)
    }
    setIndependentAssigning(true)
    initializePusher()
    requestPost('/teachers/progress_reports/assign_selected_packs/', dataToPass, (data) => {}, (data) => {
      alert('We had trouble processing your request. Please check your network connection and try again.');
      setIndependentAssigning(false)
    })
  }

  if (loading) { return <LoadingSpinner /> }

  const recommendedKey = (<div className="recommended-key">
    <div className="recommended-image">{asteriskIcon}</div>
    <span>Recommended</span>
  </div>)

  return (<main className="diagnostic-recommendations-container">
    <Snackbar text={snackbarText} visible={showSnackbar} />
    <header>
      <h1>Practice recommendations</h1>
      <a className="focus-on-light" href="/">{fileDocumentIcon}<span>Guide</span></a>
    </header>
    {mobileNavigation}
    <p className="explanation">Based on the results of the diagnostic, we created a personalized learning plan for each student. Customize your learning plan by selecting the activity packs you would like to assign.</p>
    <section className="independent-practice">
      <div className="section-header"><h2>Independent practice</h2>{recommendedKey}</div>
      <IndependentRecommendationsButtons assignActivityPacks={assignIndependentActivityPacks} assigned={independentAssigned} assigning={independentAssigning} independentSelections={independentSelections} recommendations={independentRecommendations} setIndependentSelections={setIndependentSelections} students={students} />
      <RecommendationsTable previouslyAssignedRecommendations={previouslyAssignedIndependentRecommendations} recommendations={independentRecommendations} selections={independentSelections} setSelections={setIndependentSelections} students={students} />
    </section>
    <section className="whole-class-instruction">
      <div className="section-header">
        <h2>Whole class instruction</h2>
        <Tooltip
          tooltipText="Quill recommends a Quill Lessons activity when at least 50% of the students in your class need instruction on a particular skill. Quill Lessons are teacher-led lessons that include a full lesson plan, suggested slides, real-time paired practice, and whole-class discussion time. Each lesson is focused on a specific grammar skill."
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />
        {recommendedKey}
      </div>
      <LessonsRecommendationsButtons assigned={lessonsAssigned} assigning={lessonsAssigning} assignLessonsActivityPacks={assignLessonsActivityPacks} lessonsRecommendations={lessonsRecommendations} lessonsSelections={independentSelections} setLessonsSelections={setLessonsSelections} students={students} />
    </section>
  </main>
  )
}

export default withRouter(Recommendations)
