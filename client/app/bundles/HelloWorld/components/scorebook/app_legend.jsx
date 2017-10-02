"use strict";
import React from 'react'

export default React.createClass({
  render: function () {
    return (
      <div className="icons-wrapper icon-legend">
        <div className="icons">
          <div className="icon">
            <div className="icon-wrapper icon-green icon-diagnostic"/>
            <div className="icons-description-wrapper">
              <p className="title">Quill Diagnostic</p>
            </div>
          </div>
          <div className="icon">
            <div className="icon-wrapper icon-green icon-lessons"/>
            <div className="icons-description-wrapper">
              <p className="title">Quill Lessons</p>
            </div>
          </div>
          <div className="icon">
            <div className="icon-wrapper icon-green icon-connect"/>
            <div className="icons-description-wrapper">
              <p className="title">Quill Connect</p>
            </div>
          </div>
            <div className="icon">
              <div className="icon-wrapper icon-green icon-flag"/>
              <div className="icons-description-wrapper">
                <p className="title">Quill Proofreader</p>
              </div>
            </div>
            <div className="icon">
              <div className="icon-wrapper icon-green icon-puzzle"/>
              <div className="icons-description-wrapper">
                <p className="title">Quill Grammar</p>
              </div>
            </div>
          </div>
    </div>
    );
  }
});
