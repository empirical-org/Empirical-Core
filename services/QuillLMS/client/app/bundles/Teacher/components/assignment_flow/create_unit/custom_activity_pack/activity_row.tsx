import * as React from 'react';

import { Activity, ActivityClassification, } from './interfaces'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const expandSrc = `${process.env.CDN_URL}/images/shared/expand.svg`
const conceptSrc = `${process.env.CDN_URL}/images/icons/description-concept.svg`
const ccssSrc = `${process.env.CDN_URL}/images/icons/description-ccss.svg`
const informationSrc = `${process.env.CDN_URL}/images/icons/description-information.svg`
const previewSrc = `${process.env.CDN_URL}/images/icons/preview.svg`
const connectSrc = `${process.env.CDN_URL}/images/icons/description-connect.svg`
const diagnosticSrc = `${process.env.CDN_URL}/images/icons/description-diagnostic.svg`
const lessonsSrc = `${process.env.CDN_URL}/images/icons/description-lessons.svg`
const proofreaderSrc = `${process.env.CDN_URL}/images/icons/description-proofreader.svg`
const grammarSrc = `${process.env.CDN_URL}/images/icons/description-grammar.svg`

interface ActivityRowCheckboxProps {
  activity: Activity,
  isSelected: boolean,
  toggleActivitySelection: (activity: Activity, isSelected: boolean) => void
}

interface ActivityRowProps {
  activity: Activity,
  isSelected: boolean,
  toggleActivitySelection: (activity: Activity, isSelected: boolean) => void
}

const imageTagForClassification = (classificationKey: string): JSX.Element => {
  let imgAlt = ""
  let imgSrc
  switch(classificationKey) {
    case 'connect':
      imgAlt = "Target representing Quill Connect"
      imgSrc = connectSrc
      break
    case 'diagnostic':
      imgAlt = "Magnifying glass representing Quill Diagnostic"
      imgSrc = diagnosticSrc
      break
    case 'grammar':
      imgAlt = "Puzzle piece representing Quill Grammar"
      imgSrc = grammarSrc
      break
    case 'lessons':
      imgAlt = "Apple representing Quill Lessons"
      imgSrc = lessonsSrc
      break
    case 'proofreader':
      imgAlt = "Flag representing Quill Proofreader"
      imgSrc = proofreaderSrc
      break
  }

  return <img alt={imgAlt} src={imgSrc} />
}

const ActivityRowCheckbox = ({ activity, isSelected, toggleActivitySelection, }: ActivityRowCheckboxProps) => {
  const handleCheckboxClick = () => toggleActivitySelection(activity, isSelected)
  if (isSelected) {
    return <button className="quill-checkbox focus-on-light selected" onClick={handleCheckboxClick} type="button"><img alt="check" src={smallWhiteCheckSrc} /></button>
  }

  return <button aria-label="unchecked checkbox" className="quill-checkbox focus-on-light unselected" onClick={handleCheckboxClick} type="button" />
}

const ActivityRowClassification = ({ classification, }: { classification?: ActivityClassification }) => {
  const className = "second-line-section classification"
  if (classification) {
    return (<span className={className}>
      {imageTagForClassification(classification.key)}
      <span>{classification.alias}</span>
    </span>)
  }

  return <span className={className} />
}

const ActivityRowConcept = ({ conceptName, }: { conceptName?: string }) => {
  const className = "second-line-section concept"
  if (conceptName) {
    return (<span className={className}>
      <img alt="Pencil writing icon" src={conceptSrc} />
      <span>{conceptName}</span>
    </span>)
  }

  return <span className={className} />
}

const ActivityRowStandardLevel = ({ standardLevelName, }: { standardLevelName?: string }) => {
  const className = "second-line-section standard-level"
  if (standardLevelName) {
    return (<span className={className}>
      <img alt="Common Core State Standards icon" src={ccssSrc} />
      <span>CCSS: {standardLevelName}</span>
    </span>)
  }

  return <span className={className} />
}

const ActivityRowExpandedSection = ({ activity, isExpanded}: { activity: Activity, isExpanded: boolean }) => {
  if (!isExpanded) { return <span />}

  return (<div className="third-line">
    <img alt="Information icon" src={informationSrc} />
    <span>{activity.description}</span>
  </div>)
}

const ActivityRow = ({ activity, isSelected, toggleActivitySelection, }: ActivityRowProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  function toggleIsExpanded() { setIsExpanded(!isExpanded) }

  const expandImgAltText = `Arrow pointing ${isExpanded ? 'up' : 'down'}`

  const { activity_classification, name, activity_category_name, standard_level_name, anonymous_path, } = activity

  const previewButton = <a className="interactive-wrapper focus-on-light preview-link" href={anonymous_path} rel="noopener noreferrer" target="_blank"><img alt="Preview eye icon" src={previewSrc} />Preview</a>
  const expandButton = <button className="interactive-wrapper focus-on-light expand-button" onClick={toggleIsExpanded} type="button"><img alt={expandImgAltText} src={expandSrc} /></button>

  const expandClassName = isExpanded ? 'expanded' : 'not-expanded'

  return (<section className={`activity-row ${expandClassName}`}>
    <div className="first-line">
      <div className="name-and-checkbox-wrapper">
        <ActivityRowCheckbox activity={activity} isSelected={isSelected} toggleActivitySelection={toggleActivitySelection} />
        <h2>{name}</h2>
      </div>
      <div className="buttons-wrapper">
        {previewButton}
        {expandButton}
      </div>
    </div>
    <div className="second-line">
      <div className="classification-concept-topic-wrapper">
        <ActivityRowClassification classification={activity_classification} />
        <ActivityRowConcept conceptName={activity_category_name} />
        <span className="second-line-section topic" />
      </div>
      <div className="readability-and-standard-level-wrapper">
        <span className="second-line-section readability" />
        <ActivityRowStandardLevel standardLevelName={standard_level_name} />
      </div>
    </div>
    <ActivityRowExpandedSection activity={activity} isExpanded={isExpanded} />
  </section>)
}

export default ActivityRow
