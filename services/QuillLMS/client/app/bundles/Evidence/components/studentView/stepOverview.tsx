import * as React from 'react'

import { greenCheckIcon, encircledWhiteArrowIcon, } from '../../../Shared/index'

const READ_PASSAGE_STEP = 1

const steps = [
  {
    text: 'Read a text and highlight sentences'
  },
  {
    text: 'Write three sentences using evidence'
  }
]

const Step = ({ title, text, active, completed, handleClick, }) => {
  if (active) {
    return (<section className="step-overview-step-container">
      <img alt={encircledWhiteArrowIcon.alt} src={encircledWhiteArrowIcon.src} />
      <button className="step-overview-step active" onClick={handleClick} type="button">
        <span>{title}</span>
        <p>{text}</p>
      </button>
    </section>)
  }

  if (completed) {
    return (<section className="step-overview-step-container">
      <img alt={greenCheckIcon.alt} src={greenCheckIcon.src} />
      <div className="step-overview-step completed">
        <span>{title}</span>
        <p>{text}</p>
      </div>
    </section>)
  }

  return (<section className="step-overview-step-container">
    <div className="step-overview-step">
      <span>{title}</span>
      <p>{text}</p>
    </div>
  </section>)
}

const StepOverview = ({ activeStep, handleClick, }) => {
  if (activeStep === READ_PASSAGE_STEP) {
    return (<div className="step-overview">
      <h1>Here’s what you’ll do</h1>
      <Step
        active={true}
        handleClick={handleClick}
        text={steps[0].text}
        title="Step 1 - Now"
      />
      <Step
        text={steps[1].text}
        title="Step 2 - After"
      />
    </div>)
  }

  return (<div className="step-overview">
    <h1>Nice! Keep going!</h1>
    <Step
      completed={true}
      text={steps[0].text}
      title="Step 1 - Done"
    />
    <Step
      active={true}
      handleClick={handleClick}
      text={steps[1].text}
      title="Step 2 - After"
    />
  </div>)
}

export default StepOverview
