import React from 'react'

const Snackbar = props =>
  (<div id="quill-snackbar" className={props.visible ? 'visible' : ''}>
    {props.text}
  </div>);

export default Snackbar
