import * as React from 'react';

import { Activity, ActivityClassification, Topic, } from './interfaces'
import { stringifyLowerLevelTopics, AVERAGE_FONT_WIDTH, } from './shared'

import { imageTagForClassification, } from '../../assignmentFlowConstants'
import NumberSuffixBuilder from '../../../modules/numberSuffixBuilder'
import useWindowSize from '../../../../../Shared/hooks/useWindowSize'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const expandSrc = `${process.env.CDN_URL}/images/shared/expand.svg`
const conceptSrc = `${process.env.CDN_URL}/images/icons/description-concept.svg`
const ccssSrc = `${process.env.CDN_URL}/images/icons/description-ccss.svg`
const gradeSrc = `${process.env.CDN_URL}/images/icons/description-readability.svg`
const informationSrc = `${process.env.CDN_URL}/images/icons/description-information.svg`
const copyrightSrc = `${process.env.CDN_URL}/images/icons/description-copyright.svg`
const topicSrc = `${process.env.CDN_URL}/images/icons/icons-description-topic.svg`
const previewSrc = `${process.env.CDN_URL}/images/icons/preview.svg`
const bookmarkSrc = `${process.env.CDN_URL}/images/icons/icons-bookmark.svg`
const outlinedBookmarkSrc = `${process.env.CDN_URL}/images/icons/icons-bookmark-outline.svg`
const removeSrc = `${process.env.CDN_URL}/images/icons/remove-in-circle.svg`

const IMAGE_WIDTH = 18
const MARGIN = 16

const readabilityCopy = "Quill recommends using activities where the text readability level is the same or lower than the student’s reading level so that the student can focus on building their writing skills."

const readabilityContent = (activity) => (
  <div>
    {activity.minimum_grade_level ? <span>Grade Range: {NumberSuffixBuilder(activity.minimum_grade_level)}-{NumberSuffixBuilder(activity.maximum_grade_level)}<br /></span> : null}
    <span>Text Readability Level: {activity.readability_grade_level}</span>
    <br />
    <br />
    <span>{readabilityCopy}</span>
  </div>
)

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
  savedActivityIds: number[],
  gradeLevelFilters: number[]
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

