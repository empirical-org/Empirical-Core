import * as React from 'react'

const personWithChecklistSrc = `${process.env.CDN_URL}/images/pages/dashboard/person-with-checklist.svg`
const bigCheckIconSrc = `${process.env.CDN_URL}/images/pages/dashboard/icons-check-big.svg`

const bigCheckIcon = {
  src: bigCheckIconSrc,
  alt: 'Green check icon'
}

interface OnboardingChecklistItemInterface {
  checked: boolean;
  name: string;
  link?: string;
}

const OnboardingChecklistItem = ({ checked, name, link, }: OnboardingChecklistItemInterface) => {
  const checkmark = checked ? <img alt={bigCheckIcon.alt} className="big-check checked" src={bigCheckIcon.src} /> : <div className="big-check unchecked" />
  let itemClassName = checked ? "onboarding-checklist-item completed" : "onboarding-checklist-item"
  if (link) {
    itemClassName += ' focus-on-light'
    return <a className={itemClassName} href={link}>{checkmark}<span>{name}</span></a>
  }

  return (<div className={itemClassName}>{checkmark}<span>{name}</span></div>)
}

const OnboardingChecklist = ({ onboardingChecklist, firstName, }: { onboardingChecklist: Array<OnboardingChecklistItemInterface>, firstName: string, }) => {
  return (
    <div className="onboarding-checklist-container">
      <div className="onboarding-checklist-body">
        <h1>Welcome, {firstName}!</h1>
        <p>Follow these steps to get the ball rolling.</p>
        <div className="onboarding-checklist">
          <OnboardingChecklistItem checked={true} name="Be inspired by a teacher growing up, and become one yourself" />
          {onboardingChecklist.map(item => <OnboardingChecklistItem checked={item.checked} key={item.name} link={item.link} name={item.name} />)}
        </div>
      </div>
      <img alt="Woman holding a check mark up to an oversized checklist" className="illustration" src={personWithChecklistSrc} />
    </div>
  )
}

export default OnboardingChecklist
