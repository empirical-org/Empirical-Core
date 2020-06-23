import * as React from 'react';
const expandSrc = `https://assets.quill.org/images/icons/expand.svg`;

export interface ExpandableUnitProps {
  title: string;
  is_first: boolean;
  learning_cycles: {
    activities: {
      title: string;
      description: string;
      activity_link: string;
      cb_anchor_tag: string;
    }[]
  }[]
}

const ExpandableUnit = (props: ExpandableUnitProps) => {
  const { title, is_first, learning_cycles } = props;
  const [expanded, setExpanded] = React.useState<boolean>(is_first);
  const locationHash = document.location.hash;

  const handleSetExpanded = () => {
    setExpanded(!expanded);
  }

  const renderActivities = (activities, isLastCycle) => {
    return activities.map((activity, i) => {
      const { activity_link, cb_anchor_tag, description, title } = activity;
      const isLocationMatch = locationHash === `#${cb_anchor_tag}`;
      if(isLocationMatch && !expanded) {
        setExpanded(true);
      }
      const lastActivity = isLastCycle && i === activities.length - 1;
      const additionalStyle = `${lastActivity ? 'last-activity' : ''} ${isLocationMatch ? 'highlighted' : ''}`
      return(
        <div className={`cycle-activity-container ${additionalStyle}`} key={i}>
          <div className="cycle-activity-content">
            <a href={activity_link} id={cb_anchor_tag} rel="noopener noreferrer" tabIndex={-1} target="_blank">{title}</a>
            <p>{description}</p>
          </div>
          <a className="quill-button medium primary outlined focus-on-light" href={activity_link} rel="noopener noreferrer" target="_blank">View</a>
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
            <p>•</p>
            <p>5 Passage-Aligned Activities</p>
          </div>
        </div>
        <button className="expand-collapse-button" onClick={handleSetExpanded} type="button">
          <img alt="arrow icon" className="expand-arrow focus-on-light" src={expandSrc} />
        </button>
      </div>
      <div className={`bottom-section ${!expanded ? 'hidden' : ''}`}>
        {learningCycles}
      </div>
    </div>
  );
}

export default ExpandableUnit;
