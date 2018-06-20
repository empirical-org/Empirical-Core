import React from 'react'

// interface ConceptExplanationProps {
//   description: string;
//   leftBox: string;
//   rightBox: string;
// }

const ConceptExplanation = (props: any) => (
  <div className="concept-explanation">
    <div className="concept-explanation-title"><img src='http://localhost:45537/images/icons/book_icon.png'/> Here's a Hint <img src='http://localhost:45537/images/icons/book_icon.png'/></div>
    <div className="concept-explanation-description" dangerouslySetInnerHTML={{__html: props.description}}></div>
    <div className="concept-explanation-see-write">
      <div className="concept-explanation-see" dangerouslySetInnerHTML={{__html: props.leftBox}}></div>
      <div className="concept-explanation-write" dangerouslySetInnerHTML={{__html: props.rightBox}}></div>
    </div>
  </div>
)

export { ConceptExplanation }
