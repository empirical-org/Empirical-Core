import qs from 'qs'
import * as React from 'react'

import { TEACHER_CENTER, TEACHER_CENTER_SLUG, WRITING_FOR_LEARNING } from './blog_post_constants'
import { evidenceHandbookIcon, EVIDENCE_HANDBOOK_LINK } from '../../../Shared'

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

const SEARCH_LINK = `${process.env.DEFAULT_URL}/${TEACHER_CENTER_SLUG}/search`

const SearchToken = ({ text }) => {
  return (<a className="search-token focus-on-light" href={`${SEARCH_LINK}?${qs.stringify({ query: text })}`}>{text}</a>)
}

export const HeaderSection = ({ title, subtitle, showCancelSearchButton, query }) => {

  function renderEvidenceHandbookBanner() {
    if ([TEACHER_CENTER, WRITING_FOR_LEARNING].includes(title)) {
      return (
        <section className="evidence-teacher-handbook-banner">
          <section className="information-section">
            <h2>Quill Reading for Evidence Teacher Handbook</h2>
            <p>Looking for support integrating Quill Reading for Evidence into your instruction? Our handbook for teachers using our newest literacy tool is packed with best practices and strategies--and it's FREE!</p>
            <a className="quill-button focus-on-light small primary contained" href={EVIDENCE_HANDBOOK_LINK} rel='noopener noreferrer' target="_blank">Get the Teacher Handbook <i className="fas fa-arrow-right" /></a>
          </section>
          <img alt={evidenceHandbookIcon.alt} src={evidenceHandbookIcon.src} />
        </section>
      )
    }
    return <span />
  }
  return(
    <div className="header-section">
      <div className="text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <form action={SEARCH_LINK}>
        <input defaultValue={query || null} name='query' placeholder='Search for posts' type='text' />
        <i className="fas fa-icon fa-search" />
        {showCancelSearchButton ? <button className="interactive-wrapper focus-on-light" onClick={() => window.location.href = `${process.env.DEFAULT_URL}/${TEACHER_CENTER_SLUG}/`} type="button"><img alt="" className="cancel-button" src={`${process.env.CDN_URL}/images/icons/CloseIcon.svg`} /></button> : null}
      </form>
      <div className="search-tokens">{searchTokens.map(t => <SearchToken key={t} text={t} />)}</div>
      {renderEvidenceHandbookBanner()}
    </div>
  )
}

export default HeaderSection
