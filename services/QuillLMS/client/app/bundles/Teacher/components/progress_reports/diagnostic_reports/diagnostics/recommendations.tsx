import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';
import Pusher from 'pusher-js';
import * as _ from 'lodash'

import {
  baseDiagnosticImageSrc,
  fileDocumentIcon,
  asteriskIcon,
  correctImage,
  informationIcon,
  expandIcon,
} from './shared'
import RecommendationsTable from './recommendationsTable'
import {
  Recommendation,
  LessonRecommendation,
  Student,
} from './interfaces'

import AssigningLessonsBanner from '../../../shared/assigningLessonsBanner'
import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet, requestPost, } from '../../../../../../modules/request/index';
import {
  helpIcon,
  Tooltip,
  Snackbar,
  defaultSnackbarTimeout,
  smallWhiteCheckIcon,
  previewIcon,
} from '../../../../../Shared/index'
import useSnackbarMonitor from '../../../../../Shared/hooks/useSnackbarMonitor'

const craneIllustration = <img alt="Grayscale construction crane" src={`${baseDiagnosticImageSrc}/crane-grayscale.svg`} />

const LESSONS_RECOMMENDATION_THRESHOLD = 50

const LessonRecommendation = ({ previouslyAssignedRecommendations, selections, setSelections, recommendation, }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const { activity_pack_id, name, students_needing_instruction, activities, percentage_needing_instruction, } = recommendation

  function toggleExpansion() {
    setIsExpanded(!isExpanded)
  }

  function toggleSelection() {
    if (selections.includes(activity_pack_id)) {
      setSelections(selections.filter(selection => selection !== activity_pack_id))
    } else {
      setSelections(selections.concat([activity_pack_id]))
    }
  }

  const isAssigned = previouslyAssignedRecommendations.includes(activity_pack_id)
  const isSelected = selections.find(s => s === activity_pack_id)
  const isRecommended = percentage_needing_instruction >= LESSONS_RECOMMENDATION_THRESHOLD

  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={toggleSelection} type="button" />
  const assigned = <div className="assigned">{correctImage}<span>Assigned</span></div>
  if (isSelected) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={toggleSelection} type="button" >
      <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
    </button>)
  }
  const studentNames = students_needing_instruction.join('<br/>')
  const activityRows = activities.map(activity => {
    return (
      <div className="activity-row" key={activity.name}>
        <span>{activity.name}</span>
        <a className="interactive-wrapper focus-on-light" href={activity.url} rel="noopener noreferrer" target="_blank">
          <img alt={previewIcon.alt} src={previewIcon.src} />
          <span>Preview</span>
        </a>
      </div>
)
  })

  return (
    <section className={`lessons-recommendation ${isExpanded? 'is-expanded' : ''} ${isRecommended && !isAssigned ? 'is-recommended-and-not-assigned' : ''}`}>
      <div className="top-row">
        <div>
          {isRecommended ? asteriskIcon : <span className="asterisk-placeholder" />}
          {isAssigned ? <span className="checkbox-placeholder" /> : checkbox}
          <h3>{name}</h3>
        </div>
        <div>
          {isAssigned && assigned}
          <Tooltip
            tooltipText={studentNames}
            tooltipTriggerText={informationIcon}
          />
          <span>{students_needing_instruction.length} student{students_needing_instruction.length === 1 ? '' : 's'} need{students_needing_instruction.length === 1 ? 's' : ''} instruction</span>
          <span className="activities-count">{activities.length} lesson{activities.length === 1 ? '' : 's'}</span>
          <button className="interactive-wrapper" onClick={toggleExpansion} type="button">{expandIcon}</button>
        </div>
      </div>
      {isExpanded && activityRows}
    </section>
)
}

const LessonsRecommendations = ({ assigningLessonsBanner, previouslyAssignedRecommendations, recommendations, selections, setSelections, }) => {
  return (
    <div className="lessons-recommendations">
      {recommendations.map(recommendation => <LessonRecommendation key={recommendation.activity_pack_id} previouslyAssignedRecommendations={previouslyAssignedRecommendations} recommendation={recommendation} selections={selections} setSelections={setSelections} />)}
      {assigningLessonsBanner}
    </div>
  )
}

const RecommendationsButtons = ({numberSelected, assigning, assigned, assignActivityPacks, deselectAll, selectAll, selectAllRecommended}) => {
  let assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assign activity packs</button>

  if (assigning) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigning...</button>
  } else if (assigned) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigned</button>
  } else if (numberSelected) {
    assignButton = <button className="quill-button primary contained small focus-on-light" onClick={assignActivityPacks} type="button">Assign activity packs</button>
  }

  return (
    <div className="recommendations-buttons-container">
      <div className="recommendations-buttons">
        <div>
          <button className="quill-button fun secondary outlined focus-on-light" onClick={selectAll} type="button">Select all</button>
          <button className="quill-button fun secondary outlined focus-on-light" onClick={selectAllRecommended} type="button">Select all recommended</button>
          <button className="quill-button fun secondary outlined focus-on-light" onClick={deselectAll} type="button">Deselect all</button>
        </div>
        <div>
          {assignButton}
        </div>
      </div>
    </div>
)
}

const IndependentRecommendationsButtons = ({ assignActivityPacks, independentSelections, setIndependentSelections, recommendations, students, assigned, assigning, previouslyAssignedRecommendations, }) => {
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

  const numberSelected = independentSelections.reduce((previousValue, selection) => {
    const previouslyAssignedActivity = previouslyAssignedRecommendations.find(r => r.activity_pack_id === selection.activity_pack_id)
    const selectedStudents = selection.students.filter(id => !previouslyAssignedActivity.students.includes(id))
    return previousValue += selectedStudents.length
  }, 0)
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

  return <RecommendationsButtons assignActivityPacks={assignLessonsActivityPacks} assigned={assigned} assigning={assigning} deselectAll={handleDeselectAllClick} numberSelected={lessonsSelections.length} selectAll={handleSelectAllClick} selectAllRecommended={handleSelectAllRecommendedClick} />
}

