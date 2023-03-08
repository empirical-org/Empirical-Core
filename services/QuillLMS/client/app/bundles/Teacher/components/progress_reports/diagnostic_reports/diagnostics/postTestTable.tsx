import * as React from 'react'

import {
  correctImage,
} from './shared'
import ActivityPackHeader from './activityPackHeader'

import {
  smallWhiteCheckIcon,
} from '../../../../../Shared/index'

const PostTestAssignmentTable = ({showPostTestAssignmentColumn, students, studentsWhoCompletedDiagnostic, postTestSelections, setPostTestSelections, previouslyAssignedPostTestStudentIds, studentsWhoCompletedAssignedRecommendations, postDiagnosticUnitTemplateId, }) => {

  const recommendationsTableRef = React.useRef(null);
  const tableHasContent = studentsWhoCompletedDiagnostic.length
  const recommendationsTableClassName = tableHasContent ? 'recommendations-table' : 'empty recommendations-table'

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

  function onSelectAllForPostDiagnosticClick() {
    const studentIdsWhoHaveCompletedDiagnostic = students.filter(s => s.completed).map(s => s.id)
    setPostTestSelections(studentIdsWhoHaveCompletedDiagnostic)
  }

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

  return (
    <div>
      {showPostTestAssignmentColumn ?
        <div className="post-test-table-wrapper">
          <table className={recommendationsTableClassName} id="demo-onboarding-tour-spotlight-element" ref={recommendationsTableRef} >
            {renderPostTestTableHeader}
            <tbody>
              {postTestStudentRows}
            </tbody>
          </table>
        </div> : null}
    </div>
  )
}

export default PostTestAssignmentTable
