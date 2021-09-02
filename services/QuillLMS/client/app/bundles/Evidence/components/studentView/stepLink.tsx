import * as React from 'react'

interface StepLinkProps {
  index: number;
  clickStepLink: Function;
  renderStepNumber: Function;
}

export default class StepLink extends React.Component<StepLinkProps> {

  handleStepLinkClick = () => {
    const { index, clickStepLink, } = this.props

    clickStepLink(index)
  }

  handleStepLinkEnter = (e) => {
    if (e.key !== 'Enter') { return }

    const { index, clickStepLink, } = this.props

    clickStepLink(index)
  }

  render() {
    const { renderStepNumber, index, } = this.props

    return <button className="step-link" onClick={this.handleStepLinkClick} onKeyPress={this.handleStepLinkEnter} type="button">{renderStepNumber(index)}</button>
  }
}
