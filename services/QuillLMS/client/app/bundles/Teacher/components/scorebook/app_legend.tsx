"use strict";
import * as React from 'react'

import { handleHasAppSetting } from "../../../Shared/utils/appSettingAPIs";

const EVIDENCE_ICON_SRC = `${process.env.CDN_URL}/images/icons/tool-evidence-light-gray.svg`

export const AppLegend = () => {
  const [showEvidence, setShowEvidence] = React.useState<boolean>(false);

  React.useEffect(() => {
    handleHasAppSetting({appSettingSetter: setShowEvidence, key: 'comprehension', errorSetter: () => {}})
  }, []);


  const diagnostic = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/diagnostic`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-diagnostic-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Diagnostic</p>
        <p className="description">Identify learning gaps</p>
      </div>
    </a>
  )

  const lessons = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/lessons`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-lessons-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Lessons</p>
        <p className="description">Shared group lessons</p>
      </div>
    </a>
  )

  const connect = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/connect`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-connect-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Connect</p>
        <p className="description">Combine sentences</p>
      </div>
    </a>
  )

  const proofreader = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/proofreader`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-flag-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Proofreader</p>
        <p className="description">Fix errors in passages</p>
      </div>
    </a>
  )

  const grammar = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/grammar`} rel="noopener noreferrer" target="_blank">
      <div className="icon-wrapper icon-puzzle-embossed" />
      <div className="icons-description-wrapper">
        <p className="title">Quill Grammar</p>
        <p className="description">Practice mechanics</p>
      </div>
    </a>
  )

  let evidence = <span className="icon" />

  let icons = [diagnostic, lessons, connect, proofreader, grammar, evidence]

  if (showEvidence) {
    evidence = (<div className="icon">
      <img alt="Book representing Quill Reading for Evidence" className="icon-wrapper evidence-icon" src={EVIDENCE_ICON_SRC} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Reading for Evidence</p>
        <p className="description">Use a text to write with evidence</p>
      </div>
    </div>)

    icons = [evidence, diagnostic, lessons, connect, proofreader, grammar]
  }


  return(
    <div className="icons-wrapper icon-legend app-legend">
      <div className="icons">
        <div className="first-row">
          {icons.slice(0, 3)}
        </div>
        <div className="second-row">
          {icons.slice(3, 6)}
        </div>
      </div>
    </div>
  );
}

export default AppLegend
