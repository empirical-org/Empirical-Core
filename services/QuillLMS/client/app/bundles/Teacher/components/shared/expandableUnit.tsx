import * as React from 'react';

import { generateLink } from '../../helpers/collegeBoard';
const expandSrc = `https://assets.quill.org/images/icons/expand.svg`;

interface Activity {
  title: string;
  description: string;
  unit_template_id: string;
  cb_anchor_tag: string;
}
export interface ExpandableUnitProps {
  title: string;
  isFirst: boolean;
  learningCycles: {
    activities: Activity[]
  }[]
  isPartOfAssignmentFlow: boolean;
  slug: string;
}

const ExpandableUnit = ({ title, isFirst, learningCycles, isPartOfAssignmentFlow, slug }: ExpandableUnitProps) => {
  // per CollegeBoard specs, first section will be expanded when visting the page
  const [expanded, setExpanded] = React.useState<boolean>(isFirst);
  const [focusedSectionExpanded, setFocusedSectionExpanded] = React.useState<boolean>(false);
  const locationHash = document.location.hash;

  const handleSetExpanded = () => {
    setExpanded(!expanded);
  }

  const renderActivities = (activities: Activity[], isLastCycle: boolean) => {
    return activities.map((activity, i) => {
      const { unit_template_id, cb_anchor_tag, description, title } = activity;
      const isLocationMatch = locationHash === `#${cb_anchor_tag}`;
      if(isLocationMatch && !focusedSectionExpanded && !isFirst) {
        setFocusedSectionExpanded(true);
        handleSetExpanded();
      }
      const lastActivity = isLastCycle && i === activities.length - 1;
      const additionalStyle = `${lastActivity ? 'last-activity' : ''} ${isLocationMatch ? 'highlighted' : ''}`
      const link = generateLink({ isPartOfAssignmentFlow, unitTemplateId: unit_template_id, slug })
      const target = isPartOfAssignmentFlow ? '' : "_blank"
      return(
        <div className={`cycle-activity-container ${additionalStyle}`} id={cb_anchor_tag} key={i}>
          <div className="top-content">
            <a className="activity-title" href={link} rel="noopener noreferrer" tabIndex={-1} target={target}>{title}</a>
            <a className="quill-button medium primary outlined focus-on-light" href={link} rel="noopener noreferrer" target={target}>View</a>
          </div>
          <p className="description">{description}</p>
        </div>
      )
    })
  }

  const topSectionStyle = `${expanded ? 'open' : 'closed'}`;

  const learningCyclesRows = learningCycles.map((learningCycle, i) => {
    const { activities } = learningCycle;
    const isLastCycle = i === learningCycles.length - 1;
    return(
      <div className="learning-cycle-container" key={i}>
        <p className="learning-cycle-header">Learning Cycle {i + 1}</p>
        <div className="divider" />
        <div className="cycle-activities-container">
          {renderActivities(activities, isLastCycle)}
        </div>
      </div>
    );
  });

  return(
    <div className="activity-container expandable">
      <div className={`top-section ${topSectionStyle}`}>
        <div className="unit-header-container">
          <p className="unit-title">{title}</p>
          <div className="unit-sub-header-container">
            <p>{learningCycles.length} Learning Cycles</p>
            <p className="bullet">•</p>
            <p>5 Passage-Aligned Activities</p>
          </div>
        </div>
        <div>
          <button className="expand-collapse-button focus-on-light" onClick={handleSetExpanded} type="button">
            <img alt="arrow icon" className="expand-arrow" src={expandSrc} />
          </button>
        </div>
      </div>
      <div className={`bottom-section ${!expanded ? 'hidden' : ''}`}>
        {learningCyclesRows}
      </div>
    </div>
  );
}

export default ExpandableUnit;
