import React from 'react';
import LoadingIndicator from '../../shared/loading_indicator.jsx';

export default class LessonsRecommendationRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false, };
    this.assignActivityPack = this.assignActivityPack.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  assignActivityPack() {
    this.props.assignToWholeClass(this.props.activityPackId);
  }

  toggleExpand() {
    this.setState({ expanded: !this.state.expanded, });
  }

  renderExpandedSection() {
    const rec = this.props.recommendation;
    const activities = rec.activities.map((act, index) => (
      <div className="activity-row flex-row vertically-centered" key={act.name}>
        <span>{` ${act.name}`}</span>
        <a href={act.url} target="_blank">Preview Lesson</a>
      </div >));
    return (
      <div className="expanded-section">
        {activities}
      </div>
    );
  }

  statusSpecificComponent() {
    if (this.props.status === 'loading') {
      return (<LoadingIndicator />);
    } else if (this.props.recommendation.previously_assigned || this.props.status === 'assigned') {
      return <span className="assigned-lesson-pack vertically-centered centered"><i className="fas fa-check-circle" />Pack Assigned</span>;
    }
    return (<a className="assign q-button bg-quillgreen text-white" onClick={this.assignActivityPack}>Assign Pack</a>);
  }

  render() {
    const expandState = this.state.expanded ? 'expanded' : 'collapsed';
    const rec = this.props.recommendation;
    let expandedSection;
    const recommendationState = rec.percentage_needing_instruction > 50 ? 'recommended' : false;
    if (expandState === 'expanded') {
      expandedSection = this.renderExpandedSection();
    }
    return (
      <div className={`${expandState} ${recommendationState} lesson-recommendation-row`}>
        <div className="top-row flex-row vertically-centered space-between ">
          <div className="left-side flex-row vertically-centered">
            <h3 className={'lesson-name'}>
              {rec.name}
            </h3>
            <span onClick={this.toggleExpand}>{this.state.expanded ? 'COLLAPSE' : 'EXPAND'}</span>
          </div>
          <div className="right-side flex-row vertically-centered space-between ">
            <span>
              {`${rec.percentage_needing_instruction}% of students need instruction`}
            </span>
            {this.statusSpecificComponent()}
          </div>
        </div>
        {expandedSection}
      </div>
    );
  }
}
