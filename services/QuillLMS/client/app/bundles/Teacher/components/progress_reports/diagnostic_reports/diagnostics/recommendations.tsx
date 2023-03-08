import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';
import Pusher from 'pusher-js';
import * as _ from 'lodash'

import {
  baseDiagnosticImageSrc,
  fileDocumentIcon,
  recommendedGlyph,
  correctImage,
  informationIcon,
  expandIcon,
  releaseMethodToDisplayName,
  IMMEDIATE,
} from './shared'
import RecommendationsTable from './recommendationsTable'
import PostTestAssignmentTable from './postTestTable';
import ReleaseMethodModal from './releaseMethodModal'
import {
  Recommendation,
  LessonRecommendation,
  Student,
} from './interfaces'

import DemoOnboardingTour, { DEMO_ONBOARDING_DIAGNOSTIC_RECOMMENDATIONS,  } from '../../../shared/demo_onboarding_tour'
import ActivityDisclaimerBanner from '../../../shared/activityDisclaimerBanner'
import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet, requestPost, } from '../../../../../../modules/request/index';
import {
  helpIcon,
  Tooltip,
  Snackbar,
  defaultSnackbarTimeout,
  smallWhiteCheckIcon,
  previewIcon,
  LESSONS,
} from '../../../../../Shared/index'
import useSnackbarMonitor from '../../../../../Shared/hooks/useSnackbarMonitor'

const craneIllustration = <img alt="Grayscale construction crane" src={`${baseDiagnosticImageSrc}/crane-grayscale.svg`} />

const LESSONS_RECOMMENDATION_THRESHOLD = 50
const TROUBLE_PROCESSING_MESSAGE = 'We had trouble processing your request. Please check your network connection and try again.'

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
          {isRecommended ? recommendedGlyph : <span className="recommended-glyph-placeholder" />}
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

const RecommendationsButtons = ({ className, parentClassName, numberSelected, assigning, assigned, handleClickAssignActivityPacks, deselectAll, selectAll, selectAllRecommended, releaseMethod, handleClickEditReleaseMethod }) => {
  let assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assign activity packs</button>

  if (assigning) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigning...</button>
  } else if (assigned) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigned</button>
  } else if (numberSelected) {
    assignButton = <button className="quill-button primary contained small focus-on-light" onClick={handleClickAssignActivityPacks} type="button">Assign activity packs</button>
  }

  let releaseMethodText
  let showReleaseMethodModalButton

  if (releaseMethod) {
    releaseMethodText = <span>Release Method: <b>{releaseMethod}</b></span>
  }

  if (releaseMethod && handleClickEditReleaseMethod) {
    showReleaseMethodModalButton = <button className="interactive-wrapper focus-on-light edit-release-method-button" onClick={handleClickEditReleaseMethod} type="button">Edit</button>
  }

  return (
    <div className={`recommendations-buttons-container ${parentClassName}`}>
      <div className={`recommendations-buttons ${className}`}>
        <div className="selection-buttons">
          <button className="quill-button fun secondary outlined focus-on-light" onClick={selectAll} type="button">Select all</button>
          <button className="quill-button fun secondary outlined focus-on-light" onClick={selectAllRecommended} type="button">Select all recommended</button>
          <button className="quill-button fun secondary outlined focus-on-light" onClick={deselectAll} type="button">Deselect all</button>
        </div>
        <div className="release-method-and-assign-buttons">
          <div className="release-method-text-and-edit-button">
            {releaseMethodText}
            {showReleaseMethodModalButton}
          </div>
          {assignButton}
        </div>
      </div>
    </div>
  )
}

const PostTestAssignmentButton = ({ assigningPostTest, assignedPostTest, assignPostTest, numberSelectedForPostTest, releaseMethod}) => {
  let assignDivClass
  if (releaseMethod) {
    assignDivClass = "larger-assign"
  }

  let assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assign test</button>

  if (assigningPostTest) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigning...</button>
  } else if (assignedPostTest) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigned</button>
  } else if (numberSelectedForPostTest) {
    assignButton = <button className="quill-button primary contained small focus-on-light" onClick={assignPostTest} type="button">Assign test</button>
  }

  return (
    <div className={`recommendations-buttons post-test-assignment-button ${assignDivClass}`}>
      {assignButton}
    </div>
  )
}

const IndependentRecommendationsButtons = ({ handleClickAssignActivityPacks, independentSelections, setIndependentSelections, recommendations, students, assigned, assigning, previouslyAssignedRecommendations, releaseMethod, setShowReleaseMethodModal,}) => {
  function handleClickEditReleaseMethod() { setShowReleaseMethodModal(true) }

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

  return (
    <RecommendationsButtons
      assigned={assigned}
      assigning={assigning}
      className="independent-practice-recommendations-buttons"
      deselectAll={handleDeselectAllClick}
      handleClickAssignActivityPacks={handleClickAssignActivityPacks}
      handleClickEditReleaseMethod={releaseMethod && handleClickEditReleaseMethod}
      numberSelected={numberSelected}
      parentClassName="independent-practice-recommendations-buttons-container"
      releaseMethod={releaseMethodToDisplayName[releaseMethod]}
      selectAll={handleSelectAllClick}
      selectAllRecommended={handleSelectAllRecommendedClick}
    />
  )
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

  return (
    <RecommendationsButtons
      assigned={assigned}
      assigning={assigning}
      deselectAll={handleDeselectAllClick}
      handleClickAssignActivityPacks={assignLessonsActivityPacks}
      numberSelected={lessonsSelections.length}
      releaseMethod="Unlocked by Teacher"
      selectAll={handleSelectAllClick}
      selectAllRecommended={handleSelectAllRecommendedClick}
    />
  )
}

