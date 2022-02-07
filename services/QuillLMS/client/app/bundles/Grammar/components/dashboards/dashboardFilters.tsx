import * as React from 'react';

import Constants from '../../constants'

const { PRODUCTION, GAMMA, BETA, ALPHA, ARCHIVED, NONE, } = Constants

const ACTIVITY = 'activity'
const QUESTION = 'question'

interface DashboardFiltersProps {
  allowedActivityFlags: Array<string>;
  allowedQuestionFlags?: Array<string>;
  updateAllowedActivityFlags: Function;
  updateAllowedQuestionFlags?: Function;
}

export default class DashboardFilters extends React.Component<DashboardFiltersProps> {
  constructor(props: DashboardFiltersProps) {
    super(props)

    this.renderCheckbox = this.renderCheckbox.bind(this)
    this.updateActivityFlags = this.updateActivityFlags.bind(this)
    this.updateQuestionFlags = this.updateQuestionFlags.bind(this)
  }

  updateActivityFlags(flag: string) {
    const { allowedActivityFlags, updateAllowedActivityFlags, } = this.props
    let newAllowedActivityFlags
    if (allowedActivityFlags.includes(flag)) {
      newAllowedActivityFlags = allowedActivityFlags.filter(allowedFlag => allowedFlag !== flag)
    } else {
      newAllowedActivityFlags = allowedActivityFlags.concat(flag)
    }
    updateAllowedActivityFlags(newAllowedActivityFlags)
  }

  updateQuestionFlags(flag: string) {
    const { allowedQuestionFlags, updateAllowedQuestionFlags, } = this.props
    let newAllowedQuestionFlags
    if (allowedQuestionFlags && allowedQuestionFlags.includes(flag)) {
      newAllowedQuestionFlags = allowedQuestionFlags.filter(allowedFlag => allowedFlag !== flag)
    } else {
      newAllowedQuestionFlags = allowedQuestionFlags ? allowedQuestionFlags.concat(flag) : [flag]
    }
    if (updateAllowedQuestionFlags) {
      updateAllowedQuestionFlags(newAllowedQuestionFlags)
    }
  }

  renderCheckbox(questionOrActivity: string, flag: string) {
    const { allowedActivityFlags, allowedQuestionFlags, } = this.props
    const isActivity = questionOrActivity === ACTIVITY
    const flagArray = isActivity ? allowedActivityFlags : allowedQuestionFlags
    const updateFunction = isActivity ? this.updateActivityFlags : this.updateQuestionFlags
    return (
      <div>
        <input
          checked={flagArray ? flagArray.includes(flag) : false}
          id={`${questionOrActivity}-${flag}`}
          name={flag}
          onChange={() => updateFunction ? updateFunction(flag) : null}
          type="checkbox"
          value={flag}
        />
        <label htmlFor={`${questionOrActivity}-${flag}`}>{flag}</label>
      </div>
    )
  }

  renderQuestionFilters():JSX.Element|void {
    if (this.props.allowedQuestionFlags) {
      return (
        <div className="question-filters">
          <p>Question Flags</p>
          {this.renderCheckbox(QUESTION, PRODUCTION)}
          {this.renderCheckbox(QUESTION, GAMMA)}
          {this.renderCheckbox(QUESTION, BETA)}
          {this.renderCheckbox(QUESTION, ALPHA)}
          {this.renderCheckbox(QUESTION, ARCHIVED)}
          {this.renderCheckbox(QUESTION, NONE)}
        </div>
      )
    }
  }

  renderActivityFilters():JSX.Element|void {
    if (this.props.allowedActivityFlags) {
      return (
        <div className="activity-filters">
          <p>Activity Flags</p>
          {this.renderCheckbox(ACTIVITY, PRODUCTION)}
          {this.renderCheckbox(ACTIVITY, GAMMA)}
          {this.renderCheckbox(ACTIVITY, BETA)}
          {this.renderCheckbox(ACTIVITY, ALPHA)}
          {this.renderCheckbox(ACTIVITY, ARCHIVED)}
          {this.renderCheckbox(ACTIVITY, NONE)}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="dashboard-filters">
        {this.renderActivityFilters()}
        {this.renderQuestionFilters()}
      </div>
    )
  }
}
