import * as React from 'react'

import useFocus from '../../../Shared/hooks/useFocus'
import { Events } from '../../modules/analytics'
import { TrackAnalyticsEvent } from "../../actions/analytics";

const baseImgSrc = `${process.env.CDN_URL}/images/pages/evidence`
const checkMarkSrc = `${baseImgSrc}/components-selection-controls-dark-enabled-selected.svg`

const SURVEY_QUESTION = "What did you think of this activity?"

const emojis = [
  {
    alt: 'Angry face',
    src: `${baseImgSrc}/angry-face.svg`
  },
  {
    alt: 'Frowning face',
    src: `${baseImgSrc}/frowning-face.svg`
  },
  {
    alt: 'Neutral face',
    src: `${baseImgSrc}/neutral-face.svg`
  },
  {
    alt: 'Smiling face',
    src: `${baseImgSrc}/smiling-face.svg`
  },
  {
    alt: 'Excited face',
    src: `${baseImgSrc}/excited-face.svg`
  }
]

const positiveMultipleChoiceOptions = [
  'I thought the feedback was helpful',
  'I thought completing the sentences was a good challenge',
  'I thought completing the sentences was easy',
  'I had no trouble reading the text',
  'I thought this topic was interesting'
]

const negativeMultipleChoiceOptions = [
  'I got stuck on the feedback',
  'I thought completing the sentences was too difficult',
  'I thought completing the sentences was too easy',
  'I thought the text was too difficult',
  'I thought this topic was boring'
]

const EmojiButton = ({ src, alt, emojiNumber, setSelectedEmoji, selectedEmoji, }) => {
  function handleClick() { setSelectedEmoji(emojiNumber) }

  return (
    <button className={`emoji-button ${selectedEmoji === emojiNumber ? 'selected' : ''}`} onClick={handleClick} type="button">
      <img alt={alt} src={src} />
    </button>
  )
}

const MultipleChoiceOption = ({ text, selectedMultipleChoiceOptions, setSelectedMultipleChoiceOptions, }) => {
  const optionIsSelected = selectedMultipleChoiceOptions.find(opt => opt === text)

  function handleCheckboxClick() {
    const newSelectedMultipleChoiceOptions = optionIsSelected ? selectedMultipleChoiceOptions.filter(opt => opt !== text) : selectedMultipleChoiceOptions.concat(text)
    setSelectedMultipleChoiceOptions(newSelectedMultipleChoiceOptions)
  }

  let checkbox = <span aria-label="Unchecked checkbox" className="quill-checkbox unselected" />
  if (optionIsSelected) {
    checkbox = (<span aria-label="Checked checkbox" className="quill-checkbox selected" >
      <img alt="Checked checkbox" src={checkMarkSrc} />
    </span>)
  }

  return (
    <button className={`multiple-choice-option ${optionIsSelected ? 'selected' : ''}`} onClick={handleCheckboxClick} type="button">
      {checkbox}
      <span className="text-container">{text}</span>
    </button>
  )
}

const ActivitySurvey = ({ activity, dispatch, sessionID, saveActivitySurveyResponse, setSubmittedActivitySurvey, }) => {
  const [selectedEmoji, setSelectedEmoji] = React.useState(null)
  const [selectedMultipleChoiceOptions, setSelectedMultipleChoiceOptions] = React.useState([])

  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [])

  React.useEffect(() => { setSelectedMultipleChoiceOptions([]) }, [selectedEmoji])

  function mapMultipleChoiceOptionsForEventParams() {
    const options = {}
    positiveMultipleChoiceOptions.forEach(option => {
      const key = option.split(' ').join('_')
      options[key] = false
    })
    negativeMultipleChoiceOptions.forEach(option => {
      const key = option.split(' ').join('_')
      options[key] = false
    })
    selectedMultipleChoiceOptions.forEach(option => {
      const key = option.split(' ').join('_')
      options[key] = true
    });
    return options
  }

  function handleSend() {
    if (!selectedMultipleChoiceOptions.length) { return }
    const activitySurveyResponse = {
      emoji_selection: selectedEmoji,
      multiple_choice_selections: selectedMultipleChoiceOptions,
      survey_question: SURVEY_QUESTION,
    }
    const trackingProperties = {
      event: Events.STUDENT_RATED_AN_ACTIVITY,
      activity_name: activity?.title,
      tool_name: "Reading",
      rating: selectedEmoji,
      ...mapMultipleChoiceOptionsForEventParams()
    }
    const callback = () => setSubmittedActivitySurvey(true)
    dispatch(TrackAnalyticsEvent(Events.STUDENT_RATED_AN_ACTIVITY, {}, trackingProperties))
    saveActivitySurveyResponse({ sessionID, activitySurveyResponse, callback, })
  }

  function handleLinkClick() { window.location.href = process.env.DEFAULT_URL }

  let activitySurveyHeader
  let multipleChoiceSection

  if (selectedEmoji) {
    const multipleChoiceOptions = selectedEmoji > 3 ? positiveMultipleChoiceOptions : negativeMultipleChoiceOptions
    const multipleChoiceElements = multipleChoiceOptions.map(opt => <MultipleChoiceOption key={opt} selectedMultipleChoiceOptions={selectedMultipleChoiceOptions} setSelectedMultipleChoiceOptions={setSelectedMultipleChoiceOptions} text={opt} />)
    multipleChoiceSection = (<section>
      <h1>Select one or more options:</h1>
      {multipleChoiceElements}
    </section>)
  } else {
    activitySurveyHeader = (<section>
      <p>We need your help</p>
      <h1>{SURVEY_QUESTION}</h1>
    </section>)
  }

  const emojiButtons = emojis.map((emoji, i) => (
    <EmojiButton
      alt={emoji.alt}
      emojiNumber={i + 1}
      key={emoji.alt}
      selectedEmoji={selectedEmoji}
      setSelectedEmoji={setSelectedEmoji}
      src={emoji.src}
    />)
  )

  const sendButtonClassName = selectedMultipleChoiceOptions.length ? 'quill-button large secondary outlined focus-on-dark' : 'quill-button large disabled contained focus-on-dark'

  return (
    <div className="activity-follow-up-container activity-survey-container no-focus-outline" ref={containerRef} tabIndex={-1}>
      <div className="activity-survey-content">
        {activitySurveyHeader}
        <div className="emoji-buttons">{emojiButtons}</div>
        {multipleChoiceSection}
      </div>
      <div className="button-section">
        <a className="focus-on-dark" href={process.env.DEFAULT_URL} onClick={handleLinkClick}>Skip</a>
        <button className={sendButtonClassName} onClick={handleSend} type="button">Send</button>
      </div>
    </div>
  )
}

export default ActivitySurvey
