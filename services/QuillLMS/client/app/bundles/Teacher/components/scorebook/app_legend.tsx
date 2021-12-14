"use strict";
import * as React from 'react'

export const AppLegend = () => {
  return(
    <div className="icons-wrapper icon-legend app-legend">
      <div className="icons">
        <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/diagnostic`} rel="noopener noreferrer" target="_blank">
          <div className="icon-wrapper icon-diagnostic-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Diagnostic</p>
            <p className="description">Identify learning gaps</p>
          </div>
        </a>
        <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/lessons`} rel="noopener noreferrer" target="_blank">
          <div className="icon-wrapper icon-lessons-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Lessons</p>
            <p className="description">Shared group lessons</p>
          </div>
        </a>
        <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/connect`} rel="noopener noreferrer" target="_blank">
          <div className="icon-wrapper icon-connect-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Connect</p>
            <p className="description">Combine sentences</p>
          </div>
        </a>
        <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/proofreader`} rel="noopener noreferrer" target="_blank">
          <div className="icon-wrapper icon-flag-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Proofreader</p>
            <p className="description">Fix errors in passages</p>
          </div>
        </a>
        <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/grammar`} rel="noopener noreferrer" target="_blank">
          <div className="icon-wrapper icon-puzzle-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Grammar</p>
            <p className="description">Practice mechanics</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default AppLegend
