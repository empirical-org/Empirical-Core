import React from 'react'

function getClassName(description, leftBox, rightBox) {
  if (description && leftBox && rightBox) {
    return "concept-explanation"
  }
  return "concept-explanation empty"
}

const ConceptExplanation = ({ description, leftBox, rightBox, }) => (
  <div className={getClassName(description, leftBox, rightBox)}>
    <div className="concept-explanation-title"><img alt="Light Bulb Icon" src="https://assets.quill.org/images/icons/hint.svg" /><span>Hint</span></div>
    <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: description}} />
    <div className="concept-explanation-see-write">
      <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: leftBox}} />
      <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: rightBox}} />
    </div>
  </div>
)

export { ConceptExplanation }
