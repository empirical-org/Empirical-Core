import * as React from 'react';
const expandSrc = `https://assets.quill.org/images/icons/expand.svg`;

interface Activity {
  title: string;
  description: string;
  activity_link: string;
  cb_anchor_tag: string;
}
export interface ExpandableUnitProps {
  title: string;
  is_first: boolean;
  learning_cycles: {
    activities: Activity[]
  }[]
}

const ExpandableUnit = (props: ExpandableUnitProps) => {
  const { title, is_first, learning_cycles } = props;
  const [expanded, setExpanded] = React.useState<boolean>(is_first);
  const [focusedSectionExpanded, setFocusedSectionExpanded] = React.useState<boolean>(false);
  const locationHash = document.location.hash;

  const handleSetExpanded = () => {
    setExpanded(!expanded);
  }

  const renderActivities = (activities: Activity[], isLastCycle: boolean) => {
    return activities.map((activity, i) => {
      const { activity_link, cb_anchor_tag, description, title } = activity;
      const isLocationMatch = locationHash === `#${cb_anchor_tag}`;
      if(isLocationMatch && !focusedSectionExpanded && !is_first) {
        setFocusedSectionExpanded(true);
        handleSetExpanded();
      }
      const lastActivity = isLastCycle && i === activities.length - 1;
      const additionalStyle = `${lastActivity ? 'last-activity' : ''} ${isLocationMatch ? 'highlighted' : ''}`
      return(
        <div className={`cycle-activity-container ${additionalStyle}`} id={cb_anchor_tag} key={i}>
          <div className="top-content">
            <a className="activity-title" href={activity_link} rel="noopener noreferrer" tabIndex={-1} target="_blank">{title}</a>
            <a className="quill-button medium primary outlined focus-on-light" href={activity_link} rel="noopener noreferrer" target="_blank">View</a>
          </div>
          <p className="description">{description}</p>
        </div>
      )
    })
  }

  const topSectionStyle = `${expanded ? 'open' : 'closed'}`;
  
  const learningCycles = learning_cycles.map((learningCycle, i) => {
    const { activities } = learningCycle;
    const isLastCycle = i === learning_cycles.length - 1;
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
            <p>{learning_cycles.length} Learning Cycles</p>
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
        {learningCycles}
      </div>
    </div>
  );
}

export default ExpandableUnit;
