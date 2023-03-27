import qs from 'qs'
import * as React from 'react'

import { TEACHER_CENTER_SLUG, USING_QUILL_FOR_READING_COMPREHENSION } from './blog_post_constants'

const searchTokens = [
  'getting started',
  'reading for evidence',
  'diagnostics',
  'videos',
  'best practices',
  'sentence combining',
  'assessments',
  'faq',
  'pre-ap'
]

const SEARCH_LINK = `${import.meta.env.VITE_DEFAULT_URL}/${TEACHER_CENTER_SLUG}/search`

const SearchToken = ({ text }) => {
  return (<a className="search-token focus-on-light" href={`${SEARCH_LINK}?${qs.stringify({ query: text })}`}>{text}</a>)
}

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
      <form action={SEARCH_LINK}>
        <input defaultValue={query || null} name='query' placeholder='Search for posts' type='text' />
        <i className="fas fa-icon fa-search" />
        {showCancelSearchButton ? <button className="interactive-wrapper focus-on-light" onClick={() => window.location.href = `${import.meta.env.VITE_DEFAULT_URL}/${TEACHER_CENTER_SLUG}/`} type="button"><img alt="" className="cancel-button" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/CloseIcon.svg`} /></button> : null}
      </form>
      <div className="search-tokens">{searchTokens.map(t => <SearchToken key={t} text={t} />)}</div>
    </div>
  )
}

export default HeaderSection
