import * as React from 'react';

import Constants from '../../constants'

const { PRODUCTION, BETA, ALPHA, ARCHIVED, NONE, } = Constants

const ACTIVITY = 'activity'
const QUESTION = 'question'

export default class DashboardFilters extends React.Component {
  constructor(props) {
    super(props)

    this.renderCheckbox = this.renderCheckbox.bind(this)
    this.updateActivityFlags = this.updateActivityFlags.bind(this)
    this.updateQuestionFlags = this.updateQuestionFlags.bind(this)
  }

  updateActivityFlags(flag) {
    const { allowedActivityFlags, updateAllowedActivityFlags, } = this.props
    let newAllowedActivityFlags
    if (allowedActivityFlags.includes(flag)) {
      newAllowedActivityFlags = allowedActivityFlags.filter(allowedFlag => allowedFlag !== flag)
    } else {
      newAllowedActivityFlags = allowedActivityFlags.concat(flag)
    }
    updateAllowedActivityFlags(newAllowedActivityFlags)
  }

  updateQuestionFlags(flag) {
    const { allowedQuestionFlags, updateAllowedQuestionFlags, } = this.props
    let newAllowedQuestionFlags
    if (allowedQuestionFlags.includes(flag)) {
      newAllowedQuestionFlags = allowedQuestionFlags.filter(allowedFlag => allowedFlag !== flag)
    } else {
      newAllowedQuestionFlags = allowedQuestionFlags.concat(flag)
    }
    updateAllowedQuestionFlags(newAllowedQuestionFlags)
  }

  renderCheckbox(questionOrActivity, flag) {
    const { allowedActivityFlags, allowedQuestionFlags, } = this.props
    let flagArray, updateFunction
    if (questionOrActivity === ACTIVITY) {
      flagArray = allowedActivityFlags
      updateFunction = this.updateActivityFlags
    } else {
      flagArray = allowedQuestionFlags
      updateFunction = this.updateQuestionFlags
    }
    return <div>
      <input
        type="checkbox"
        name={flag}
        value={flag}
        id={`${questionOrActivity}-${flag}`}
        checked={flagArray.includes(flag)}
        onChange={() => updateFunction(flag)}
      />
      <label htmlFor={`${questionOrActivity}-${flag}`}>{flag}</label>
    </div>
  }

  renderQuestionFilters() {
    if (this.props.allowedQuestionFlags) {
      return <div className="question-filters">
        <p>Question Flags</p>
        {this.renderCheckbox(QUESTION, PRODUCTION)}
        {this.renderCheckbox(QUESTION, BETA)}
        {this.renderCheckbox(QUESTION, ALPHA)}
        {this.renderCheckbox(QUESTION, ARCHIVED)}
        {this.renderCheckbox(QUESTION, NONE)}
      </div>
    }
  }

  renderActivityFilters() {
    if (this.props.allowedActivityFlags) {
      return <div className="activity-filters">
        <p>Activity Flags</p>
        {this.renderCheckbox(ACTIVITY, PRODUCTION)}
        {this.renderCheckbox(ACTIVITY, BETA)}
        {this.renderCheckbox(ACTIVITY, ALPHA)}
        {this.renderCheckbox(ACTIVITY, ARCHIVED)}
        {this.renderCheckbox(ACTIVITY, NONE)}
      </div>
    }
  }

  render() {
    return <div className="dashboard-filters">
      {this.renderActivityFilters()}
      {this.renderQuestionFilters()}
    </div>
  }
}
