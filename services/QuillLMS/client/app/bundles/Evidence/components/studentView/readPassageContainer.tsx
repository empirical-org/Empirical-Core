import * as React from "react"
import ReactHtmlParser from 'react-html-parser'

import HeaderImage from './headerImage'

import useFocus from '../../../Shared/hooks/useFocus'
import { addPTagsToPassages, onMobile, READ_PASSAGE_STEP } from '../../helpers/containerActionHelpers'

const ReadPassageContainer = ({
  activities,
  activeStep,
  handleReadPassageContainerScroll,
  hasStartedPromptSteps,
  hasStartedReadPassageStep,
  scrolledToEndOfPassage,
  showReadTheDirectionsButton,
  transformMarkTags
}) => {
  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    if (!showReadTheDirectionsButton) {
      setContainerFocus()
    }
  }, [showReadTheDirectionsButton])

  const { currentActivity, } = activities
  if (!currentActivity) { return <span /> }

  const { title, passages, } = currentActivity
  const headerImage = passages[0].image_link && <img alt={passages[0].image_alt_text} className="header-image" src={passages[0].image_link} />
  let innerContainerClassName = "read-passage-inner-container "
  const innerPassageShouldBeBlurred = !hasStartedReadPassageStep || showReadTheDirectionsButton || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)
  innerContainerClassName += innerPassageShouldBeBlurred ? 'blur' : ''

  if ((!hasStartedReadPassageStep || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)) && onMobile()) {
    return <span />
  }
  const formattedPassages = addPTagsToPassages(passages, scrolledToEndOfPassage)
  const formattedPassage = formattedPassages ? formattedPassages[0] : '';
  return (
    <div className="read-passage-container no-focus-outline" onScroll={handleReadPassageContainerScroll} ref={containerRef} tabIndex={-1}>
      <div aria-hidden={innerPassageShouldBeBlurred} className={innerContainerClassName}>
        <h1 className="title">{title}</h1>
        <HeaderImage headerImage={headerImage} passage={passages[0]} />
        <div className="passage">{ReactHtmlParser(formattedPassage, { transform: transformMarkTags })}</div>
      </div>
    </div>
  )
}

export default ReadPassageContainer
