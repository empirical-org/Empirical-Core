import * as React from 'react'

import {
  correctImage,
  baseDiagnosticImageSrc,
} from './shared'

import {
  helpIcon,
  Tooltip,
  smallWhiteCheckIcon,
} from '../../../../../Shared/index'
import useWindowSize from '../../../../../Shared/hooks/useWindowSize'

interface StickyTableStyle {
  position: string,
  top: number,
  left: number,
  right: number,
  zIndex: number,
}

const ellipsesIcon = <img alt="Open menu icon" src={`${baseDiagnosticImageSrc}/ellipses_icon.svg`} />

const PostTestAssignmentTable = ({showPostTestAssignmentColumn, students, studentsWhoCompletedDiagnostic, postTestSelections, setPostTestSelections, previouslyAssignedPostTestStudentIds, studentsWhoCompletedAssignedRecommendations, postDiagnosticUnitTemplateId, }) => {

  const size = useWindowSize();
  const [isSticky, setIsSticky] = React.useState(false);
  const [stickyTableStyle, setStickyTableStyle] = React.useState<StickyTableStyle>({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5
  })
  const [stickyTableRightOffset, setStickyTableRightOffset] = React.useState(0)
  const recommendationsTableRef = React.useRef(null);
  const handleScroll = React.useCallback(({ top, bottom, left, right, }) => {
    if (top <= 0 && bottom > 92) {
      setStickyTableStyle(oldStickyTableStyle => ({ ...oldStickyTableStyle, left: left }))
      setStickyTableRightOffset(782)
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

  function onSelectAllForPostDiagnosticClick() {
    const studentIdsWhoHaveCompletedDiagnostic = students.filter(s => s.completed).map(s => s.id)
    setPostTestSelections(studentIdsWhoHaveCompletedDiagnostic)
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

  return (
    <div>
      {showPostTestAssignmentColumn ?
        <div className="post-test-table-wrapper">
          <table className={recommendationsTableClassName} id="demo-onboarding-tour-spotlight-element" ref={recommendationsTableRef} >
            {renderPostTestTableHeader(false)}
            <tbody>
              {postTestStudentRows}
            </tbody>
          </table>s
        </div> : null}
    </div>
  )
}

export default PostTestAssignmentTable
