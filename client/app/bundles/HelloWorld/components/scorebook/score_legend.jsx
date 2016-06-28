"use strict";
import React from 'react'
export default React.createClass({
	render: function () {
		return (
			 <div className="icons-wrapper icon-legend score-legend">
		        <div className="row no-pl">
		          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10 no-pl">
		            <div className="col-xs-6 col-sm-3 col-xl-3">
		              <div className="icon-wrapper icon-green"></div>
		              <div className="icons-description-wrapper">
		                <p className="title">At Proficiency</p>
		                <p className="explanation">100-76%</p>
		              </div>
		            </div>
		            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
		              <div className="icon-wrapper icon-orange"></div>
		              <div className="icons-description-wrapper">
		                <p className="title">Nearly Proficient</p>
		                <p className="explanation">75-50%</p>
		              </div>
		            </div>
		            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
		              <div className="icon-wrapper icon-red"></div>
		              <div className="icons-description-wrapper">
		                <p className="title">Not Yet Proficient</p>
		                <p className="explanation">49-0%</p>
		              </div>
		            </div>
		            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
		              <div className="icon-wrapper icon-gray"></div>
		              <div className="icons-description-wrapper">
		                <p className="title title-not-started">Not Started</p>
		              </div>
		            </div>
		          </div>
		          <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2 no-pl no-pr">
		            <div className="how-we-grade">
		              <p className="title title-not-started">
		                <a href="http://support.quill.org/knowledgebase/articles/545071-how-we-grade">How We Grade</a>
		                <a href=""><i className="fa fa-long-arrow-right"></i></a>
		              </p>
		            </div>
		          </div>
		        </div>
    		  </div>
		);
	}
});
