import React from 'react'

interface CardProps {
  onClick: (event: any) => void;
  imgSrc: string;
  imgAlt: string;
  header: string;
  text: string;
}

const Card = (props: CardProps) => {
  return (
    <div className="quill-card" onClick={props.onClick}>
      <img src={props.imgSrc} alt={props.imgAlt}/>
      <div className="text">
        <h3>{props.header}</h3>
        <p>{props.text}</p>
      </div>
    </div>
  )
}

export { Card }
