import React from 'react'

export default class UnitTemplateSecondRow extends React.Component {
  authorName = () => {
    const { data, } = this.props
    let name;
    if (data.author) {
      name = data.author.name;
    } else {
      name = null;
    }
    return name;
  };

  numberOfActivities = () => {
    const { data, } = this.props
    return data.activities ? data.activities.length : 0;
  };

  sayActivitiesCount = () => {
    const { modules, } = this.props
    return modules.string.sayNumberOfThings(this.numberOfActivities(), 'Activity', 'Activities')
  };

  sayTime = () => {
    const { data, } = this.props
    return [data.time, 'mins'].join(' ');
  };

  renderGradeLevelRange = () => {
    const { data, } = this.props

    if (!data.grade_level_range) { return <span />}

    return (
      <div className="grade-level-range">
        <i className='fas fa-book-open' />
        <span>Grade Level Range: {data.grade_level_range}</span>
      </div>
    )
  }

  render() {
    return (
      <div className='white-row'>
        <div className='info-row'>
          {this.renderGradeLevelRange()}
          <div>
            <div className='activities-count'>
              <i className='fas fa-th-list' />
              {this.sayActivitiesCount()}
            </div>
            <div className='time'>
              <i className='far fa-clock' />
              <div className='time-number'>
                {this.sayTime()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
