import * as React from 'react'

interface AssignmentCardProps {
  selectCard?: () => void;
  imgSrc: string;
  imgAlt: string;
  header: string;
  bodyArray: Array<{ key: string, text: string }>;
  buttonText?: string;
  buttonLink?: string;
}

const attemptSelectCard = (e, selectCard) => {
  if (e.target.tagName !== 'A') {
    selectCard()
  }
}

const AssignmentCard = ({ selectCard, imgSrc, imgAlt, header, bodyArray, buttonText, buttonLink}: AssignmentCardProps) => {
  const button = buttonText && buttonLink ? <a className="quill-button fun outlined secondary" href={buttonLink} target="_blank">{buttonText}</a> : null
  const bodyElements = bodyArray.map(obj => (
    <div className="body-element">
      <p className="key">{obj.key}</p>
      <p className="text">{obj.text}</p>
    </div>)
  )
  return (<div className="assignment-card quill-card" onClick={(e) => attemptSelectCard(e, selectCard)}>
    <div className="top-row">
      <div className="left">
        <img alt={imgAlt} src={imgSrc} />
        <h2>{header}</h2>
      </div>
      {button}
    </div>
    <div className="body">
      {bodyElements}
    </div>
  </div>)
}

export default AssignmentCard
