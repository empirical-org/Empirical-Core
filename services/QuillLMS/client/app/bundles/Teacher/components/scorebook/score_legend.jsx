'use strict';
import React from 'react'

import { proficiencyCutoffsAsPercentage } from '../../../../modules/proficiency_cutoffs.js'
import { Tooltip } from '../../../Shared/index'

export default class ScoreLegend extends React.Component {
  render() {
    const cutOff = proficiencyCutoffsAsPercentage();
    return (
      <div className="icons-wrapper icon-legend score-legend">
        <div className="icons">
          <div className="icon">
            <div className="icon-wrapper icon-green" />
            <div className="icons-description-wrapper">
              <p className="title">Proficient</p>
              <p className="explanation">{`${cutOff.proficient}-100%`}</p>
            </div>
          </div>
          <div className="icon">
            <div className="icon-wrapper icon-orange" />
            <div className="icons-description-wrapper">
              <p className="title">Nearly proficient</p>
              <p className="explanation">{`${cutOff.nearlyProficient}-${cutOff.proficient - 1}%`}</p>
            </div>
          </div>
          <div className="icon">
            <div className="icon-wrapper icon-red" />
            <div className="icons-description-wrapper">
              <p className="title">Not yet proficient</p>
              <p className="explanation">{`0-${cutOff.nearlyProficient - 1}%`}</p>
            </div>
          </div>
          <Tooltip
            tooltipText='This type of activity is not graded.'
            tooltipTriggerText={
              <div className="icon">
                <div className="icon-wrapper icon-blue" />
                <div className="icons-description-wrapper">
                  <p className="title">Completed</p>
                  <p className="explanation"><br /></p>
                </div>
              </div>
            }
          />
          <div className="icon">
            <div className="icon-wrapper icon-progress">
              <img alt="in progress symbol" className="in-progress-symbol" src="https://assets.quill.org/images/scorebook/blue-circle-sliced.svg" />
            </div>
            <div className="icons-description-wrapper">
              <p className="title">In progress</p>
              <p className="explanation">Not finished</p>
            </div>
          </div>
          <div className="icon">
            <div className="icon-wrapper icon-unstarted" />
            <div className="icons-description-wrapper">
              <p className="title">Not started</p>
              <p className="explanation">Assigned</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
