import React from 'react'

const ConceptExplanation = ({ description, leftBox, rightBox, }) => (
  <div className="concept-explanation">
    <div className="concept-explanation-title"><img src={`${process.env.QUILL_CDN_URL}/images/icons/books.jpg`} /> Here&#39;s a Hint</div>
    <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: description}} />
    <div className="concept-explanation-see-write">
      <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: leftBox}} />
      <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: rightBox}} />
    </div>
  </div>
)

export { ConceptExplanation }
