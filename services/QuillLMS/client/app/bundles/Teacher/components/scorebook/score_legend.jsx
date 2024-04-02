import React from 'react';

import { proficiencyCutoffsAsPercentage } from '../../../../modules/proficiency_cutoffs.js';
import tooltipCopyForScoreDescriptions from '../modules/tooltipCopyForScoreDescriptions'
import { Tooltip } from '../../../Shared/index';

const Icon = ({ title, tooltipText, explanation, icon, oneLineTitle=false }) => {
  return (
    <Tooltip
      tooltipText={tooltipText}
      tooltipTriggerText={
        <div className="icon">
          {icon}
          <div className="icons-description-wrapper">
            <p className={`title ${oneLineTitle ? 'align-center' : ''}`}>{title}<img alt="" src="https://assets.quill.org/images/icons/icons-help.svg" /></p>
            <p className="explanation">{explanation}</p>
          </div>
        </div>
      }
    />

  )
}

export default class ScoreLegend extends React.Component {
  render() {
    const cutOff = proficiencyCutoffsAsPercentage();
    return (
      <div className="icons-wrapper icon-legend score-legend">
        <div className="icons">
          <Icon
            explanation={`100 - ${cutOff.proficient}% of prompts exhibit skill`}
            icon={<div className="icon-wrapper icon-green" />}
            title={<span>Frequently<br />Demonstrated Skill</span>}
            tooltipText={tooltipCopyForScoreDescriptions['frequently demonstrated skill']}
          />
          <Icon
            explanation={`${cutOff.proficient - 1} - ${cutOff.nearlyProficient}% of prompts exhibit skill`}
            icon={<div className="icon-wrapper icon-orange" />}
            title={<span>Sometimes<br />Demonstrated Skill</span>}
            tooltipText={tooltipCopyForScoreDescriptions['sometimes demonstrated skill']}
          />
          <Icon
            explanation={`${cutOff.nearlyProficient - 1} - 0% of prompts exhibit skill`}
            icon={<div className="icon-wrapper icon-red" />}
            title={<span>Rarely<br />Demonstrated Skill</span>}
            tooltipText={tooltipCopyForScoreDescriptions['rarely demonstrated skill']}
          />
          <Icon
            explanation="No score provided"
            icon={<div className="icon-wrapper icon-blue" />}
            oneLineTitle={true}
            title={<span>Completed</span>}
            tooltipText={tooltipCopyForScoreDescriptions['completed']}
          />
          <Icon
            explanation="Not finished"
            icon={(
              <div className="icon-wrapper icon-progress">
                <img alt="in progress symbol" className="in-progress-symbol" src="https://assets.quill.org/images/scorebook/blue-circle-sliced.svg" />
              </div>
            )}
            oneLineTitle={true}
            title={<span>In Progress</span>}
            tooltipText={tooltipCopyForScoreDescriptions['in progress']}
          />
          <Icon
            explanation="Not started"
            icon={<div className="icon-wrapper icon-unstarted" />}
            oneLineTitle={true}
            title={<span>Assigned</span>}
            tooltipText={tooltipCopyForScoreDescriptions['assigned']}
          />
        </div>
      </div>
    );
  }
}
