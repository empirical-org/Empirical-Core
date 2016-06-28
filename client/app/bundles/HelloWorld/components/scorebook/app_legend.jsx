"use strict";
import React from 'react'

export default React.createClass({
  render: function () {
    return (
      <div className="icons-wrapper icon-legend">
        <div className="row no-pl">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10 no-pl">
            <div className="col-xs-6 col-sm-3 col-xl-3">
              <div className="icon-wrapper icon-green icon-flag"></div>
              <div className="icons-description-wrapper">
                <p className="title">Quill Proofreader</p>
              </div>
            </div>
            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
              <div className="icon-wrapper icon-green icon-puzzle"></div>
              <div className="icons-description-wrapper">
                <p className="title">Quill Grammar</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
});
