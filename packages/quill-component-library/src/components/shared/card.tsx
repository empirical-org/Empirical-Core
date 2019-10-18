import React from 'react'

interface CardProps {
  onClick: (event: any) => void;
  imgSrc?: string;
  imgAlt?: string;
  header: string;
  text: string;
}

const Card = (props: CardProps) => {
  const img = props.imgSrc ? <img alt={props.imgAlt} src={props.imgSrc} /> : null
  return (
    <div className="quill-card" onClick={props.onClick}>
      {img}
      <div className="text">
        <h3>{props.header}</h3>
        <p>{props.text}</p>
      </div>
    </div>
  )
}

export { Card }
