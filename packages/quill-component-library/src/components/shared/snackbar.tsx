import React from 'react'

export const Snackbar = (props: {visible: boolean, text: string}) =>
  (<div className={`quill-snackbar ${props.visible ? 'visible' : ''}`}>
    {props.text}
  </div>);
