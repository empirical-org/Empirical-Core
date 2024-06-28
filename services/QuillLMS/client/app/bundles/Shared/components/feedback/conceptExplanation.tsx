import * as React from 'react'

function getClassName(description, leftBox, rightBox) {
  if (description && leftBox && rightBox) {
    return "concept-explanation"
  }
  return "concept-explanation empty"
}

const ConceptExplanation = ({ description, leftBox, rightBox, translatedDescription, adminShowTranslation}) => {
  const urlParams = new URLSearchParams(window.location.search)
  // This is a temporary way to show translations until we add a language selector in the top bar.
  const showTranslationsFromQueryString = urlParams.get('showTranslations') === 'true'
  const showsTranslation = (translatedDescription != null) && (adminShowTranslation || showTranslationsFromQueryString)
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
