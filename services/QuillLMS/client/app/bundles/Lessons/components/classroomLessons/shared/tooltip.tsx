import * as React from 'react';

const Tooltip = props => (
  <div className={`tooltip ${props.className}`}>
    <p className="text">{props.text}</p>
    <i className="fa fa-caret-up" />
  </div>
)

export default Tooltip;
