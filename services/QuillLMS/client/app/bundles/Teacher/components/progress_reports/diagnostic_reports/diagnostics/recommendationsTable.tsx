import * as React from 'react'
import { Link, } from 'react-router-dom'

import SkillGroupTooltip from './skillGroupTooltip'
import {
  noDataYet,
  asteriskIcon,
  correctImage,
} from './shared'
import {
  SkillGroupSummary,
  OpenPopover,
  StudentResult,
  SkillGroup,
  Recommendation,
  LessonRecommendation,
  LessonsActivity,
  Student,
} from './interfaces'

import {
  helpIcon,
  Tooltip,
  smallWhiteCheckIcon,
} from '../../../../../Shared/index'

interface RecommendationsTableProps {
  recommendations: Recommendation[];
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
  return (<td className="recommendation-cell">
    <button className={`interactive-wrapper ${isRecommended && isSelected && !isAssigned ? 'recommended-and-selected' : ''}`} onClick={isAssigned ? () => {} : toggleSelection} type="button">
      {isRecommended ? asteriskIcon : <span />}
      {assigned || checkbox}
      <span />
    </button>
  </td>)
}

const StudentRow = ({ student, selections, recommendations, previouslyAssignedRecommendations, setSelections, }) => {
  const { name, completed, id, } = student
  const diagnosticNotCompletedMessage = completed ? null : <span className="diagnostic-not-completed">Diagnostic not completed</span>
  const firstCell = (<th className="name-cell">
    <div>
      <span>{name}</span>
      {diagnosticNotCompletedMessage}
    </div>
  </th>)

  let selectionCells = selections.map((selection: Recommendation) => (<td key={selection.name} />))
  if (completed) {
    selectionCells = selections.map((selection: Recommendation, i: number) => {
      const isAssigned = previouslyAssignedRecommendations.find(r => r.activity_pack_id === selection.activity_pack_id).students.includes(id)
      const isRecommended = recommendations.find(r => r.activity_pack_id === selection.activity_pack_id).students.includes(id)
      const isSelected = selection.students.includes(id)
      return (<RecommendationCell
        isAssigned={isAssigned}
        isRecommended={isRecommended}
        isSelected={isSelected}
        key={`${id}-${selection.activity_pack_id}`}
        selectionIndex={i}
        selections={selections}
        setSelections={setSelections}
        student={student}
      />)
    })
  }
  return <tr key={name}>{firstCell}{selectionCells}</tr>
}

const RecommendationsTable = ({ recommendations, students, selections, previouslyAssignedRecommendations, setSelections, }: RecommendationsTableProps) => {
  const [isSticky, setIsSticky] = React.useState(false);
  const tableRef = React.useRef(null);
  const [stickyTableStyle, setStickyTableStyle] = React.useState({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3
  })

  const handleScroll = React.useCallback(({ top, bottom, left, right, }) => {
    if (top <= 0 && bottom > 92) {
      setStickyTableStyle(oldStickyTableStyle => ({ ...oldStickyTableStyle, left }))
      !isSticky && setIsSticky(true);
    } else {
      isSticky && setIsSticky(false);
    }
  }, [isSticky]);

  const onScroll = () => handleScroll(tableRef.current.getBoundingClientRect());

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

  const tableHeaders = recommendations.map(recommendation => {
    const { activity_pack_id, name, activity_count, students, } = recommendation
    return (<th className="recommendation-header" key={name}>
      <div className="name-and-tooltip">
        <span>{name}</span>
        <Tooltip
          tooltipText={`<a href='/activities/packs/${activity_pack_id}' target="_blank">Preview the activity pack</a>`}
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />
      </div>
      <span className="activity-count">{activity_count} activities</span>
    </th>)
  })

  const studentRows = students.map(student => (
    <StudentRow
      key={student.name}
      previouslyAssignedRecommendations={previouslyAssignedRecommendations}
      recommendations={recommendations}
      selections={selections}
      setSelections={setSelections}
      student={student}
    />)
  )

  const completedStudentResults = students.filter(sr => sr.completed)
  const tableHasContent = completedStudentResults.length

  const tableClassName = tableHasContent ? 'recommendations-table' : 'empty recommendations-table'

  const renderHeader = () => {
    return (<thead>
      <tr>
        <th className="corner-header">Name</th>
        {tableHeaders}
      </tr>
    </thead>)
  }

  return (<div className="recommendations-table-container" onScroll={handleScroll}>
    {tableHasContent ? null : noDataYet}
    {isSticky && (
      <table
        className={`${tableClassName} sticky`}
        style={stickyTableStyle}
      >
        {renderHeader()}
      </table>
    )}
    <table className={tableClassName} ref={tableRef}>
      {renderHeader()}
      <tbody>
        {studentRows}
      </tbody>
    </table>
  </div>)
}

export default RecommendationsTable
