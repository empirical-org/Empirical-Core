import React from 'react'

export default (props) => (
  <div className="lesson-type-mini" onClick={() => window.location = props.link}>
    <img alt="" src={props.imgSrc} />
    <div className="text">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
    </div>
  </div>
)
