"use strict";
import React from 'react'

const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  window.location.href = e.currentTarget.value;
}

export const AppLegend = () => {
  return(
    <div className="icons-wrapper icon-legend app-legend">
      <div className="icons">
        <button className="icon focus-on-light" onClick={handleClick} type="button" value="/tools/diagnostic">
          <div className="icon-wrapper icon-diagnostic-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Diagnostic</p>
            <p className="description">Identify Learning Gaps</p>
          </div>
        </button>
        <button className="icon focus-on-light" onClick={handleClick} type="button" value="/tools/lessons">
          <div className="icon-wrapper icon-lessons-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Lessons</p>
            <p className="description">Shared Group Lessons</p>
          </div>
        </button>
        <button className="icon focus-on-light" onClick={handleClick} type="button" value="/tools/connect">
          <div className="icon-wrapper icon-connect-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Connect</p>
            <p className="description">Combine Sentences</p>
          </div>
        </button>
        <button className="icon focus-on-light" onClick={handleClick} type="button" value="/tools/proofreader">
          <div className="icon-wrapper icon-flag-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Proofreader</p>
            <p className="description">Fix Errors In Passages</p>
          </div>
        </button>
        <button className="icon focus-on-light" onClick={handleClick} type="button" value="/tools/grammar">
          <div className="icon-wrapper icon-puzzle-embossed" />
          <div className="icons-description-wrapper">
            <p className="title">Quill Grammar</p>
            <p className="description">Practice Mechanics</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default AppLegend
