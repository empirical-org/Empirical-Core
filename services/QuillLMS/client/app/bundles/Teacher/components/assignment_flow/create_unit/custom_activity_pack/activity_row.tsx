import * as React from 'react';

import { Activity, ActivityClassification, Topic, } from './interfaces'
import { stringifyLowerLevelTopics, AVERAGE_FONT_WIDTH, } from './shared'

import { imageTagForClassification, } from '../../assignmentFlowConstants'
import { Tooltip } from '../../../../../Shared/index'
import useWindowSize from '../../../../../Shared/hooks/useWindowSize'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const expandSrc = `${process.env.CDN_URL}/images/shared/expand.svg`
const conceptSrc = `${process.env.CDN_URL}/images/icons/description-concept.svg`
const ccssSrc = `${process.env.CDN_URL}/images/icons/description-ccss.svg`
const readabilitySrc = `${process.env.CDN_URL}/images/icons/description-readability.svg`
const informationSrc = `${process.env.CDN_URL}/images/icons/description-information.svg`
const copyrightSrc = `${process.env.CDN_URL}/images/icons/description-copyright.svg`
const topicSrc = `${process.env.CDN_URL}/images/icons/icons-description-topic.svg`
const previewSrc = `${process.env.CDN_URL}/images/icons/preview.svg`
const bookmarkSrc = `${process.env.CDN_URL}/images/icons/icons-bookmark.svg`
const outlinedBookmarkSrc = `${process.env.CDN_URL}/images/icons/icons-bookmark-outline.svg`
const removeSrc = `${process.env.CDN_URL}/images/icons/remove-in-circle.svg`

const IMAGE_WIDTH = 18
const MARGIN = 16
const ELLIPSES_LENGTH = 3

const readabilityCopy = "Since Quill activities focus on building writing skills, using a text with a lower readability level is sometimes beneficial as it enables students to practice the writing skill."

interface ActivityRowCheckboxProps {
  activity: Activity,
  isSelected: boolean,
  toggleActivitySelection: (activity: Activity, isSelected: boolean) => void
}

interface ActivityRowProps {
  activity: Activity,
  isSelected: boolean,
  isFirst: boolean,
  toggleActivitySelection: (activity: Activity, isSelected: boolean) => void,
  showCheckbox?: boolean,
  showRemoveButton?: boolean,
  setShowSnackbar?: (show: boolean) => void,
  saveActivity: (activityId: number) => void,
  unsaveActivity: (activityId: number) => void,
  savedActivityIds: number[]
}

