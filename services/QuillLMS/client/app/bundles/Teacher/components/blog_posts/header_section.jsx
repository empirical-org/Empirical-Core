import React from 'react'

import { TEACHER_CENTER_SLUG } from './blog_post_constants'

export default (props) => (
  <div className="header-section">
    <div className="text">
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
    </div>
    <form action={`${process.env.DEFAULT_URL}/${TEACHER_CENTER_SLUG}/search`}>
      <input defaultValue={props.query ? props.query : null} name='query' placeholder='Search for posts' type='text' />
      <i className="fas fa-icon fa-search" />
      {props.showCancelSearchButton ? <img className="cancel-button" onClick={() => window.location.href = `${process.env.DEFAULT_URL}/${TEACHER_CENTER_SLUG}/`} src={`${process.env.CDN_URL}/images/icons/CloseIcon.svg`} /> : null}
    </form>
  </div>
)
