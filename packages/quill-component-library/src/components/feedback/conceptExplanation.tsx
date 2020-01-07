import React from 'react'

// interface ConceptExplanationProps {
//   description: string;
//   leftBox: string;
//   rightBox: string;
// }

const ConceptExplanation = (props: any) => (
  <div className="concept-explanation">
    <div className="concept-explanation-title"><img src={`${process.env.QUILL_CDN_URL}/images/icons/books.jpg`} /> Here's a Hint</div>
    <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: props.description}} />
    <div className="concept-explanation-see-write">
      <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: props.leftBox}} />
      <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: props.rightBox}} />
    </div>
  </div>
)

export { ConceptExplanation }
