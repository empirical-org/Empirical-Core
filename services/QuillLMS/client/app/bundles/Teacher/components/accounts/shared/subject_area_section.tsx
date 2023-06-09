import * as React from 'react';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const SubjectAreaRow = ({ setSelectedSubjectAreaIds, subjectArea, selectedSubjectAreaIds, }) => {
  function handleClickCheckbox() {
    if (selectedSubjectAreaIds.includes(subjectArea.id)) {
      setSelectedSubjectAreaIds(selectedSubjectAreaIds.filter(id => id !== subjectArea.id))
    } else {
      setSelectedSubjectAreaIds(selectedSubjectAreaIds.concat(subjectArea.id))
    }
  }

  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={handleClickCheckbox} type="button" />
  if (selectedSubjectAreaIds.includes(subjectArea.id)) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={handleClickCheckbox} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="subject-area-row">
      {checkbox}
      <span>{subjectArea.name}</span>
    </div>
  )
}

const SubjectAreaSection = ({ subjectAreas, setSelectedSubjectAreaIds, selectedSubjectAreaIds, }) => {
  return subjectAreas.map(sa =>
    (
      <SubjectAreaRow
        key={sa.id}
        selectedSubjectAreaIds={selectedSubjectAreaIds}
        setSelectedSubjectAreaIds={setSelectedSubjectAreaIds}
        subjectArea={sa}
      />
    )
  )
}

export default SubjectAreaSection
