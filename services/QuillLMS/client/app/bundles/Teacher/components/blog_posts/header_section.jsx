import React from 'react'

import { TEACHER_CENTER_SLUG, USING_QUILL_FOR_READING_COMPREHENSION } from './blog_post_constants'

export const HeaderSection = ({ title, subtitle, showCancelSearchButton, query }) => {

  function renderTitle() {
    if(title === USING_QUILL_FOR_READING_COMPREHENSION) {
      return title.replace('quill', 'Quill')
    }
    return title;
  }
  return(
    <div className="header-section">
      <div className="text">
        <h1>{renderTitle()}</h1>
        <p>{subtitle}</p>
      </div>
      <form action={`${process.env.DEFAULT_URL}/${TEACHER_CENTER_SLUG}/search`}>
        <input defaultValue={query || null} name='query' placeholder='Search for posts' type='text' />
        <i className="fas fa-icon fa-search" />
        {showCancelSearchButton ? <button className="interactive-wrapper focus-on-light" onClick={() => window.location.href = `${process.env.DEFAULT_URL}/${TEACHER_CENTER_SLUG}/`} type="button"><img alt="" className="cancel-button" src={`${process.env.CDN_URL}/images/icons/CloseIcon.svg`} /></button> : null}
      </form>
    </div>
  )
}

export default HeaderSection
