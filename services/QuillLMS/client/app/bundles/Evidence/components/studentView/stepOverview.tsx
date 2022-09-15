import * as React from 'react'

import { whiteCheckGreenBackgroundIcon, READ_PASSAGE_STEP_NUMBER, BECAUSE_PASSAGE_STEP_NUMBER, BUT_PASSAGE_STEP_NUMBER, SO_PASSAGE_STEP_NUMBER } from '../../../Shared/index'
import useFocus from '../../../Shared/hooks/useFocus'

const steps = {
  [READ_PASSAGE_STEP_NUMBER]: {
    html: <p>Read a text and highlight sentences.</p>,
    stepNumber: READ_PASSAGE_STEP_NUMBER
  },
  [BECAUSE_PASSAGE_STEP_NUMBER]: {
    html: <p>Expand a sentence using <u>because</u> to provide a reason.</p>,
    stepNumber: BECAUSE_PASSAGE_STEP_NUMBER
  },
  [BUT_PASSAGE_STEP_NUMBER]: {
    html: <p>Expand a sentence using <u>but</u> to provide an opposing idea.</p>,
    stepNumber: BUT_PASSAGE_STEP_NUMBER
  },
  [SO_PASSAGE_STEP_NUMBER]: {
    html: <p>Expand a sentence using <u>so</u> to provide a result.</p>,
    stepNumber: SO_PASSAGE_STEP_NUMBER
  }
}

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
    return (
      <section className="step-overview-step-container">
        <button className="step-overview-step active focus-on-dark" onClick={handleClick} type="button">
          <div className="left-side-container">
            <div className={`evidence-step-number-small ${active ? 'active' : ''}`}>{stepNumber}</div>
            <span className="sr-only">This is the active step:</span>
            {html}
          </div>
          <div aria-hidden="true" className="now-tag">Now</div>
        </button>
      </section>
    )
  }

  if (completed) {
    return (
      <section className="step-overview-step-container">
        <div className="step-overview-step completed">
          <img alt={whiteCheckGreenBackgroundIcon.alt} src={whiteCheckGreenBackgroundIcon.src} />
          <span className="sr-only">Completed step:</span>
          {html}
        </div>
      </section>
    )
  }

  return (
    <section className="step-overview-step-container">
      <div className="step-overview-step">
        <div className="evidence-step-number-small">{stepNumber}</div>
        {html}
      </div>
    </section>
  )
}

const StepOverview = ({ activeStep, handleClick, }) => {
  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [activeStep])

  if (activeStep === READ_PASSAGE_STEP_NUMBER) {
    return (
      <div className="step-overview">
        <h1 className="no-focus-outline" ref={containerRef} tabIndex={-1}>Here’s what you’ll do</h1>
        <Step
          active={true}
          handleClick={handleClick}
          step={steps[READ_PASSAGE_STEP_NUMBER]}
        />
        <Step
          active={activeStep === BECAUSE_PASSAGE_STEP_NUMBER}
          step={steps[BECAUSE_PASSAGE_STEP_NUMBER]}
        />
        <Step
          active={activeStep === BUT_PASSAGE_STEP_NUMBER}
          step={steps[BUT_PASSAGE_STEP_NUMBER]}
        />
        <Step
          active={activeStep === SO_PASSAGE_STEP_NUMBER}
          step={steps[SO_PASSAGE_STEP_NUMBER]}
        />
      </div>
    )
  }

  return (
    <div className="step-overview">
      <h1 ref={containerRef} tabIndex={-1}>Nice! Keep going!</h1>
      <Step
        active={false}
        completed={activeStep > READ_PASSAGE_STEP_NUMBER}
        handleClick={handleClick}
        step={steps[READ_PASSAGE_STEP_NUMBER]}
      />
      <Step
        active={activeStep === BECAUSE_PASSAGE_STEP_NUMBER}
        completed={activeStep > BECAUSE_PASSAGE_STEP_NUMBER}
        handleClick={handleClick}
        step={steps[BECAUSE_PASSAGE_STEP_NUMBER]}
      />
      <Step
        active={activeStep === BUT_PASSAGE_STEP_NUMBER}
        completed={activeStep > BUT_PASSAGE_STEP_NUMBER}
        handleClick={handleClick}
        step={steps[BUT_PASSAGE_STEP_NUMBER]}
      />
      <Step
        active={activeStep === SO_PASSAGE_STEP_NUMBER}
        completed={activeStep > SO_PASSAGE_STEP_NUMBER}
        handleClick={handleClick}
        step={steps[SO_PASSAGE_STEP_NUMBER]}
      />
    </div>
  )
}

export default StepOverview
