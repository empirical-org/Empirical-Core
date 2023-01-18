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

import {
  helpIcon,
  Tooltip,
  smallWhiteCheckIcon,
} from '../../../../../Shared/index'
import useWindowSize from '../../../../../Shared/hooks/useWindowSize'

const openInNewTabIcon = <img alt="Open in new tab icon" src={`${baseDiagnosticImageSrc}/icons-open-in-new.svg`} />
const ellipsesIcon = <img alt="Open menu icon" src={`${baseDiagnosticImageSrc}/ellipses_icon.svg`} />

interface RecommendationsTableProps {
  recommendations: Recommendation[];
  responsesLink: (studentId: number) => string;
  previouslyAssignedRecommendations: Recommendation[];
  students: Student[];
  selections: Recommendation[];
  setSelections: (selections: Recommendation[]) => void;
}

interface RecommendationCellProps {
  student: Student;
  isAssigned: boolean;
  isRecommended: boolean;
  isSelected: boolean;
  setSelections: (selections: Recommendation[]) => void;
  selections: Recommendation[];
  selectionIndex: number;
}

interface StickyTableStyle {
  position: string,
  top: number,
  left: number,
  right: number,
  zIndex: number,
  minWidth: string
}

const RecommendationCell = ({ student, isAssigned, isRecommended, isSelected, setSelections, selections, selectionIndex, }: RecommendationCellProps) => {
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
  const assigned = isAssigned && <div className="assigned">{correctImage}<span>Assigned</span></div>
  if (isSelected) {
    checkbox = (<span aria-label="Checked checkbox" className="quill-checkbox selected" >
      <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
    </span>)
  }
  return (
    <td className="recommendation-cell">
      <button className={`interactive-wrapper ${isRecommended && isSelected && !isAssigned ? 'recommended-and-selected' : ''}`} onClick={isAssigned ? () => {} : toggleSelection} type="button">
        {isRecommended ? recommendedGlyph : <span />}
        {assigned || checkbox}
        <span />
      </button>
    </td>
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
      const isAssigned = previouslyAssignedRecommendations.find(r => r.activity_pack_id === selection.activity_pack_id).students.includes(id)
      const isRecommended = recommendations.find(r => r.activity_pack_id === selection.activity_pack_id).students.includes(id)
      const isSelected = selection.students.includes(id)
      return (
        <RecommendationCell
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

const RecommendationsTable = ({ recommendations, responsesLink, students, selections, previouslyAssignedRecommendations, setSelections, }: RecommendationsTableProps) => {
  const size = useWindowSize();

  const [isSticky, setIsSticky] = React.useState(false);
  const tableRef = React.useRef(null);
  const [stickyTableStyle, setStickyTableStyle] = React.useState<StickyTableStyle>({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3
  })

  function paddingLeft() {
    if (MOBILE_WIDTH >= window.innerWidth) { return DEFAULT_LEFT_PADDING_FOR_MOBILE }
    const explanation = document.getElementsByClassName('explanation')[0]
    return explanation && DEFAULT_LEFT_PADDING
  }

  const handleScroll = React.useCallback(({ top, bottom, left, right, }) => {
    if (top <= 0 && bottom > 92) {
      setStickyTableStyle(oldStickyTableStyle => ({ ...oldStickyTableStyle, left: left + paddingLeft() }))
      !isSticky && setIsSticky(true);
    } else {
      isSticky && setIsSticky(false);
    }
  }, [isSticky]);

  const onScroll = () => {
    if (tableRef && tableRef.current) {
      handleScroll(tableRef.current.getBoundingClientRect());
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

  const tableHeaders = recommendations && recommendations.map(recommendation => {
    const { activity_pack_id, name, activity_count, } = recommendation

    function handleSelectAllClick() {
      onSelectAllColumnClick(activity_pack_id)
    }

    return (
      <th className="recommendation-header" key={name}>
        <div className="name-and-tooltip">
          <span>{name}</span>
          <a aria-label="Preview the activity pack" href={`/activities/packs/${activity_pack_id}`} rel="noopener noreferrer" target="_blank"><img alt="" src={helpIcon.src} /></a>
        </div>
        <div className="activity-count-and-select-all">
          <span className="activity-count">{activity_count} activities</span>
          <Tooltip
            tooltipText="Select all column"
            tooltipTriggerText={<button aria-label="Select all column" className="interactive-wrapper" onClick={handleSelectAllClick} type="button">{ellipsesIcon}</button>}
          />
        </div>
      </th>
    )
  })

  const studentRows = students.map(student => (
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

  const completedStudentResults = students.filter(sr => sr.completed)
  const tableHasContent = completedStudentResults.length

  const tableClassName = tableHasContent ? 'recommendations-table' : 'empty recommendations-table'

  const renderHeader = (sticky) => {
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

  const renderStickyTable = () => {
    // an arbitrary, non-resizing element that is the same width that we need this table to be
    const anchorElement = document.getElementsByClassName('independent-practice')[0]

    if (!(isSticky && tableHasContent && anchorElement)) { return }

    // table doesn't get padding so we have to remove that from the width we're using
    const width = anchorElement.getBoundingClientRect().width - paddingLeft()

    return (
      <table
        className={`${tableClassName} sticky`}
        style={{ ...stickyTableStyle, minWidth: width, width }}
      >
        {renderHeader(true)}
      </table>
    )
  }

  return (
    <div className="recommendations-table-container" onScroll={handleScroll}>
      {renderStickyTable()}
      <table className={tableClassName} id="demo-onboarding-tour-spotlight-element" ref={tableRef} style={tableHasContent ? { paddingLeft: paddingLeft() } : { marginLeft: paddingLeft() }}>
        {renderHeader(false)}
        {tableHasContent ? null : noDataYet}
        <tbody>
          {studentRows}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendationsTable
