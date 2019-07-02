import React from 'react'

export const defaultTooltipTimeout = 1500;

export const Tooltip = (props: {visible: boolean, text: string}) =>
  (<div className={`quill-tooltip ${props.visible ? 'visible' : ''}`}>
    {props.text}
  </div>);
