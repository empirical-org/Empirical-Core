import React from 'react'

export const Snackbar = (props: {visible: boolean, text: string}) =>
  (<div id="quill-snackbar" className={props.visible ? 'visible' : ''}>
    {props.text}
  </div>);
