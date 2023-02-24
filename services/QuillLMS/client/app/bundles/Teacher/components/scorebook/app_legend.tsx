"use strict";
import * as React from 'react'

const EVIDENCE_ICON_SRC = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/tool-evidence-light-gray.svg`

export const AppLegend = () => {
  const diagnostic = (
    <a className="icon focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/tools/diagnostic`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-diagnostic-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Diagnostic</p>
        <p className="description">Identify learning gaps</p>
      </div>
    </a>
  )

  const lessons = (
    <a className="icon focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/tools/lessons`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-lessons-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Lessons</p>
        <p className="description">Shared group lessons</p>
      </div>
    </a>
  )

  const connect = (
    <a className="icon focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/tools/connect`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-connect-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Connect</p>
        <p className="description">Combine sentences</p>
      </div>
    </a>
  )

  const proofreader = (
    <a className="icon focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/tools/proofreader`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-flag-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Proofreader</p>
        <p className="description">Fix errors in passages</p>
      </div>
    </a>
  )

  const grammar = (
    <a className="icon focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/tools/grammar`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-puzzle-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Grammar</p>
        <p className="description">Practice mechanics</p>
      </div>
    </a>
  )

  const evidence = (
    <a className="icon focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/tools/grammar`} rel="noopener noreferrer" target="_blank">
      <img alt="Book representing Quill Reading for Evidence" className="icon-wrapper evidence-icon" src={EVIDENCE_ICON_SRC} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Reading for Evidence</p>
        <p className="description">Use a text to write with evidence</p>
      </div>
    </a>
  )


  const icons = [evidence, diagnostic, lessons, connect, proofreader, grammar]

  return(
    <div className="icons-wrapper icon-legend app-legend">
      <div className="icons">
        {icons}
      </div>
    </div>
  );
}

export default AppLegend
