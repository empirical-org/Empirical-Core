import * as React from 'react';

export const circleCheckSrc = `${process.env.CDN_URL}/images/pages/administrator/integrations/circle-check.svg`
export const circleCheckImg = <img alt="" src={circleCheckSrc} />

const SCHOOL = 'School'
const DISTRICT = 'District'
const TEACHER = 'teacher'

// canvas states
const TEACHER_LACKS_RELEVANT_PREMIUM = 'teacherLacksRelevantPremium' // state A/A1 from spec
const TEACHER_LACKS_SCHOOL_CANVAS = 'teacherLacksSchoolCanvas' // state B from spec
const TEACHER_LACKS_INDIVIDUAL_CANVAS = 'teacherLacksIndividualCanvas' // state C from spec
const ADMIN_LACKS_RELEVANT_PREMIUM = 'adminLacksRelevantPremium' // state E/E1 from spec
const ADMIN_LACKS_SCHOOL_CANVAS = 'adminLacksSchoolCanvas' // state F from spec
const ADMIN_LACKS_INDIVIDUAL_CANVAS = 'adminLacksIndividualCanvas' // state G from spec

const PRIMARY_BUTTON_STYLE = "quill-button contained primary medium focus-on-light"

// copy
const ONE_STEP_AWAY_FROM_USING_CANVAS = 'You’re one step away from using Canvas'
const UNLOCK_CANVAS_WITH_SCHOOL_OR_DISTRICT_PREMIUM = 'Unlock Canvas with School or District Premium'
const SEAMLESSLY_IMPORT_YOUR_CANVAS_ROSTERS = 'Seamlessly import your Canvas rosters.'
const SEAMLESSLY_IMPORT_THEIR_CANVAS_ROSTERS = 'Seamlessly import their canvas rosters.'
const AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS = 'Automatically create and sync Canvas student accounts.'
const ACCESS_A_HOST_OF_OTHER_PREMIUM_BENEFITS = 'Access a host of other premium benefits, including priority technical support, enhanced reporting, and assistance from our professional learning team.'
const EXPLORE_PREMIUM = 'Explore premium'
const CONTACT_YOUR_ADMINISTRATOR = 'Contact your administrator'
const LEARN_MORE = 'Learn more'
const LEARN_HOW = 'Learn how'
const SET_UP_INTEGRATION = 'Set up integration'

// links
const RELATIVE_PREMIUM_HREF = '/premium'
const ADMIN_SETUP_CANVAS_HREF = "https://support.quill.org/en/articles/8337988-how-do-i-set-up-the-canvas-integration-for-my-school-district-for-canvas-quill-administrators"
const HOW_TO_IMPORT_CANVAS_CLASSES_HREF = "https://support.quill.org/en/articles/7995794-school-district-premium-how-can-i-import-classes-from-canvas"

const TEACHER_LACKS_PREMIUM_EMAIL_HREF = "mailto:?subject=Can you help unlock Quill's Canvas integration?&body=Hi [Insert Your Administrator’s Name],%0D%0A%0D%0AI've been digging into the Canvas integration in Quill, and it seems like a fantastic tool for our teaching needs. To tap into its full potential, we'd need a School Premium or District Premium subscription.%0D%0A%0D%0AFor more details on Quill's premium offerings, they have a page listing the benefits and pricing here: https://www.quill.org/premium.%0D%0A%0D%0AIf you're curious about how Quill’s Canvas integration works, you can learn more here: https://support.quill.org/en/articles/8337988-how-do-i-set-up-the-canvas-integration-for-my-school-district-for-canvas-quill-administrators.%0D%0A%0D%0AI'd appreciate it if you would consider reaching out to Quill at sales@quill.org to discuss the possibility of upgrading our subscription. This could open up some exciting opportunities for us.%0D%0A%0D%0AThank you for your time and consideration.%0D%0A%0D%0ABest regards,%0D%0A%0D%0A[Insert Your Name]"

const TEACHER_LACKS_SCHOOL_CANVAS_EMAIL_HREF = "mailto:?subject=Can you help set up Quill's Canvas integration?&body=Hi [Insert Your Administrator’s Name],%0D%0A%0D%0AI've been digging into the Canvas integration in Quill, and it seems like a fantastic tool for our teaching needs. The good news is that the integration is already unlocked because we have a School or District Premium subscription. I just need an administrator’s help to set it up.%0D%0A%0D%0AYou can view Quill’s instructions on how to set up the Canvas integration here: https://support.quill.org/en/articles/8337988-how-do-i-set-up-the-canvas-integration-for-my-school-district-for-canvas-quill-administrators%0D%0A%0D%0AThank you for your time and consideration.%0D%0A%0D%0ABest regards,%0D%0A%0D%0A[Insert Your Name]"