const ActivityRowConcept = ({ conceptName, }: { conceptName?: string }) => {
  const className = "attribute-section concept"
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

const ActivityRowTopics = ({ topics, maxAllowedLength, onTertiaryLine, inExpandedView, hasConcept, }: { topics?: Topic[], maxAllowedLength: number, onTertiaryLine: boolean, inExpandedView: boolean, hasConcept: boolean, }) => {
  const className = "attribute-section topic"

  if (!(topics && topics.length)) { return <span /> }

  if (inExpandedView && !onTertiaryLine) { return <span /> }

  const topicString = stringifyLowerLevelTopics(topics)
  const widthOfTopicSectionInPixels = (topicString.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH + MARGIN
  const widthExceedsAllottedSpaceOnSecondLine = widthOfTopicSectionInPixels >= maxAllowedLength

  if (inExpandedView && onTertiaryLine) {
    const thirdLevelTopic = topics.find(t => Number(t.level) === 3)
    const secondLevelTopic = topics.find(t => Number(t.level) === 2)
    const diagonalDivider = <span className="diagonal-divider">/</span>
    return (
      <span className="attribute-section extended-topic">
        <span><img alt="Globe icon" src={topicSrc} />{thirdLevelTopic?.name}</span>
        {diagonalDivider}
        <span>{secondLevelTopic?.name}</span>
        {diagonalDivider}
        <span className="lowest-level">{topicString}</span>
      </span>
    )
  } else if ((widthExceedsAllottedSpaceOnSecondLine && onTertiaryLine) || (!widthExceedsAllottedSpaceOnSecondLine && !onTertiaryLine)) {
    return (
      <span className={className}>
        {!onTertiaryLine && hasConcept && <span className="vertical-divider" />}
        <img alt="Globe icon" src={topicSrc} />
        <span>{topicString}</span>
      </span>
    )
  }

  return <span />
}


const ActivityRowGradeRange = ({ minimumGradeLevel, maximumGradeLevel, gradeLevelFilters, }: { minimumGradeLevel?: number, maximumGradeLevel?: number, gradeLevelFilters: number[] }) => {
  const className = "attribute-section grade-range"

  const lowestGradeLevelFilter = gradeLevelFilters[0]
  const highestGradeLevelFilter = gradeLevelFilters[gradeLevelFilters.length - 1]

  const gradeBands = ["4 - 5", "6 - 7", "8 - 9", "10 - 12"].map(gradeBand => {
    let className = "grade-level"

    const splitGradeBand = gradeBand.split(' - ')
    const lowestGradeInGradeBand = Number(splitGradeBand[0])
    const highestGradeInGradeBand = Number(splitGradeBand[1])

    if (lowestGradeLevelFilter && highestGradeLevelFilter && lowestGradeInGradeBand >= lowestGradeLevelFilter && highestGradeInGradeBand <= highestGradeLevelFilter) {
      className += ' filtered'
    }

    if (minimumGradeLevel >= highestGradeInGradeBand) {
      className += ' not-recommended'
    }

    return <span className={className}>{gradeBand}</span>
  })

  return (
    <span className={className}>
      <img alt="Book icon" src={gradeSrc} />
      <span>Grades: {gradeBands}</span>
    </span>
  )
}

const ActivityRowStandardLevel = ({ standardLevelName, }: { standardLevelName?: string }) => {
  const className = "attribute-section standard-level"
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
    <img alt="Book icon" src={gradeSrc} />
    {readabilityContent(activity)}
  </div>)

  const contentPartnersArray = activity.content_partners.map(cp => (
    <React.Fragment>
      <img alt="Copyright icon" src={copyrightSrc} />
      <span>{cp.description}</span>
    </React.Fragment>
  ))

  const contentPartnerLines = contentPartnersArray.length ? (
    <div className="expanded-line" key="content-partners">
      {contentPartnersArray}
    </div>
  ) : null

  return (
    <div className="expanded-section">
      {readabilityLine}
      {descriptionLine}
      {contentPartnerLines}
    </div>
  )
}

const ActivityRowTooltip = ({ activity, showTooltip}: { activity: Activity, showTooltip: boolean }) => {
  if (!showTooltip) { return <span />}

  const descriptionLine = activity.description && (<div className="tooltip-line">
    <img alt="Information icon" src={informationSrc} />
    <span>{activity.description}</span>
  </div>)

  const readabilityLine = activity.readability_grade_level && (<div className="tooltip-line">
    <img alt="Book icon" src={gradeSrc} />
    {readabilityContent(activity)}
  </div>)

  const contentPartnerLines = activity.content_partners && activity.content_partners.map(cp => (
    <div className="tooltip-line" key={cp.id}>
      <img alt="Copyright icon" src={copyrightSrc} />
      <span>{cp.description}</span>
    </div>)
  )

  return (
    <div className="activity-row-tooltip">
      {readabilityLine}
      {descriptionLine}
      {contentPartnerLines}
    </div>
  )
}

const ActivityRow = ({ activity, isSelected, toggleActivitySelection, showCheckbox, showRemoveButton, isFirst, setShowSnackbar, saveActivity, unsaveActivity, savedActivityIds, gradeLevelFilters, }: ActivityRowProps) => {
  const size = useWindowSize();
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)

  function toggleIsExpanded() { setIsExpanded(!isExpanded) }
  function toggleShowTooltip() { setShowTooltip(!showTooltip)}
  function removeActivity() {
    toggleActivitySelection(activity, isSelected)
    setShowSnackbar && setShowSnackbar(true)
  }

  const { activity_classification, name, activity_category_name, standard_level_name, anonymous_path, readability_grade_level, topics, id, minimum_grade_level, maximum_grade_level, description, content_partners, } = activity

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
  const nonToggleButtons = <div className="non-toggle-buttons">{removeOrPreviewButton}{saveOrSavedButton}</div>

  const expandClassName = isExpanded ? 'expanded' : 'not-expanded'
  const isSelectedClassName = isSelected ? 'selected' : 'not-selected'
  const isFirstClassName = isFirst ? 'is-first' : ''

  const noContentForExpandedSection = !readability_grade_level && !description && !content_partners?.length
  const expandedButEmptyClassName = isExpanded && noContentForExpandedSection ? 'no-expanded-content' : ''

  let topicLine

  if (topics && topics.length) {
    topicLine = (
      <div className="third-line">
        <ActivityRowTopics
          hasConcept={!!activity_category_name}
          inExpandedView={isExpanded}
          maxAllowedLength={calculateMaxAllowedLengthForTopicSection({ activity_classification, activity_category_name, readability_grade_level, standard_level_name})}
          onTertiaryLine={true}
          topics={topics}
        />
      </div>
    )
  }

  return (
    <section className={`activity-row ${expandClassName} ${isSelectedClassName} ${isFirstClassName} ${expandedButEmptyClassName}`}>
      <ActivityRowTooltip activity={activity} showTooltip={showTooltip} />
      <div className="first-line">
        <div className="name-and-checkbox-wrapper">
          {showCheckbox && <ActivityRowCheckbox activity={activity} isSelected={isSelected} toggleActivitySelection={toggleActivitySelection} />}
          <button className="interactive-wrapper" onMouseEnter={toggleShowTooltip} onMouseLeave={toggleShowTooltip} tabIndex={-1} type="button"><h2>{imageTagForClassification(activity_classification.key)}<span>{name}</span></h2></button>
        </div>
        <div className="buttons-wrapper">
          {nonToggleButtons}
          {expandButton}
        </div>
      </div>
      <div className="second-line">
        <div className="classification-concept-topic-wrapper">
          <ActivityRowConcept conceptName={activity_category_name} />
          <ActivityRowTopics
            hasConcept={!!activity_category_name}
            inExpandedView={isExpanded}
            maxAllowedLength={calculateMaxAllowedLengthForTopicSection({ activity_classification, activity_category_name, readability_grade_level, standard_level_name})}
            onTertiaryLine={false}
            topics={topics}
          />
        </div>
        <div className="grade-range-and-standard-level-wrapper">
          <ActivityRowStandardLevel standardLevelName={standard_level_name} />
          {standard_level_name && <span className="vertical-divider" />}
          <ActivityRowGradeRange gradeLevelFilters={gradeLevelFilters} maximumGradeLevel={maximum_grade_level} minimumGradeLevel={minimum_grade_level} />
        </div>
      </div>
      <div className="third-line mobile-only">{nonToggleButtons}</div>
      {topicLine}
      <ActivityRowExpandedSection activity={activity} isExpanded={isExpanded} />
    </section>
  )
}

ActivityRow.defaultProps = {
  showCheckbox: true
}

export default ActivityRow
