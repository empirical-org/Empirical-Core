import * as React from 'react'

interface ApplyToAllProps {
  startDate: string;
  updateAllDueDates: Function;
}

export default class ApplyToAll extends React.Component<ApplyToAllProps, {}> {
  handleApplyToAllClick() {
    const { updateAllDueDates, startDate, } = this.props
    updateAllDueDates(startDate)
  }

  render() {
    return (<span className="apply-to-all" onClick={this.handleApplyToAllClick}>Apply to All</span>)
  }
}
