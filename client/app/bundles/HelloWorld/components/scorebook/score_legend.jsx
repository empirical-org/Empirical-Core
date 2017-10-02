'use strict';
import React from 'react'
import {proficiencyCutoffsAsPercentage} from '../../../../modules/proficiency_cutoffs.js'

export default React.createClass({
	render: function () {
		const cutOff = proficiencyCutoffsAsPercentage();
		return (
			 <div className="icons-wrapper icon-legend score-legend">
		        <div className="row no-pl">
		          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10 no-pl">
		            <div className="col-xs-6 col-sm-3 col-xl-3">
		              <div className="icon-wrapper icon-green"></div>
		              <div className="icons-description-wrapper">
		                <p className="title">At Proficiency</p>
		                <p className="explanation">{`${cutOff.proficient}-100%`}</p>
		              </div>
		            </div>
		            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
		              <div className="icon-wrapper icon-orange"></div>
		              <div className="icons-description-wrapper">
		                <p className="title">Nearly Proficient</p>
		                <p className="explanation">{`${cutOff.nearlyProficient}-${cutOff.proficient - 1}%`}</p>
		              </div>
		            </div>
		            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
		              <div className="icon-wrapper icon-red"></div>
		              <div className="icons-description-wrapper">
		                <p className="title">Not Yet Proficient</p>
		                <p className="explanation">{`0-${cutOff.nearlyProficient - 1}%`}</p>
		              </div>
		            </div>
		            <div className="col-xs-6 col-sm-3 col-xl-3 no-pl">
		              <div className="icon-wrapper icon-gray"></div>
		              <div className="icons-description-wrapper">
		                <p className="title title-not-started">Not Finished</p>
		              </div>
		            </div>
		          </div>
		          <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2 no-pl no-pr">
		            <div className="how-we-grade">
		              <p className="title title-not-started">
		                <a href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade</a>
		                <a href=""><i className="fa fa-long-arrow-right"></i></a>
		              </p>
		            </div>
		          </div>
		        </div>
    		  </div>
		);
	}
});
