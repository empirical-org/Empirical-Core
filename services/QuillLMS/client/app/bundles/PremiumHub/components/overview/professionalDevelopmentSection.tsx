import * as React from 'react'

import {
  SECTION_NAME_TO_ICON_URL,
  PROFESSIONAL_DEVELOPMENT_AND_SUPPORT,
  iconLinkBase,
} from './shared'

import { RESTRICTED, } from '../../shared'
import { requestGet, } from '../../../../modules/request/index';
import { Spinner, } from '../../../Shared/index'

const ERIKA_EMAIL = 'Erika@quill.org'
const SHANNON_EMAIL = 'Shannon@quill.org'

const EMAIL_TO_IMG = {
  [ERIKA_EMAIL]: <img alt="" src={`${iconLinkBase}/erika_headshot.png`} />,
  [SHANNON_EMAIL]: <img alt="" src={`${iconLinkBase}/shannon_headshot.png`} />
}

const EMAIL_TO_SCHEDULE_LINK = {
  [ERIKA_EMAIL]: 'https://calendly.com/erikaatquill/schedule-quill-pd',
  [SHANNON_EMAIL]: 'https://calendly.com/shannonatquill/discuss-scheduling-quill-pd'
}

const scarletAndNattalieImg = <img alt="" className="photos" src={`${iconLinkBase}/scarlet-and-nattalie.png`} />
const alexAndCharlieImg = <img alt="" className="photos" src={`${iconLinkBase}/alex-and-charlie.png`} />
const blackBulb = <img alt="" src={`${iconLinkBase}/black-bulb.svg`} />

const ProfessionalDevelopmentSection = ({ accessType, adminId, }) => {
  const [professionalLearningManagerInformation, setProfessionalLearningManagerInformation] = React.useState(null)
  const [loadingProfessionalLearningManagerInformation, setLoadingProfessionalLearningManagerInformation] = React.useState(true)

  React.useEffect(() => {
    if (accessType === RESTRICTED) { return }
    
    getProfessionalLearningManagerInformation()
  }, [])

  function getProfessionalLearningManagerInformation() {
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}/vitally_professional_learning_manager_info`,
      (body) => {
        setProfessionalLearningManagerInformation(body)
        setLoadingProfessionalLearningManagerInformation(false)
      }
    )
  }

  function renderProfessionalLearningDevelopmentContent() {
    const quickLinks = (
      <div className="quick-links">
        <h3>Quick Links</h3>
        <a href="https://support.quill.org/en/articles/1588988-how-do-i-navigate-the-premium-hub" rel="noopener noreferrer" target="_blank">Premium Hub User Guide</a>
        <a href="https://docsend.com/view/9r6gzp5v8w5ky6w9" rel="noopener noreferrer" target="_blank">Live Training Guide</a>
        <a href="/quill_academy" rel="noopener noreferrer" target="_blank">Quill Academy</a>
        <a href="/teacher-center" rel="noopener noreferrer" target="_blank">Teacher Center</a>
        <a href="mailto:support@quill.org" rel="noopener noreferrer" target="_blank">Contact Support</a>
        <a href="https://quillorg.canny.io/admin-feedback" rel="noopener noreferrer" target="_blank">Request a Feature</a>
      </div>
    )

    if (accessType === RESTRICTED) {
      return (
        <div className="overview-section restricted-access">
          <div className="professional-learning-manager">
            <div>
              <h3>Implement literacy with fidelity</h3>
              <p className="section-subheader">{blackBulb}Premium Schools complete three times as many activities as free schools.</p>
              <p>With personalized learning, interactive activities, and immediate feedback, Quill Premium helps teachers foster literacy skills and critical thinking. If you’re interested in Quill Premium for your teachers, our sales team would love to connect with you.</p>
              <div className="buttons">
                <a className="quill-button contained primary medium focus-on-light" href="https://calendly.com/alex-quill" rel="noopener noreferrer" target="_blank">Schedule a call</a>
                <a className="quill-button contained primary medium focus-on-light" href="https://www.quill.org/premium/request-district-quote" rel="noopener noreferrer" target="_blank">Request a quote</a>
              </div>
            </div>
            {alexAndCharlieImg}
          </div>
          {quickLinks}
        </div>
      )
    }

    if (loadingProfessionalLearningManagerInformation) {
      return (
        <div className="overview-section">
          <div className="professional-learning-manager">
            <Spinner />
          </div>
          {quickLinks}
        </div>
      )
    }

    if (professionalLearningManagerInformation && [ERIKA_EMAIL, SHANNON_EMAIL].includes(professionalLearningManagerInformation.email)) {
      const { name, email, } = professionalLearningManagerInformation

      return (
        <div className="overview-section assigned-professional-learning-manager">
          <div className="professional-learning-manager">
            <div className="text-and-buttons">
              <div>
                <h3>Meet your Professional Learning Manager</h3>
                <p>I am {name}, your main point of contact for Quill implementation questions and scheduling of virtual professional learning opportunities. Please feel free to contact me to discuss how I can best support your district’s Quill journey this year.</p>
              </div>
              <div className="buttons">
                <a className="quill-button contained primary medium focus-on-light" href={`mailto:${email}`} rel="noopener noreferrer" target="_blank">Email me</a>
                <a className="quill-button contained primary medium focus-on-light" href={EMAIL_TO_SCHEDULE_LINK[email]} rel="noopener noreferrer" target="_blank">Schedule a call</a>
              </div>
            </div>
            {EMAIL_TO_IMG[email]}
          </div>
          {quickLinks}
        </div>
      )
    }

    return (
      <div className="overview-section no-assigned-professional-learning-manager">
        <div className="professional-learning-manager">
          <div>
            <h3>Meet your Quill Implementation Team</h3>
            <p className="section-subheader">{blackBulb}Premium Schools complete three times as many activities as free schools.</p>
            <p>We are your main point of contact for Quill questions, onboarding needs, and scheduling of virtual training opportunities. Please feel free to contact us to discuss how we can best support your school’s Quill journey this year.</p>
            <div className="buttons">
              <a className="quill-button contained primary medium focus-on-light" href="mailto:schools@quill.org" rel="noopener noreferrer" target="_blank">Email us</a>
              <a className="quill-button contained primary medium focus-on-light" href="https://calendly.com/schoolsatquill" rel="noopener noreferrer" target="_blank">Schedule training</a>
            </div>
          </div>
          {scarletAndNattalieImg}
        </div>
        {quickLinks}
      </div>
    )
  }

  return (
    <section className="overview-section-wrapper professional-development">
      <h2>
        <img alt="" src={SECTION_NAME_TO_ICON_URL[PROFESSIONAL_DEVELOPMENT_AND_SUPPORT]} />
        <span>{PROFESSIONAL_DEVELOPMENT_AND_SUPPORT}</span>
      </h2>
      {renderProfessionalLearningDevelopmentContent()}
    </section>
  )
}

export default ProfessionalDevelopmentSection
