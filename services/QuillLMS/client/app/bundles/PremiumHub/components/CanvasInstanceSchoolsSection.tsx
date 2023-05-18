import * as React from 'react';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const CanvasInstanceSchoolRow = ({ school, setSelectedSchoolIds, selectedSchoolIds, }) => {
  function handleClickCheckbox() {
    if (selectedSchoolIds.includes(school.id)) {
      setSelectedSchoolIds(selectedSchoolIds.filter(id => id !== school.id))
    } else {
      setSelectedSchoolIds(selectedSchoolIds.concat(school.id))
    }
  }

  const checkbox = selectedSchoolIds.includes(school.id) ? (
    <button
      aria-label="Checked checkbox"
      className="quill-checkbox selected"
      onClick={handleClickCheckbox}
      type="button"
    >
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>
  ) : (
    <button
      aria-label="Unchecked checkbox"
      className="quill-checkbox unselected"
      onClick={handleClickCheckbox}
      type="button"
    />
  )

  return (
    <div className="school-row" key={school.id}>
      {checkbox}
      <span>{school.name}</span>
    </div>
  )
}

const CanvasInstanceSchoolsSection = ({ schools, selectedSchoolIds, setSelectedSchoolIds }) => {
  return schools.map((school: object) =>
    (
      <CanvasInstanceSchoolRow
        school={school}
        selectedSchoolIds={selectedSchoolIds}
        setSelectedSchoolIds={setSelectedSchoolIds}
      />
    )
  )
}

export default CanvasInstanceSchoolsSection
