import * as React from 'react'
import { Link, } from 'react-router-dom'

import {
  noDataYet,
  recommendedGlyph,
  correctImage,
  releaseMethodToDisplayName,
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

import {
  helpIcon,
  Tooltip,
  smallWhiteCheckIcon,
} from '../../../../../Shared/index'
import useWindowSize from '../../../../../Shared/hooks/useWindowSize'

const openInNewTabIcon = <img alt="Open in new tab icon" src={`${baseDiagnosticImageSrc}/icons-open-in-new.svg`} />
const ellipsesIcon = <img alt="Open menu icon" src={`${baseDiagnosticImageSrc}/ellipses_icon.svg`} />

const TABLE_LEFT_PADDING = 0
const TABLE_RIGHT_PADDING = 34

interface RecommendationsTableProps {
  recommendations: Recommendation[];
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
  showPostTestAssignmentColumn: boolean;
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

interface StickyTableStyle {
  position: string,
  top: number,
  left: number,
  right: number,
  zIndex: number,
  minWidth: string,
  width: string,
  overflowX: string
}

const ActivityPackHeader = ({ name, activityPackId, activityCount, handleSelectAllClick, style, }) => {
  return (
    <th className="recommendation-header" key={name} style={style || {}}>
      <div className="name-and-tooltip">
        <span>{name}</span>
        <a aria-label="Preview the activity pack" href={`/activities/packs/${activityPackId}`} rel="noopener noreferrer" target="_blank"><img alt="" src={helpIcon.src} /></a>
      </div>
      <div className="activity-count-and-select-all">
        <span className="activity-count">{activityCount} {activityCount === 1 ? 'activity' : 'activities'}</span>
        <Tooltip
          tooltipText="Select all column"
          tooltipTriggerText={<button aria-label="Select all column" className="interactive-wrapper" onClick={handleSelectAllClick} type="button">{ellipsesIcon}</button>}
        />
      </div>
    </th>
  )
}

const PostTestAssignmentButton = ({ assigningPostTest, assignedPostTest, assignPostTest, numberSelectedForPostTest, }) => {
  let assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assign test</button>

  if (assigningPostTest) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigning...</button>
  } else if (assignedPostTest) {
    assignButton = <button className="quill-button primary contained small disabled focus-on-light" type="button">Assigned</button>
  } else if (numberSelectedForPostTest) {
    assignButton = <button className="quill-button primary contained small focus-on-light" onClick={assignPostTest} type="button">Assign test</button>
  }

  return (
    <div className="recommendations-buttons post-test-assignment-button">
      {assignButton}
    </div>
  )
}


const RecommendationsButtons = ({ className, numberSelected, assigning, assigned, handleClickAssignActivityPacks, deselectAll, selectAll, selectAllRecommended, releaseMethod, handleClickEditReleaseMethod, postTestAssignmentButton }) => {
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
    <div className="recommendations-buttons-container">
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
      {postTestAssignmentButton}
    </div>
  )
}

const IndependentRecommendationsButtons = ({ handleClickAssignActivityPacks, independentSelections, setIndependentSelections, recommendations, students, assigned, assigning, previouslyAssignedRecommendations, releaseMethod, setShowReleaseMethodModal, showPostTestAssignmentColumn, assignPostTest, assignedPostTest, assigningPostTest, numberSelectedForPostTest, }) => {
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
      postTestAssignmentButton={showPostTestAssignmentColumn ? <PostTestAssignmentButton assignedPostTest={assignedPostTest} assigningPostTest={assigningPostTest} assignPostTest={assignPostTest} numberSelectedForPostTest={numberSelectedForPostTest} /> : null}
      releaseMethod={releaseMethodToDisplayName[releaseMethod]}
      selectAll={handleSelectAllClick}
      selectAllRecommended={handleSelectAllRecommendedClick}
    />
  )
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