export const Recommendations = ({ passedPreviouslyAssignedRecommendations, passedPreviouslyAssignedLessonRecommendations, passedIndependentRecommendations, passedLessonRecommendations, match, mobileNavigation, activityName, location, lessonsBannerIsShowable, postDiagnosticUnitTemplateId, isPostDiagnostic, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedPreviouslyAssignedRecommendations && !passedIndependentRecommendations && !passedLessonRecommendations);
  const [previouslyAssignedIndependentRecommendations, setPreviouslyAssignedIndependentRecommendations] = React.useState<Recommendation[]>(passedPreviouslyAssignedRecommendations);
  const [previouslyAssignedLessonsRecommendations, setPreviouslyAssignedLessonsRecommendations] = React.useState<LessonRecommendation[]>(passedPreviouslyAssignedLessonRecommendations);
  const [previouslyAssignedPostTestStudentIds, setPreviouslyAssignedPostTestStudentIds] = React.useState<number[]>([])
  const [independentRecommendations, setIndependentRecommendations] = React.useState<Recommendation[]>(passedIndependentRecommendations);
  const [lessonsRecommendations, setLessonsRecommendations] = React.useState<LessonRecommendation[]>(passedLessonRecommendations);
  const [independentSelections, setIndependentSelections] = React.useState<Recommendation[]>([]);
  const [lessonsSelections, setLessonsSelections] = React.useState<number[]>([]);
  const [postTestSelections, setPostTestSelections] = React.useState<number[]>([])
  const [students, setStudents] = React.useState<Student[]>([]);
  const [independentAssigning, setIndependentAssigning] = React.useState(false)
  const [independentAssigned, setIndependentAssigned] = React.useState(false)
  const [postTestAssigning, setPostTestAssigning] = React.useState(false)
  const [postTestAssigned, setPostTestAssigned] = React.useState(false)
  const [lessonsAssigning, setLessonsAssigning] = React.useState(false)
  const [lessonsAssigned, setLessonsAssigned] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [lessonsBannerEnabled, setLessonsBannerEnabled] = React.useState(lessonsBannerIsShowable)
  const [releaseMethod, setReleaseMethod] = React.useState(null)
  const [originalReleaseMethod, setOriginalReleaseMethod] = React.useState(null)
  const [showReleaseMethodModal, setShowReleaseMethodModal] = React.useState(false)

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
    setPreviouslyAssignedPostTestStudentIds([])
    getRecommendations()
    getPreviouslyAssignedRecommendationData()
    getPreviouslyAssignedPostTestData()
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
    if (postTestAssigned) {
      setTimeout(() => setPostTestAssigned(false), 5000)
    }
  }, [independentAssigned, lessonsAssigned, postTestAssigned])

  React.useEffect(() => {
    if (independentRecommendations && lessonsRecommendations && previouslyAssignedLessonsRecommendations && previouslyAssignedIndependentRecommendations) {
      setLoading(false)
    }
  }, [independentRecommendations, lessonsRecommendations, previouslyAssignedLessonsRecommendations, previouslyAssignedIndependentRecommendations])

  React.useEffect(() => {
    setReleaseMethod(originalReleaseMethod)
  }, [originalReleaseMethod])

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
      const anyIndependentRecommendationsPreviouslyAssigned = data.previouslyAssignedIndependentRecommendations.some(rec => rec.students.length)
      const releaseMethod = anyIndependentRecommendationsPreviouslyAssigned ? data.releaseMethod || IMMEDIATE : data.releaseMethod
      setOriginalReleaseMethod(releaseMethod)
    }));
  }

  function getPreviouslyAssignedPostTestData() {
    if (!postDiagnosticUnitTemplateId) { return }
    requestGet(`/teachers/progress_reports/student_ids_for_previously_assigned_activity_pack/${classroomId}/activity_pack/${postDiagnosticUnitTemplateId}`, ((data) => {
      setPreviouslyAssignedPostTestStudentIds(data.student_ids)
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
        pusher.unsubscribe(classroomId)
      });
    } else {
      channel.bind('personalized-recommendations-assigned', (data) => {
        triggerSnackbar('Activity packs assigned')
        setIndependentAssigned(true)
        setIndependentAssigning(false)
        getPreviouslyAssignedRecommendationData();
        pusher.unsubscribe(classroomId)
      });
    }
  }

  function triggerSnackbar(snackbarCopy) {
    setSnackbarText(snackbarCopy)
    setShowSnackbar(true)
  }

  function onClickCancelReleaseMethod() {
    setReleaseMethod(originalReleaseMethod)
    setShowReleaseMethodModal(false)
  }

  function assignLessonsActivityPacks() {
    initializePusher(true)
    requestPost('/teachers/progress_reports/assign_whole_class_instruction_packs/', { unit_template_ids: lessonsSelections, classroom_id: params.classroomId }, (data) => {}, (data) => {
      alert(TROUBLE_PROCESSING_MESSAGE);
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
            order: index
          }
        ]
      }
    });
    return { selections: independentSelectionsArr ,};
  }

  function assignIndependentActivityPacks() {
    setShowReleaseMethodModal(false)
    const dataToPass = {
      classroom_id: classroomId,
      diagnostic_activity_id: activityId,
      ...formatSelectionsForAssignment(),
      assigning_all_recommended_packs: _.isEqual(independentSelections, independentRecommendations),
      release_method: releaseMethod
    }
    setIndependentAssigning(true)
    initializePusher()
    requestPost('/teachers/progress_reports/assign_independent_practice_packs/', dataToPass, (data) => {}, (data) => {
      alert(TROUBLE_PROCESSING_MESSAGE);
      setIndependentAssigning(false)
    })
  }

  function assignPostTest() {
    const dataToPass = {
      classroom_id: classroomId,
      student_ids: postTestSelections,
      unit_template_id: postDiagnosticUnitTemplateId
    }
    setPostTestAssigning(true)
    requestPost('/teachers/progress_reports/assign_post_test/', dataToPass, (data) => {
      setPostTestAssigning(false)
      setPostTestAssigned(true)
      getPreviouslyAssignedPostTestData()
    }, (data) => {
      alert(TROUBLE_PROCESSING_MESSAGE);
      setPostTestAssigning(false)
    })
  }

  function handleClickAssignIndependentActivityPacks() {
    if (releaseMethod) {
      assignIndependentActivityPacks()
    } else {
      setShowReleaseMethodModal(true)
    }
  }

  const responsesLink = (studentId: number) => unitId ? `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}?unit=${unitId}` : `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  if (loading) { return <LoadingSpinner /> }

  const studentsWhoCompletedDiagnostic = students.filter(sr => sr.completed)
  const studentsWhoCompletedAssignedRecommendations = studentsWhoCompletedDiagnostic.filter(sr => {
    const assignedPacks = previouslyAssignedIndependentRecommendations.filter(rec => rec.students.includes(sr.id))
    if (assignedPacks.length === 0) { return false }

    return assignedPacks.every(pack => pack.activity_count === pack.diagnostic_progress[sr.id])
  })

  const showPostTestAssignmentColumn = studentsWhoCompletedDiagnostic.length && postDiagnosticUnitTemplateId && !isPostDiagnostic

  const recommendedKey = (<div className="recommended-key">
    <div className="recommended-image">{recommendedGlyph}</div>
    <div>
      <span>Recommended practice - not yet proficient</span>
      <p>Each cell highlighted in green is an area for growth for the student - the student did not demonstrate full proficiency in this skill on the diagnostic, and Quill recommends that the student practices this skill. You can see their exact proficiency for each skill on the student results page.</p>
    </div>
  </div>)

  let independentRecommendationsSection

  if (independentRecommendations.length) {
    independentRecommendationsSection = (<React.Fragment>
      <p className="explanation">Based on the results of the diagnostic, we created a personalized learning plan for each student. Customize your learning plan by selecting the activity packs you would like to assign.</p>
      <section className="independent-practice">
        <div className="section-header">
          <h2>Independent practice</h2>{recommendedKey}
        </div>
        <div className="recommendations-table-container">
          <div className="recommendations-table-wrapper">
            <IndependentRecommendationsButtons
              assigned={independentAssigned}
              assignedPostTest={postTestAssigned}
              assigning={independentAssigning}
              assigningPostTest={postTestAssigning}
              assignPostTest={assignPostTest}
              handleClickAssignActivityPacks={handleClickAssignIndependentActivityPacks}
              independentSelections={independentSelections}
              numberSelectedForPostTest={postTestSelections.length}
              previouslyAssignedRecommendations={previouslyAssignedIndependentRecommendations}
              recommendations={independentRecommendations}
              releaseMethod={releaseMethod}
              setIndependentSelections={setIndependentSelections}
              setShowReleaseMethodModal={setShowReleaseMethodModal}
              showPostTestAssignmentColumn={showPostTestAssignmentColumn}
              students={students}
            />
            <RecommendationsTable
              postDiagnosticUnitTemplateId={postDiagnosticUnitTemplateId}
              postTestSelections={postTestSelections}
              previouslyAssignedPostTestStudentIds={previouslyAssignedPostTestStudentIds}
              previouslyAssignedRecommendations={previouslyAssignedIndependentRecommendations}
              recommendations={independentRecommendations}
              responsesLink={responsesLink}
              selections={independentSelections}
              setPostTestSelections={setPostTestSelections}
              setSelections={setIndependentSelections}
              showPostTestAssignmentColumn={showPostTestAssignmentColumn}
              students={students}
              studentsWhoCompletedAssignedRecommendations={studentsWhoCompletedAssignedRecommendations}
              studentsWhoCompletedDiagnostic={studentsWhoCompletedDiagnostic}
            />
          </div>
          <div>
            {showPostTestAssignmentColumn ? <PostTestAssignmentButton
              assignedPostTest={postTestAssigned}
              assigningPostTest={postTestAssigning}
              assignPostTest={assignPostTest}
              numberSelectedForPostTest={postTestSelections.length}
              releaseMethod={releaseMethod}
            /> : null}
            <PostTestAssignmentTable
              postDiagnosticUnitTemplateId={postDiagnosticUnitTemplateId}
              postTestSelections={postTestSelections}
              previouslyAssignedPostTestStudentIds={previouslyAssignedPostTestStudentIds}
              setPostTestSelections={setPostTestSelections}
              showPostTestAssignmentColumn={showPostTestAssignmentColumn}
              students={students}
              studentsWhoCompletedAssignedRecommendations={studentsWhoCompletedAssignedRecommendations}
              studentsWhoCompletedDiagnostic={studentsWhoCompletedDiagnostic}
            />
          </div>
        </div>
      </section>
    </React.Fragment>)
  }

  let assigningLessonsBanner

  if (lessonsSelections.length && lessonsBannerEnabled) {
    assigningLessonsBanner = <ActivityDisclaimerBanner activityType={LESSONS} closeBanner={closeLessonsBanner} />
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
      <ReleaseMethodModal
        handleClickAssign={assignIndependentActivityPacks}
        handleClickCancel={onClickCancelReleaseMethod}
        originalReleaseMethod={originalReleaseMethod}
        releaseMethod={releaseMethod}
        setReleaseMethod={setReleaseMethod}
        visible={showReleaseMethodModal}
      />
      <DemoOnboardingTour pageKey={DEMO_ONBOARDING_DIAGNOSTIC_RECOMMENDATIONS} />
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
