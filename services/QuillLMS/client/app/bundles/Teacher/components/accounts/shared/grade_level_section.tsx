import * as React from 'react';

import { DropdownInput } from '../../../../Shared/index';

const KINDERGARTEN = 'K'
const defaultGradeLevelOptions = [KINDERGARTEN, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const formatDropdownOptions = (options) => options.map(opt => ({ value: opt, label: opt, }))

const GradeLevelSection = ({ setMinimumGradeLevel, minimumGradeLevel, setMaximumGradeLevel, maximumGradeLevel, }) => {
  const minimumGradeLevelOptions = maximumGradeLevel ? defaultGradeLevelOptions.filter(gradeLevel => gradeLevel <= maximumGradeLevel.value || gradeLevel === KINDERGARTEN) : defaultGradeLevelOptions
  const maximumGradeLevelOptions = minimumGradeLevel && minimumGradeLevel.value !== KINDERGARTEN ? defaultGradeLevelOptions.filter(gradeLevel => gradeLevel >= minimumGradeLevel.value) : defaultGradeLevelOptions

  return (
    <React.Fragment>
      <div className="grade-dropdowns-wrapper">
        <DropdownInput
          handleChange={setMinimumGradeLevel}
          label="Lowest grade level"
          options={formatDropdownOptions(minimumGradeLevelOptions)}
          value={minimumGradeLevel}
        />
        <DropdownInput
          handleChange={setMaximumGradeLevel}
          label="Highest grade level"
          options={formatDropdownOptions(maximumGradeLevelOptions)}
          value={maximumGradeLevel}
        />
      </div>
      {minimumGradeLevel && minimumGradeLevel.value < 4 && <p className="grade-level-explanation">Note: Quill requires students to type out sentences, so we generally recommend using Quill at 4th grade. For younger students, we recommend using Quill only if students have some basic typing experience (typing at more than 15 words per minute).</p>}
    </React.Fragment>
  )
}

export default GradeLevelSection