const RecommendationsTable = ({ recommendations, responsesLink, students, selections, previouslyAssignedRecommendations, setSelections, studentsWhoCompletedDiagnostic, studentsWhoCompletedAssignedRecommendations, postDiagnosticUnitTemplateId, setPostTestSelections, postTestSelections, showPostTestAssignmentColumn, previouslyAssignedPostTestStudentIds, }: RecommendationsTableProps) => {
  const size = useWindowSize();

  const [isSticky, setIsSticky] = React.useState(false);
  const recommendationsTableRef = React.useRef(null);
  const [stickyTableStyle, setStickyTableStyle] = React.useState<StickyTableStyle>({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    width: "63%",
    minWidth: "63%",
    overflowX: "scroll",
  })
  const [stickyTableRightOffset, setStickyTableRightOffset] = React.useState(0)

  function paddingLeft() {
    if (MOBILE_WIDTH >= window.innerWidth) { return DEFAULT_LEFT_PADDING_FOR_MOBILE }
    const explanation = document.getElementsByClassName('explanation')[0]
    return explanation && DEFAULT_LEFT_PADDING
  }

  const handleScroll = React.useCallback(({ top, bottom, left, right, }) => {
    if (top <= 0 && bottom > 92) {
      setStickyTableStyle(oldStickyTableStyle => ({ ...oldStickyTableStyle, left: left }))
      setStickyTableRightOffset(right)
      !isSticky && setIsSticky(true);
    } else {
      isSticky && setIsSticky(false);
    }
  }, [isSticky]);

  const onScroll = () => {
    if (recommendationsTableRef && recommendationsTableRef.current) {
      handleScroll(recommendationsTableRef.current.getBoundingClientRect());
    }
  }

  React.useEffect(() => {
    onScroll()
  }, [size])

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

  function onSelectAllColumnClick(activityPackId) {
    const newSelections = [...selections];
    const selectionIndex = newSelections.findIndex(sel => sel.activity_pack_id === activityPackId)
    const studentIdsWhoHaveCompletedDiagnostic = students.filter(s => s.completed).map(s => s.id)

    newSelections[selectionIndex].students = studentIdsWhoHaveCompletedDiagnostic

    setSelections(newSelections)
  }

  function onSelectAllForPostDiagnosticClick() {
    const studentIdsWhoHaveCompletedDiagnostic = students.filter(s => s.completed).map(s => s.id)
    setPostTestSelections(studentIdsWhoHaveCompletedDiagnostic)
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

  const recommendationStudentRows = students.map(student => (
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

  const postTestStudentRows = students.map(student => (
    <PostTestStudentRow
      key={student.name}
      postTestSelections={postTestSelections}
      previouslyAssignedPostTestStudentIds={previouslyAssignedPostTestStudentIds}
      setPostTestSelections={setPostTestSelections}
      student={student}
      studentsWhoCompletedAssignedRecommendations={studentsWhoCompletedAssignedRecommendations}
    />
  ))

  const tableHasContent = studentsWhoCompletedDiagnostic.length

  const recommendationsTableClassName = tableHasContent ? 'recommendations-table' : 'empty recommendations-table'

  const renderRecommendationsTableHeader = (sticky) => {
    let style = { position: 'inherit' }

    return (
      <thead>
        <tr>
          <th className="corner-header" style={sticky ? style : {}}>Name</th>
          {tableHeaders}
        </tr>
      </thead>
    )
  }

  const renderPostTestTableHeader = (sticky) => {
    const style = sticky ? { position: 'inherit' } : {}

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

  const renderStickyRecommendationsTable = () => {
    // an arbitrary, non-resizing element that is the same width that we need this table to be
    const anchorElement = document.getElementsByClassName('independent-practice-recommendations-buttons')[0]

    if (!(isSticky && tableHasContent && anchorElement)) { return }

    const width = anchorElement.getBoundingClientRect().width + TABLE_RIGHT_PADDING

    return (
      <table
        className={`${recommendationsTableClassName} sticky`}
        style={{ ...stickyTableStyle }}
      >
        {renderRecommendationsTableHeader(true)}
      </table>
    )
  }

  const renderStickyPostTestTable = () => {
    // an arbitrary, non-resizing element that is the same width that we need this table to be
    const widthAnchorElement = document.getElementsByClassName('post-test-assignment-button')[0]

    if (!(isSticky && tableHasContent && widthAnchorElement)) { return }

    const width = widthAnchorElement.getBoundingClientRect().width

    return (
      <table
        className={`${recommendationsTableClassName} sticky`}
        style={{ ...stickyTableStyle, left: stickyTableRightOffset, minWidth: width, width }}
      >
        {renderPostTestTableHeader(true)}
      </table>
    )
  }

  return (
    <div>
      {renderStickyRecommendationsTable()}
      <table className={recommendationsTableClassName} id="demo-onboarding-tour-spotlight-element" ref={recommendationsTableRef} style={tableHasContent ? { paddingLeft: TABLE_LEFT_PADDING } : { marginLeft: paddingLeft() }}>
        {renderRecommendationsTableHeader(false)}
        {tableHasContent ? null : noDataYet}
        <tbody>
          {recommendationStudentRows}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendationsTable
