import React from 'react'

const ConceptExplanation = ({ description, leftBox, rightBox, }) => (
  <div className="concept-explanation">
    <div className="concept-explanation-title"><img alt="Light Bulb Icon" src={`${process.env.QUILL_CDN_URL}/images/icons/hint.svg`} /><span>Hint</span></div>
    <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: description}} />
    <div className="concept-explanation-see-write">
      <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: leftBox}} />
      <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: rightBox}} />
    </div>
  </div>
)

export { ConceptExplanation }
