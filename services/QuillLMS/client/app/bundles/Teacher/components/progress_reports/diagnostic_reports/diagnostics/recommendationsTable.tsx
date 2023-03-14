import * as React from 'react'
import { Link, } from 'react-router-dom'

import {
  noDataYet,
  recommendedGlyph,
  correctImage,
  baseDiagnosticImageSrc,
  DEFAULT_LEFT_PADDING,
  MOBILE_WIDTH,
  DEFAULT_LEFT_PADDING_FOR_MOBILE
} from './shared'
import {
  Recommendation,
  Student,
} from './interfaces'
import StudentNameOrTooltip from './studentNameOrTooltip'
import ActivityPackHeader from './activityPackHeader'

import {
  smallWhiteCheckIcon,
} from '../../../../../Shared/index'

const openInNewTabIcon = <img alt="Open in new tab icon" src={`${baseDiagnosticImageSrc}/icons-open-in-new.svg`} />

const TABLE_LEFT_PADDING = 0

interface RecommendationsTableProps {
  recommendations: Recommendation[];
  isPostTest: boolean;
  responsesLink: (studentId: number) => string;
  previouslyAssignedRecommendations: Recommendation[];
  students: Student[];
  selections: Recommendation[];
  setSelections: (selections: Recommendation[]) => void;
  studentsWhoCompletedDiagnostic: Student[];
  studentsWhoCompletedAssignedRecommendations: Student[];
  postDiagnosticUnitTemplateId?: number;
  setPostTestSelections: (ids: number[]) => void;
  postTestSelections: number[];
  previouslyAssignedPostTestStudentIds: number[]
}

interface RecommendationCellProps {
  student: Student;
  isAssigned: boolean;
  isRecommended: boolean;
  isSelected: boolean;
  setSelections: (selections: Recommendation[]) => void;
  selections: Recommendation[];
  selectionIndex: number;
  completedCount?: number;
  activityCount?: number;
}

const RecommendationCell = ({ student, isAssigned, isRecommended, isSelected, setSelections, selections, selectionIndex, activityCount, completedCount, }: RecommendationCellProps) => {
  const [wasAssignedAtLoad, setWasAssignedAtLoad] = React.useState(isAssigned)
  const [showAssignedText, setShowAssignedText] = React.useState(false)

  React.useEffect(() => {
    if (isAssigned && !wasAssignedAtLoad) {
      setShowAssignedText(true)
      setTimeout(() => { setShowAssignedText(false)}, 5000)
    }
  }, [isAssigned])

  function toggleSelection() {
    const newSelections = [...selections];
    if (isSelected) {
      newSelections[selectionIndex].students = newSelections[selectionIndex].students.filter(s => s !== student.id)
    } else {
      newSelections[selectionIndex].students.push(student.id);
    }
    setSelections(newSelections)
  }

  let checkbox = <span aria-label="Unchecked checkbox" className="quill-checkbox unselected" />
  const assignedText = showAssignedText && <div className="assigned">{correctImage}<span>Assigned</span></div>
  const progressIndicator = isAssigned && <p className="progress-indicator"><span className="counts">{completedCount} of {activityCount}</span><span>Activities Completed</span></p>

  if (isSelected) {
    checkbox = (<span aria-label="Checked checkbox" className="quill-checkbox selected" >
      <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
    </span>)
  }
  return (
    <td className="recommendation-cell">
      <button className={`interactive-wrapper ${isRecommended && !showAssignedText ? 'recommended' : ''}`} onClick={isAssigned ? () => {} : toggleSelection} type="button">
        {isRecommended ? recommendedGlyph : <span />}
        {assignedText || progressIndicator || checkbox}
        <span />
      </button>
    </td>
  )
}

const PostTestStudentRow = ({ student, postTestSelections, setPostTestSelections, previouslyAssignedPostTestStudentIds, studentsWhoCompletedAssignedRecommendations, }) => {
  const { name, completed, id, } = student

  if (!completed) {
    return <tr key={name}><td className="recommendation-cell empty-cell" /></tr>
  }

  const isAssigned = previouslyAssignedPostTestStudentIds.includes(id)
  const isSelected = postTestSelections.includes(id)
  const isRecommended = studentsWhoCompletedAssignedRecommendations.some(student => student.id === id)

  function toggleSelection() {
    let newSelections = [...postTestSelections];
    if (isSelected) {
      newSelections = newSelections.filter(s => s !== student.id)
    } else {
      newSelections.push(student.id);
    }
    setPostTestSelections(newSelections)
  }

  let checkbox = <span aria-label="Unchecked checkbox" className="quill-checkbox unselected" />
  const assignedText = <div className="assigned">{correctImage}<span>Assigned</span></div>

  if (isSelected) {
    checkbox = (<span aria-label="Checked checkbox" className="quill-checkbox selected" >
      <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
    </span>)
  }

  return (
    <tr>
      <td className="recommendation-cell">
        <button className={`interactive-wrapper ${isRecommended && !isAssigned ? 'recommended' : ''}`} onClick={isAssigned ? () => {} : toggleSelection} type="button">
          {isAssigned ? assignedText : checkbox}
          <span />
        </button>
      </td>
    </tr>
  )
}