export const Recommendations = ({ passedPreviouslyAssignedRecommendations, passedPreviouslyAssignedLessonRecommendations, passedIndependentRecommendations, passedLessonRecommendations, match, mobileNavigation, activityName, location, lessonsBannerIsShowable, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedPreviouslyAssignedRecommendations && !passedIndependentRecommendations && !passedLessonRecommendations);
  const [previouslyAssignedIndependentRecommendations, setPreviouslyAssignedIndependentRecommendations] = React.useState<Recommendation[]>(passedPreviouslyAssignedRecommendations);
  const [previouslyAssignedLessonsRecommendations, setPreviouslyAssignedLessonsRecommendations] = React.useState<LessonRecommendation[]>(passedPreviouslyAssignedLessonRecommendations);
  const [independentRecommendations, setIndependentRecommendations] = React.useState<Recommendation[]>(passedIndependentRecommendations);
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
  const [lessonsBannerEnabled, setLessonsBannerEnabled] = React.useState(lessonsBannerIsShowable)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  const { params, } = match
  const { activityId, classroomId, } = params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `?unit_id=${unitId}` : ''

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
  }, [activityId, classroomId, unitId])

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

  function closeLessonsBanner() {
    setLessonsBannerEnabled(false)
    requestPost('/milestones/complete_acknowledge_lessons_banner')
  }

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

  function assignLessonsActivityPacks() {
    initializePusher(true)
    requestPost('/teachers/progress_reports/assign_selected_packs/', { whole_class: true, unit_template_ids: lessonsSelections, classroom_id: params.classroomId }, (data) => {}, (data) => {
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

  const responsesLink = (studentId: number) => unitId ? `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}?unit=${unitId}` : `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  if (loading) { return <LoadingSpinner /> }

  const recommendedKey = (<div className="recommended-key">
    <div className="recommended-image">{asteriskIcon}</div>
    <span>Recommended practice - not yet proficient</span>
  </div>)

  let independentRecommendationsSection

  if (independentRecommendations.length) {
    independentRecommendationsSection = (<React.Fragment>
      <p className="explanation">Based on the results of the diagnostic, we created a personalized learning plan for each student. Customize your learning plan by selecting the activity packs you would like to assign.</p>
      <section className="independent-practice">
        <div className="section-header"><h2>Independent practice</h2>{recommendedKey}</div>
        <IndependentRecommendationsButtons assignActivityPacks={assignIndependentActivityPacks} assigned={independentAssigned} assigning={independentAssigning} independentSelections={independentSelections} previouslyAssignedRecommendations={previouslyAssignedIndependentRecommendations} recommendations={independentRecommendations} setIndependentSelections={setIndependentSelections} students={students} />
        <RecommendationsTable previouslyAssignedRecommendations={previouslyAssignedIndependentRecommendations} recommendations={independentRecommendations} responsesLink={responsesLink} selections={independentSelections} setSelections={setIndependentSelections} students={students} />
      </section>
    </React.Fragment>)
  }

  let assigningLessonsBanner

  if (lessonsSelections.length && lessonsBannerEnabled) {
    assigningLessonsBanner = <AssigningLessonsBanner closeLessonsBanner={closeLessonsBanner} />
  }

  let wholeClassInstructionSection

  if (lessonsRecommendations.length) {
    wholeClassInstructionSection = (<section className="whole-class-instruction">
      <div className="section-header">
        <div>
          <h2>Whole class instruction</h2>
          <Tooltip
            tooltipText="Quill recommends a Quill Lessons activity when at least 50% of the students in your class need instruction on a particular skill. Quill Lessons are teacher-led lessons that include a full lesson plan, suggested slides, real-time paired practice, and whole-class discussion time. Each lesson is focused on a specific grammar skill."
            tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
          />
        </div>
        {recommendedKey}
      </div>
      <LessonsRecommendationsButtons assigned={lessonsAssigned} assigning={lessonsAssigning} assignLessonsActivityPacks={assignLessonsActivityPacks} lessonsRecommendations={lessonsRecommendations} lessonsSelections={lessonsSelections} setLessonsSelections={setLessonsSelections} students={students} />
      <LessonsRecommendations assigningLessonsBanner={assigningLessonsBanner} previouslyAssignedRecommendations={previouslyAssignedLessonsRecommendations} recommendations={lessonsRecommendations} selections={lessonsSelections} setSelections={setLessonsSelections} />
    </section>)
  }

  let emptyState

  if (!(independentRecommendations.length || lessonsRecommendations.length)) {
    emptyState = (<section className="recommendations-empty-state">
      {craneIllustration}
      <h2>We&#39;re working on it!</h2>
      <p>We just launched the growth diagnostics, so we don&#39;t have practice recommendations ready for the {activityName} yet. In the meantime, you can always assign the original recommendations again or explore our full library of activities to find additional practice for your students.</p>
    </section>)
  }

  return (
    <main className="diagnostic-recommendations-container">
      <Snackbar text={snackbarText} visible={showSnackbar} />
      <header>
        <h1>Practice recommendations</h1>
        {!emptyState && <a className="focus-on-light" href="https://support.quill.org/en/articles/5698147-how-do-i-read-the-practice-recommendations-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>}
      </header>
      {mobileNavigation}
      {emptyState}
      {independentRecommendationsSection}
      {wholeClassInstructionSection}
    </main>
  )
}

export default withRouter(Recommendations)
