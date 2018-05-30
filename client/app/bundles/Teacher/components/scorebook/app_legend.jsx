"use strict";
import React from 'react'

export default React.createClass({
  render: function () {
    return (
      <div className="icons-wrapper icon-legend app-legend">
        <div className="icons">
          <div className="icon" onClick={() => window.location.href = "/tools/diagnostic"}>
            <div className="icon-wrapper icon-diagnostic-embossed"/>
            <div className="icons-description-wrapper">
              <p className="title">Quill Diagnostic</p>
              <p className="description">Identify Learning Gaps</p>
            </div>
          </div>
          <div className="icon" onClick={() => window.location.href = "/tools/lessons"}>
            <div className="icon-wrapper icon-lessons-embossed"/>
            <div className="icons-description-wrapper">
              <p className="title">Quill Lessons</p>
              <p className="description">Shared Group Lessons</p>
            </div>
          </div>
          <div className="icon" onClick={() => window.location.href = "/tools/connect"}>
            <div className="icon-wrapper icon-connect-embossed"/>
            <div className="icons-description-wrapper">
              <p className="title">Quill Connect</p>
              <p className="description">Combine Sentences</p>
            </div>
          </div>
          <div className="icon" onClick={() => window.location.href = "/tools/grammar"}>
              <div className="icon-wrapper icon-flag-embossed"/>
              <div className="icons-description-wrapper">
                <p className="title">Quill Proofreader</p>
                <p className="description">Practice Mechanics</p>
              </div>
            </div>
            <div className="icon" onClick={() => window.location.href = "/tools/proofreader"}>
              <div className="icon-wrapper icon-puzzle-embossed"/>
              <div className="icons-description-wrapper">
                <p className="title">Quill Grammar</p>
                <p className="description">Fix Errors In Passages</p>
              </div>
            </div>
          </div>
    </div>
    );
  }
});
