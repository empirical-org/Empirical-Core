import * as React from 'react'

function getClassName(description, leftBox, rightBox) {
  if (description && leftBox && rightBox) {
    return "concept-explanation"
  }
  return "concept-explanation empty"
}

const ConceptExplanation = ({ description, leftBox, rightBox, translatedDescription, translated}) => {
  const urlParams = new URLSearchParams(window.location.search)
  const translatedOverride = urlParams.get('showTranslations')
  const showsTranslation = translatedDescription && (translated || translatedOverride)
  return (
    <div className={getClassName(description, leftBox, rightBox)}>
      <div className="concept-explanation-title"><img alt="Light Bulb Icon" src="https://assets.quill.org/images/icons/hint.svg" /><span>Hint</span></div>
      <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: description}} />
      { showsTranslation && <div className="concept-explanation-translation" dangerouslySetInnerHTML={{__html: translatedDescription}} /> }

      <div className="concept-explanation-see-write">
        <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: leftBox}} />
        <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: rightBox}} />
      </div>
    </div>
  )
}

export { ConceptExplanation }