const StudentRow = ({ student, selections, recommendations, previouslyAssignedRecommendations, setSelections, responsesLink, }) => {
  const { name, completed, id, } = student

  let firstCell = (<th className="name-cell">
    <div>
      <StudentNameOrTooltip name={name} />
      <span className="name-section-subheader">Diagnostic not completed</span>
    </div>
  </th>)

  let selectionCells = selections.map((selection: Recommendation) => (<td key={selection.name} />))
  if (completed) {
    firstCell = (
      <th className="name-cell">
        <Link rel="noopener noreferrer" target="_blank" to={responsesLink(id)}>
          <StudentNameOrTooltip name={name} />
          {openInNewTabIcon}
        </Link>
      </th>
    )

    selectionCells = selections.map((selection: Recommendation, i: number) => {
      const previouslyAssignedRecommendation = previouslyAssignedRecommendations.find(r => r.activity_pack_id === selection.activity_pack_id)
      const isAssigned = previouslyAssignedRecommendation.students.includes(id)
      const completedCount = isAssigned && previouslyAssignedRecommendation.diagnostic_progress[id]
      const isRecommended = recommendations.find(r => r.activity_pack_id === selection.activity_pack_id).students.includes(id)
      const isSelected = selection.students.includes(id)
      return (
        <RecommendationCell
          activityCount={previouslyAssignedRecommendation.activity_count}
          completedCount={completedCount}
          isAssigned={isAssigned}
          isRecommended={isRecommended}
          isSelected={isSelected}
          key={`${id}-${selection.activity_pack_id}`}
          selectionIndex={i}
          selections={selections}
          setSelections={setSelections}
          student={student}
        />
      )
    })
  }
  return <tr key={name}>{firstCell}{selectionCells}</tr>
}

const RecommendationsTable = ({ postTestSelections, previouslyAssignedPostTestStudentIds, setPostTestSelections, studentsWhoCompletedAssignedRecommendations, recommendations, responsesLink, students, selections, previouslyAssignedRecommendations, setSelections, studentsWhoCompletedDiagnostic, isPostTest, postDiagnosticUnitTemplateId}: RecommendationsTableProps) => {
  const recommendationsTableRef = React.useRef(null);

  function paddingLeft() {
    if (MOBILE_WIDTH >= window.innerWidth) { return DEFAULT_LEFT_PADDING_FOR_MOBILE }
    const explanation = document.getElementsByClassName('explanation')[0]
    return explanation && DEFAULT_LEFT_PADDING
  }

  function onSelectAllForPostDiagnosticClick() {
    const studentIdsWhoHaveCompletedDiagnostic = students.filter(s => s.completed).map(s => s.id)
    setPostTestSelections(studentIdsWhoHaveCompletedDiagnostic)
  }

  function onSelectAllColumnClick(activityPackId) {
    const newSelections = [...selections];
    const selectionIndex = newSelections.findIndex(sel => sel.activity_pack_id === activityPackId)
    const studentIdsWhoHaveCompletedDiagnostic = students.filter(s => s.completed).map(s => s.id)

    newSelections[selectionIndex].students = studentIdsWhoHaveCompletedDiagnostic

    setSelections(newSelections)
  }

  const tableHeaders = recommendations && recommendations.map(recommendation => {
    const { activity_pack_id, name, activity_count, } = recommendation

    function handleSelectAllClick() {
      onSelectAllColumnClick(activity_pack_id)
    }

    return (
      <ActivityPackHeader
        activityCount={activity_count}
        activityPackId={activity_pack_id}
        handleSelectAllClick={handleSelectAllClick}
        key={name}
        name={name}
      />
    )
  })

  const renderPostTestTableHeader = () => {
    const style = {}

    const anchorElement = document.getElementsByClassName('corner-header')[0]

    if (anchorElement) {
      style.height = anchorElement.getBoundingClientRect().height
    }

    return (
      <ActivityPackHeader
        activityCount={1}
        activityPackId={postDiagnosticUnitTemplateId}
        handleSelectAllClick={onSelectAllForPostDiagnosticClick}
        name="Diagnostic (Post) Test"
        style={style}
      />
    )
  }

  const recommendationStudentRows = isPostTest ? students.map(student => (
    <PostTestStudentRow
      key={student.name}
      postTestSelections={postTestSelections}
      previouslyAssignedPostTestStudentIds={previouslyAssignedPostTestStudentIds}
      setPostTestSelections={setPostTestSelections}
      student={student}
      studentsWhoCompletedAssignedRecommendations={studentsWhoCompletedAssignedRecommendations}
    />
  )) : students.map(student => (
    <StudentRow
      key={student.name}
      previouslyAssignedRecommendations={previouslyAssignedRecommendations}
      recommendations={recommendations}
      responsesLink={responsesLink}
      selections={selections}
      setSelections={setSelections}
      student={student}
    />)
  )

  const tableHasContent = studentsWhoCompletedDiagnostic.length

  let recommendationsTableClassName = tableHasContent ? 'recommendations-table' : 'empty recommendations-table'
  if (isPostTest) { recommendationsTableClassName += ' post-test-table'}

  const renderRecommendationsTableHeader = () => {

    return (
      <thead>
        <tr>
          {isPostTest ? null : <th className="corner-header">Name</th>}
          {isPostTest ? renderPostTestTableHeader() : tableHeaders}
        </tr>
      </thead>
    )
  }

  return (
    <div>
      <table className={recommendationsTableClassName} id="demo-onboarding-tour-spotlight-element" ref={recommendationsTableRef} style={tableHasContent ? { paddingLeft: TABLE_LEFT_PADDING } : { marginLeft: paddingLeft() }}>
        {renderRecommendationsTableHeader()}
        {(tableHasContent || isPostTest) ? null : noDataYet}
        <tbody>
          {recommendationStudentRows}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendationsTable
