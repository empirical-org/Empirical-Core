import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { Activity, Topic } from './interfaces';
import { AVERAGE_FONT_WIDTH, stringifyLowerLevelTopics } from './shared';

import useWindowSize from '../../../../../Shared/hooks/useWindowSize';
import { Tooltip } from '../../../../../Shared/index';
import NumberSuffixBuilder from '../../../modules/numberSuffixBuilder';
import { imageTagForClassification } from '../../assignmentFlowConstants';

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`
const expandSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/expand.svg`
const conceptSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/description-concept.svg`
const ccssSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/description-ccss.svg`
const gradeSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/description-readability.svg`
const informationSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/description-information.svg`
const copyrightSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/description-copyright.svg`
const topicSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-description-topic.svg`
const previewSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/preview.svg`
const bookmarkSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-bookmark.svg`
const outlinedBookmarkSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-bookmark-outline.svg`
const removeSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/remove-in-circle.svg`

const IMAGE_WIDTH = 18
const MARGIN = 16

const readabilityCopy = "Quill recommends using activities where the text readability level is the same or lower than the student’s reading level so that the student can focus on building their writing skills."

const readabilityContent = (activity) => (
  <div>
    {activity.minimum_grade_level ? (<span className="grade-range-and-label">
      <span className="grade-range">{NumberSuffixBuilder(activity.minimum_grade_level)}-{NumberSuffixBuilder(activity.maximum_grade_level)}</span>
      <span className="grade-range-label">Grade Range</span>
      <br />
    </span>) : null}
    <span className="grade-range-and-label">
      <span className="grade-range">{activity.readability_grade_level}</span>
      <span className="grade-range-label">Text Readability Level</span>
    </span>
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
  gradeLevelFilters: number[],
  allTopics: Topic[]
}

// the following method is a pretty hacky solution for helping to determine whether or not to show a truncated string and tooltip or the whole topic string in the <TopicSection />
// we can't rely on pure CSS for this because the max width is so dependent on the presence and length of other elements in the row
const calculateMaxAllowedLengthForTopicSection = ({
  activity_classification,
}): number => {
  let maxAllowedLength = 0
  const container = document.getElementsByClassName('activity-table-container')[0]
  if (container) {
    maxAllowedLength = container.offsetWidth - 128 // 128 is the amount of padding in total that makes up the difference between the width of the container and the width of the second line
    maxAllowedLength -= activity_classification && activity_classification.alias ? (activity_classification.alias.length * AVERAGE_FONT_WIDTH) + IMAGE_WIDTH + MARGIN : 0
    maxAllowedLength -= 374 // 374 is the standardized width for the ccss grade + grade levels
  }
  return maxAllowedLength
}

const ActivityRowCheckbox = ({ activity, isSelected, toggleActivitySelection, }: ActivityRowCheckboxProps) => {
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    toggleActivitySelection(activity, isSelected)
  }
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

const ActivityRowTopics = ({ allTopics, topics, maxAllowedLength, onTertiaryLine, inExpandedView, hasConcept, }: { allTopics?: Topic[], topics?: Topic[], maxAllowedLength: number, onTertiaryLine: boolean, inExpandedView: boolean, hasConcept: boolean, }) => {
  const className = "attribute-section topic"

  if (!(topics && topics.length)) { return <span /> }

  if (inExpandedView && !onTertiaryLine) { return <span /> }

  const topicString = stringifyLowerLevelTopics(topics)
  const widthOfTopicSectionInPixels = (topicString.length * AVERAGE_FONT_WIDTH) + (topics.length * IMAGE_WIDTH) + (topics.length * MARGIN)
  const widthExceedsAllottedSpaceOnSecondLine = widthOfTopicSectionInPixels >= maxAllowedLength

  function getParentTopic(topic: Topic) {
    return allTopics.find(t => t.id === topic.parent_id)
  }

  if (inExpandedView && onTertiaryLine) {
    return topics.map((topic, i) => {
      const secondLevelTopic = getParentTopic(topic)
      const thirdLevelTopic = getParentTopic(secondLevelTopic)
      const diagonalDivider = <span className="diagonal-divider">/</span>
      return (
        <span className="attribute-section extended-topic">
          <span><img alt="Globe icon" src={topicSrc} />{thirdLevelTopic?.name}</span>
          {diagonalDivider}
          <span>{secondLevelTopic?.name}</span>
          {diagonalDivider}
          <span className="lowest-level">{topic.name}</span>
        </span>
      )
    })
  } else if ((widthExceedsAllottedSpaceOnSecondLine && onTertiaryLine) || (!widthExceedsAllottedSpaceOnSecondLine && !onTertiaryLine)) {
    return topics.map((topic, i) => {
      return (
        <span className={className}>
          {!onTertiaryLine && hasConcept && i === 0 && <span className="vertical-divider" />}
          <img alt="Globe icon" src={topicSrc} />
          <span>{topic.name}</span>
          {i !== (topics.length - 1) && <span className="vertical-divider" />}
        </span>
      )
    })
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

    if (!gradeLevelFilters.length || (lowestGradeInGradeBand >= lowestGradeLevelFilter && highestGradeInGradeBand <= highestGradeLevelFilter)) {
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

const ActivityRowTooltip = ({ activity, }: { activity: Activity }) => {
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
    <React.Fragment>
      {readabilityLine}
      {descriptionLine}
      {contentPartnerLines}
    </React.Fragment>
  )
}

const ActivityRow = ({ activity, isSelected, toggleActivitySelection, showCheckbox, showRemoveButton, isFirst, setShowSnackbar, saveActivity, allTopics, unsaveActivity, savedActivityIds, gradeLevelFilters, }: ActivityRowProps) => {
  const size = useWindowSize();
  const [isExpanded, setIsExpanded] = React.useState(false)

  function toggleIsExpanded(e) {
    if (e.target.tagName !== 'a') {
      setIsExpanded(!isExpanded)
    }
  }

  const { activity_classification, name, activity_category_name, standard_level_name, anonymous_path, readability_grade_level, topics, id, minimum_grade_level, maximum_grade_level, description, content_partners, } = activity

  function handleClickSaveButton(e) {
    e.stopPropagation()
    saveActivity(id)
  }
  function handleClickSavedButton(e) {
    e.stopPropagation()
    unsaveActivity(id)
  }

  function removeActivity(e) {
    e.stopPropagation()
    toggleActivitySelection(activity, isSelected)
    setShowSnackbar && setShowSnackbar(true)
  }

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
          allTopics={allTopics}
          hasConcept={!!activity_category_name}
          inExpandedView={isExpanded}
          maxAllowedLength={calculateMaxAllowedLengthForTopicSection({ activity_classification, })}
          onTertiaryLine={true}
          topics={topics}
        />
      </div>
    )
  }

  const tooltipContent = renderToString(<ActivityRowTooltip activity={activity} />)

  return (
    // disabling jsx-a11y rules for section onclick because the toggle interaction already exists as its own button for keyboard users
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <section className={`activity-row ${expandClassName} ${isSelectedClassName} ${isFirstClassName} ${expandedButEmptyClassName}`} onClick={toggleIsExpanded}>
      <div className="first-line">
        <div className="name-and-checkbox-wrapper">
          {showCheckbox && <ActivityRowCheckbox activity={activity} isSelected={isSelected} toggleActivitySelection={toggleActivitySelection} />}
          <Tooltip
            tooltipText={tooltipContent}
            tooltipTriggerText={(
              <h2>
                {imageTagForClassification(activity_classification.key)}
                <a href={anonymous_path} rel="noopener noreferrer" target="_blank">{name}</a>
              </h2>
            )}
          />
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
            allTopics={allTopics}
            hasConcept={!!activity_category_name}
            inExpandedView={isExpanded}
            maxAllowedLength={calculateMaxAllowedLengthForTopicSection({ activity_classification, })}
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
