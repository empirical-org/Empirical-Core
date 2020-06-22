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

  const handleSetExpanded = () => {
    setExpanded(!expanded);
  }

  const renderActivities = (activities, isLastCycle) => {
    return activities.map((activity, i) => {
      const { activity_link, cb_anchor_tag, description, title } = activity;
      const lastActivity = isLastCycle && i === activities.length - 1;
      return(
        <div className={`cycle-activity-container ${lastActivity ? 'last-activity' : ''}`}>
          <div className="cycle-activity-content">
            <a id={cb_anchor_tag}>{title}</a>
            <p>{description}</p>
          </div>
          <a className="quill-button medium primary outlined focus-on-light" href={activity_link} rel="noopener noreferrer" target="_blank">View</a>
        </div>
      )
    })
  }
  const renderBottomSection = () => {
    return(
      <div className='bottom-section'>
        {learning_cycles.map((learningCycle, i) => {
          const { activities } = learningCycle;
          const isLastCycle = i === learning_cycles.length - 1;
          return(
            <div className="learning-cycle-container">
              <p className="learning-cycle-header">Learning Cycle {i + 1}</p>
              <div className="divider" />
              <div className="cycle-activities-container">
                {renderActivities(activities, isLastCycle)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return(
    <div className="activity-container expandable">
      <div className={`top-section ${expanded ? 'open' : 'closed'}`}>
        <div className="unit-header-container">
          <p className="unit-title">{title}</p>
          <div className="unit-sub-header-container">
            <p>{learning_cycles.length} Learning Cycles</p>
            <p>•</p>
            <p>5 Passage-Aligned Activities</p>
          </div>
        </div>
        <img className="expand-arrow focus-on-light" onClick={handleSetExpanded} src={expandSrc} />
      </div>
      {expanded && renderBottomSection()}
    </div>
  );
}

export default ExpandableUnit;