// the following method is a pretty hacky solution for helping to determine whether or not to show a truncated string and tooltip or the whole topic string in the <TopicSection />
// we can't rely on pure CSS for this because the max width is so dependent on the presence and length of other elements in the row
const calculateMaxAllowedLengthForTopicSection = ({
  activity_classification,
  activity_category_name,
  readability_grade_level,
  standard_level_name
}): number => {
  let maxAllowedLength = 0
  const container = document.getElementsByClassName('activity-table-container')[0]
  if (container) {
    maxAllowedLength = container.offsetWidth - 152 // 128 is the amount of padding in total that makes up the difference between the width of the container and the width of the second line
    maxAllowedLength -= activity_classification && activity_classification.alias ? (activity_classification.alias.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH + MARGIN : 0
    maxAllowedLength -= activity_category_name ? (activity_category_name.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH + MARGIN : 0
    maxAllowedLength -= readability_grade_level ? (`Readability: Grades ${readability_grade_level}`.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH : 0 // the readability section is the only section that does not have a margin
    maxAllowedLength -= standard_level_name ? (standard_level_name.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH + MARGIN : 0
  }
  return maxAllowedLength
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
    return (
      <span className={className}>
        {imageTagForClassification(classification.key)}
        <span>{classification.alias}</span>
      </span>
    )
  }

  return <span className={className} />
}

const ActivityRowConcept = ({ conceptName, }: { conceptName?: string }) => {
  const className = "second-line-section concept"
  if (conceptName) {
    return (
      <span className={className}>
        <img alt="Pencil writing icon" src={conceptSrc} />
        <span>{conceptName}</span>
      </span>
    )
  }

  return <span className={className} />
}

const ActivityRowTopics = ({ topics, maxAllowedLength, }: { topics?: Topic[], maxAllowedLength: number }) => {
  const className = "second-line-section topic"
  if (topics && topics.length && maxAllowedLength >= (IMAGE_WIDTH + MARGIN + ELLIPSES_LENGTH)) {
    const topicString = stringifyLowerLevelTopics(topics)
    let topicElement = <span>{topicString}</span>
    const widthOfTopicSectionInPixels = (topicString.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH + MARGIN
    if (widthOfTopicSectionInPixels >= maxAllowedLength) {
      const abbreviatedTopicStringLength = ((maxAllowedLength - IMAGE_WIDTH - MARGIN) / AVERAGE_FONT_WIDTH) - ELLIPSES_LENGTH
      const abbreviatedTopicString = `${topicString.substring(0, abbreviatedTopicStringLength)}...`
      topicElement = (<Tooltip
        tooltipText={topicString}
        tooltipTriggerText={abbreviatedTopicString}
      />)
    }

    return (
      <span className={className}>
        <img alt="Globe icon" src={topicSrc} />
        {topicElement}
      </span>
    )
  }

  return <span className={className} />
}


const ActivityRowReadabilityGradeLevel = ({ readabilityGradeLevel, }: { readabilityGradeLevel?: string }) => {
  const className = "second-line-section readability-level"
  if (readabilityGradeLevel) {
    return (
      <span className={className}>
        <img alt="Book icon" src={readabilitySrc} />
        <span>Readability: Grades {readabilityGradeLevel}</span>
      </span>
    )
  }

  return <span className={className} />
}

const ActivityRowStandardLevel = ({ standardLevelName, }: { standardLevelName?: string }) => {
  const className = "second-line-section standard-level"
  if (standardLevelName) {
    return (
      <span className={className}>
        <img alt="Common Core State Standards icon" src={ccssSrc} />
        <span>{standardLevelName}</span>
      </span>
    )
  }

  return <span />
}

const ActivityRowExpandedSection = ({ activity, isExpanded}: { activity: Activity, isExpanded: boolean }) => {
  if (!isExpanded) { return <span />}

  const descriptionLine = activity.description && (<div className="expanded-line">
    <img alt="Information icon" src={informationSrc} />
    <span>{activity.description}</span>
  </div>)

  const readabilityLine = activity.readability_grade_level && (<div className="expanded-line">
    <img alt="Book icon" src={readabilitySrc} />
    <span>{readabilityCopy}</span>
  </div>)

  const contentPartnerLines = activity.content_partners && activity.content_partners.map(cp => (
    <div className="expanded-line" key={cp.id}>
      <img alt="Copyright icon" src={copyrightSrc} />
      <span>{cp.description}</span>
    </div>)
  )

  return (
    <React.Fragment>
      {descriptionLine}
      {readabilityLine}
      {contentPartnerLines}
    </React.Fragment>
  )
}

const ActivityRowTooltip = ({ activity, showTooltip}: { activity: Activity, showTooltip: boolean }) => {
  if (!showTooltip) { return <span />}

  const descriptionLine = activity.description && (<div className="tooltip-line">
    <img alt="Information icon" src={informationSrc} />
    <span>{activity.description}</span>
  </div>)

  const readabilityLine = activity.readability_grade_level && (<div className="tooltip-line">
    <img alt="Book icon" src={readabilitySrc} />
    <span>{readabilityCopy}</span>
  </div>)

  const contentPartnerLines = activity.content_partners && activity.content_partners.map(cp => (
    <div className="tooltip-line" key={cp.id}>
      <img alt="Copyright icon" src={copyrightSrc} />
      <span>{cp.description}</span>
    </div>)
  )

  return (
    <div className="activity-row-tooltip">
      {descriptionLine}
      {readabilityLine}
      {contentPartnerLines}
    </div>
  )
}

const ActivityRow = ({ activity, isSelected, toggleActivitySelection, showCheckbox, showRemoveButton, isFirst, setShowSnackbar, saveActivity, unsaveActivity, savedActivityIds, }: ActivityRowProps) => {
  const size = useWindowSize();
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)

  function toggleIsExpanded() { setIsExpanded(!isExpanded) }
  function toggleShowTooltip() { setShowTooltip(!showTooltip)}
  function removeActivity() {
    toggleActivitySelection(activity, isSelected)
    setShowSnackbar && setShowSnackbar(true)
  }

  const { activity_classification, name, activity_category_name, standard_level_name, anonymous_path, readability_grade_level, topics, id, } = activity

  function handleClickSaveButton() { saveActivity(id) }
  function handleClickSavedButton() { unsaveActivity(id) }

  const expandImgAltText = `Arrow pointing ${isExpanded ? 'up' : 'down'}`

  const saveButton = <button className="interactive-wrapper focus-on-light save-button" onClick={handleClickSaveButton} type="button"><img alt={expandImgAltText} src={outlinedBookmarkSrc} />Save</button>
  const savedButton = <button className="interactive-wrapper focus-on-light saved-button" onClick={handleClickSavedButton} type="button"><img alt={expandImgAltText} src={bookmarkSrc} />Saved</button>
  const previewButton = <a className="interactive-wrapper focus-on-light preview-link" href={anonymous_path} rel="noopener noreferrer" target="_blank"><img alt="Preview eye icon" src={previewSrc} />Preview</a>
  const expandButton = <button className="interactive-wrapper focus-on-light expand-button" onClick={toggleIsExpanded} type="button"><img alt={expandImgAltText} src={expandSrc} /></button>
  const removeButton = <button className="interactive-wrapper focus-on-light remove-button" onClick={removeActivity} type="button"><img alt="Remove icon" src={removeSrc} />Remove</button>
  const removeOrPreviewButton = showRemoveButton ? removeButton : previewButton
  const saveOrSavedButton = savedActivityIds && savedActivityIds.includes(id) ? savedButton : saveButton

  const expandClassName = isExpanded ? 'expanded' : 'not-expanded'
  const isSelectedClassName = isSelected ? 'selected' : 'not-selected'
  const isFirstClassName = isFirst ? 'is-first' : ''

  const mobileOnly = showRemoveButton ? <div className="mobile-only">{removeButton}</div> : null

  return (
    <section className={`activity-row ${expandClassName} ${isSelectedClassName} ${isFirstClassName}`}>
      <ActivityRowTooltip activity={activity} showTooltip={showTooltip} />
      <div className="first-line">
        <div className="name-and-checkbox-wrapper">
          {showCheckbox && <ActivityRowCheckbox activity={activity} isSelected={isSelected} toggleActivitySelection={toggleActivitySelection} />}
          <button className="interactive-wrapper" onMouseEnter={toggleShowTooltip} onMouseLeave={toggleShowTooltip} tabIndex={-1} type="button"><h2>{name}</h2></button>
        </div>
        <div className="buttons-wrapper">
          {removeOrPreviewButton}
          {saveOrSavedButton}
          {expandButton}
        </div>
      </div>
      <div className="second-line">
        <div className="classification-concept-topic-wrapper">
          <ActivityRowClassification classification={activity_classification} />
          <ActivityRowConcept conceptName={activity_category_name} />
          <ActivityRowTopics
            maxAllowedLength={calculateMaxAllowedLengthForTopicSection({ activity_classification, activity_category_name, readability_grade_level, standard_level_name})}
            topics={topics}
          />
        </div>
        <div className="readability-and-standard-level-wrapper">
          <ActivityRowReadabilityGradeLevel readabilityGradeLevel={readability_grade_level} />
          <ActivityRowStandardLevel standardLevelName={standard_level_name} />
        </div>
      </div>
      <ActivityRowExpandedSection activity={activity} isExpanded={isExpanded} />
      {mobileOnly}
    </section>
  )
}

ActivityRow.defaultProps = {
  showCheckbox: true
}

export default ActivityRow
