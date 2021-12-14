import * as React from 'react'

interface StepLinkProps {
  activeStep: number;
  clickStepLink: Function;
  completedSteps: Array<number>;
  index: number;
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
    const { renderStepNumber, index, activeStep, completedSteps } = this.props

    return <button className="step-link" onClick={this.handleStepLinkClick} onKeyPress={this.handleStepLinkEnter} type="button">{renderStepNumber(index, activeStep, completedSteps)}</button>
  }
}
