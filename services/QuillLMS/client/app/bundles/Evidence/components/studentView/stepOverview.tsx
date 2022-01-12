import * as React from 'react'

import { whiteCheckGreenBackgroundIcon, READ_PASSAGE_STEP, BECAUSE_PASSAGE_STEP, BUT_PASSAGE_STEP, SO_PASSAGE_STEP } from '../../../Shared/index'

const steps = [
  {
    html: <p>Read a text and highlight sentences.</p>,
    stepNumber: READ_PASSAGE_STEP
  },
  {
    html: <p>Expand a sentence using <u>because</u> to provide a reason.</p>,
    stepNumber: BECAUSE_PASSAGE_STEP
  },
  {
    html: <p>Expand a sentence using <u>but</u> to provide an opposing idea.</p>,
    stepNumber: BUT_PASSAGE_STEP
  },
  {
    html: <p>Expand a sentence using <u>so</u> to provide a result.</p>,
    stepNumber: SO_PASSAGE_STEP
  }
]

interface StepProps {
  step: {
    html: React.ReactElement,
    stepNumber: number
  },
  active?: boolean,
  completed?: boolean,
  handleClick?: () => void
}

const Step = ({ active, completed, handleClick, step }: StepProps) => {
  const { html, stepNumber } = step;
  if (active) {
    return (<section className="step-overview-step-container">
      <button className="step-overview-step active" onClick={handleClick} type="button">
        <div className="left-side-container">
          <div className={`evidence-step-number-small ${active ? 'active' : ''}`}>{stepNumber}</div>
          {html}
        </div>
        <div className="now-tag">Now</div>
      </button>
    </section>)
  }

  if (completed) {
    return (<section className="step-overview-step-container">
      <div className="step-overview-step completed">
        <img alt={whiteCheckGreenBackgroundIcon.alt} src={whiteCheckGreenBackgroundIcon.src} />
        {html}
      </div>
    </section>)
  }

  return (<section className="step-overview-step-container">
    <div className="step-overview-step">
      <div className="evidence-step-number-small">{stepNumber}</div>
      {html}
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
        step={steps[READ_PASSAGE_STEP - 1]}
      />
      <Step
        active={activeStep === BECAUSE_PASSAGE_STEP}
        step={steps[BECAUSE_PASSAGE_STEP - 1]}
      />
      <Step
        active={activeStep === BUT_PASSAGE_STEP}
        step={steps[BUT_PASSAGE_STEP - 1]}
      />
      <Step
        active={activeStep === SO_PASSAGE_STEP}
        step={steps[SO_PASSAGE_STEP - 1]}
      />
    </div>)
  }

  return (<div className="step-overview">
    <h1>Nice! Keep going!</h1>
    <Step
      active={false}
      completed={true}
      step={steps[READ_PASSAGE_STEP - 1]}
    />
    <Step
      active={activeStep === BECAUSE_PASSAGE_STEP}
      step={steps[BECAUSE_PASSAGE_STEP - 1]}
    />
    <Step
      active={activeStep === BUT_PASSAGE_STEP}
      step={steps[BUT_PASSAGE_STEP - 1]}
    />
    <Step
      active={activeStep === SO_PASSAGE_STEP}
      step={steps[SO_PASSAGE_STEP - 1]}
    />
  </div>)
}

export default StepOverview