const canvasStates = {
  [TEACHER_LACKS_RELEVANT_PREMIUM]: {
    header: UNLOCK_CANVAS_WITH_SCHOOL_OR_DISTRICT_PREMIUM,
    paragraphCopy: 'Looking to streamline your teaching process with Quill’s Canvas integration? Subscribe to School or District Premium* to:',
    checklistItems: [
      SEAMLESSLY_IMPORT_YOUR_CANVAS_ROSTERS,,
      AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS,
      ACCESS_A_HOST_OF_OTHER_PREMIUM_BENEFITS
    ],
    asterisk: <p className="asterisk">* The Canvas integration is not included in the Teacher Premium subscription.</p>,
    buttons: [
      <a className={PRIMARY_BUTTON_STYLE} href={RELATIVE_PREMIUM_HREF} key={EXPLORE_PREMIUM} rel="noopener noreferrer" target="_blank">{EXPLORE_PREMIUM}</a>,
      <a className={PRIMARY_BUTTON_STYLE} href={TEACHER_LACKS_PREMIUM_EMAIL_HREF} key={CONTACT_YOUR_ADMINISTRATOR}>{CONTACT_YOUR_ADMINISTRATOR}</a>,
    ]
  },
  [TEACHER_LACKS_SCHOOL_CANVAS]: {
    header: 'Contact your administrator to unlock Canvas',
    paragraphCopy: 'Looking to streamline your teaching process with Quill’s Canvas integration? Great news! Your School or District Premium subscription gives you access to the integration. The next step is for your administrator to set it up. Once they have done so, you’ll be able\u00A0to:',
    checklistItems: [
      SEAMLESSLY_IMPORT_YOUR_CANVAS_ROSTERS,,
      AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS,
    ],
    buttons: [
      <a className={PRIMARY_BUTTON_STYLE} href={HOW_TO_IMPORT_CANVAS_CLASSES_HREF} key={LEARN_MORE} rel="noopener noreferrer" target="_blank">{LEARN_MORE}</a>,
      <a className={PRIMARY_BUTTON_STYLE} href={TEACHER_LACKS_SCHOOL_CANVAS_EMAIL_HREF} key={CONTACT_YOUR_ADMINISTRATOR}>{CONTACT_YOUR_ADMINISTRATOR}</a>,
    ]
  },
  [TEACHER_LACKS_INDIVIDUAL_CANVAS]: {
    header: ONE_STEP_AWAY_FROM_USING_CANVAS,
    paragraphCopy: 'Looking to streamline your teaching process with Quill’s Canvas integration? Great news! Your School or District Premium subscription gives you access to the integration and it has been set up by an administrator for your school. The last step is for you to log in to Quill via your Canvas account. Once you have done so, you’ll be able\u00A0to:',
    checklistItems: [
      SEAMLESSLY_IMPORT_YOUR_CANVAS_ROSTERS,,
      AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS,
    ],
    buttons: [
      <a className={PRIMARY_BUTTON_STYLE} href={HOW_TO_IMPORT_CANVAS_CLASSES_HREF} key={LEARN_HOW} rel="noopener noreferrer" target="_blank">{LEARN_HOW}</a>
    ]
  },
  [ADMIN_LACKS_RELEVANT_PREMIUM]: {
    header: UNLOCK_CANVAS_WITH_SCHOOL_OR_DISTRICT_PREMIUM,
    paragraphCopy: 'Looking to streamline your school’s teaching process with Quill’s Canvas integration? Subscribe to School or District Premium to allow teachers at your school or district to:',
    checklistItems: [
      SEAMLESSLY_IMPORT_THEIR_CANVAS_ROSTERS,
      AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS,
      ACCESS_A_HOST_OF_OTHER_PREMIUM_BENEFITS
    ],
    buttons: [
      <a className={PRIMARY_BUTTON_STYLE} href={RELATIVE_PREMIUM_HREF} key={EXPLORE_PREMIUM} rel="noopener noreferrer" target="_blank">{EXPLORE_PREMIUM}</a>,
      <a className={PRIMARY_BUTTON_STYLE} href={ADMIN_SETUP_CANVAS_HREF} key={LEARN_MORE} rel="noopener noreferrer" target="_blank">{LEARN_MORE}</a>,
    ]
  },
  [ADMIN_LACKS_SCHOOL_CANVAS]: {
    header: 'Get started with Canvas',
    paragraphCopy: 'Looking to streamline your school’s teaching process with Quill’s Canvas integration? Great news! Your School or District Premium subscription gives you access to the integration. The next step is to set it up. This will allow teachers at your school or district to:',
    checklistItems: [
      SEAMLESSLY_IMPORT_THEIR_CANVAS_ROSTERS,
      AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS,
    ],
    buttons: [
      <a className={PRIMARY_BUTTON_STYLE} href={ADMIN_SETUP_CANVAS_HREF} key={LEARN_MORE} rel="noopener noreferrer" target="_blank">{LEARN_MORE}</a>,
      <a className={PRIMARY_BUTTON_STYLE} href="/teachers/premium_hub/integrations" key={SET_UP_INTEGRATION} rel="noopener noreferrer" target="_blank">{SET_UP_INTEGRATION}</a>,
    ]
  },
  [ADMIN_LACKS_INDIVIDUAL_CANVAS]: {
    header: ONE_STEP_AWAY_FROM_USING_CANVAS,
    paragraphCopy: 'Looking to streamline your teaching process with Quill’s Canvas integration? Great news! Your School or District Premium subscription gives you access to the integration and it has been set up by you or another administrator for your school. The last step is for you to log in to Quill via your Canvas account. Once you have done so, you’ll be able\u00A0to:',
    checklistItems: [
      SEAMLESSLY_IMPORT_YOUR_CANVAS_ROSTERS,,
      AUTOMATICALLY_CREATE_AND_SYNC_CANVAS_STUDENT_ACCOUNTS,
    ],
    buttons: [
      <a className={PRIMARY_BUTTON_STYLE} href={HOW_TO_IMPORT_CANVAS_CLASSES_HREF} key={LEARN_HOW} rel="noopener noreferrer" target="_blank">{LEARN_HOW}</a>,
    ]
  }
}

interface CanvasModalProps {
  close: () => void;
  user: any;
}

const CanvasModal = ({ close, user }: CanvasModalProps) => {
  const subscriptionType = user.subscription?.account_type
  const hasSchoolOrDistrictPremium = subscriptionType?.includes(SCHOOL) || subscriptionType?.includes(DISTRICT)
  const schoolLinkedToCanvas = user.school_linked_to_canvas
  const userIsTeacher = user.role === TEACHER

  let canvasState

  if (userIsTeacher) {
    if (hasSchoolOrDistrictPremium) {
      // we don't show this modal if the user is already linked to Canvas and all of the other conditions are true, which would be state D
      canvasState = schoolLinkedToCanvas ? TEACHER_LACKS_INDIVIDUAL_CANVAS : TEACHER_LACKS_SCHOOL_CANVAS;
    } else {
      canvasState = TEACHER_LACKS_RELEVANT_PREMIUM;
    }
  } else {
    if (hasSchoolOrDistrictPremium) {
      // we don't show this modal if the user is already linked to Canvas and all of the other conditions are true, which would be state H
      canvasState = schoolLinkedToCanvas ? ADMIN_LACKS_INDIVIDUAL_CANVAS : ADMIN_LACKS_SCHOOL_CANVAS;
    } else {
      canvasState = ADMIN_LACKS_RELEVANT_PREMIUM;
    }
  }

  return (
    <div className="modal-container canvas-modal-container">
      <div className="modal-background" />
      <div className="canvas-modal quill-modal modal-body">
        <div>
          <h3 className="title">{canvasStates[canvasState].header}</h3>
        </div>
        <p>{canvasStates[canvasState].paragraphCopy}</p>
        <ul>
          {canvasStates[canvasState].checklistItems.map(checklistItem => (
            <li key={checklistItem}>{circleCheckImg}{checklistItem}</li>
          ))}
        </ul>
        {canvasStates[canvasState].asterisk}
        <div className="form-buttons">
          <button
            className="quill-button outlined secondary medium focus-on-light"
            onClick={close}
            type="button"
          >
            Cancel
          </button>
          <div className="right-aligned-buttons">
            {canvasStates[canvasState].buttons}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanvasModal;
