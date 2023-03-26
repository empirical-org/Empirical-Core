import * as React from 'react';

import { requestPost, requestPut } from '../../../../modules/request';
import { closeIcon, DropdownInput, NOT_LISTED, Spinner } from '../../../Shared/index';
import SchoolSelector from '../shared/school_selector';

export const SCHOOL_SELECTION_STAGE = 'school_premium_purchase_selection_stage'

const PLAN_SELECTION_STAGE_NUMBER = 1
const SCHOOL_SELECTION_STAGE_NUMBER = 2
const requestSchoolQuoteLink = `${process.env.DEFAULT_URL}/premium/request-school-quote`
const requestDistrictQuoteLink = `${process.env.DEFAULT_URL}/premium/request-district-quote`

const SchoolSelectionStage = ({ eligibleSchools, selectedSchool, goToStripeWithSelectedSchool, setSelectedSchool, closeModal, selectSchool, }) => {
  if (eligibleSchools.length) {
    const schoolOptions = eligibleSchools.map(school => ({ value: school.id, label: school.name, }))
    const continueButton = selectedSchool ? <button className="quill-button medium contained primary focus-on-light" onClick={goToStripeWithSelectedSchool} type="button">Continue</button> : <button className="quill-button medium contained primary focus-on-light disabled" disabled type="button">Continue</button>
    return (
      <div className="modal-container school-and-district-premium-modal-container">
        <div className="modal-background" />
        <div className="school-and-district-premium-modal stage-two quill-modal modal-body">
          <div>
            <h3 className="title">Select the school to purchase Premium</h3>
          </div>
          <DropdownInput
            handleChange={setSelectedSchool}
            options={schoolOptions}
            placeholder="Select school"
            value={selectedSchool}
          />
          <p>Your account is linked to multiple schools. To purchase multiple school subscriptions, please complete the purchase checkout for each school, or contact us at sales@quill.org for one invoice for multiple schools.</p>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={closeModal} type="button">Cancel</button>
            {continueButton}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="modal-container school-and-district-premium-modal-container">
        <div className="modal-background" />
        <div className="school-and-district-premium-modal stage-two quill-modal modal-body">
          <SchoolSelector disableSkipForNow={true} selectSchool={selectSchool} />
        </div>
      </div>
    )
  }
}

const SchoolAndDistrictPremiumModal = ({ stripeSchoolPlan, eligibleSchools, handleAlreadyPremiumSchoolSelection, userIsSignedIn, startAtSchoolSelectionStage, customerEmail, closeModal, handleNotListedSelection, }) => {
  const [stage, setStage] = React.useState(startAtSchoolSelectionStage ? SCHOOL_SELECTION_STAGE_NUMBER : PLAN_SELECTION_STAGE_NUMBER)
  const [selectedSchool, setSelectedSchool] = React.useState(null)
  const [loading, setLoading] = React.useState(startAtSchoolSelectionStage)

  React.useEffect(handleStartSchoolSelectionStage, [stage])

  function goToSchoolSelectionStage() {
    setLoading(true)
    setStage(SCHOOL_SELECTION_STAGE_NUMBER)
  }

  function handleStartSchoolSelectionStage() {
    if (stage !== SCHOOL_SELECTION_STAGE_NUMBER) { return }

    if (eligibleSchools.length === 1) {
      const schoolIds = eligibleSchools.map(s => s.id)
      goToStripe(schoolIds)
    } else {
      setLoading(false)
    }
  }

  function goToStripe(schoolIds) {
    const path = '/stripe_integration/subscription_checkout_sessions'
    const data = {
      cancel_path: 'premium',
      customer_email: customerEmail,
      ...(schoolIds && { school_ids: JSON.stringify(schoolIds) }),
      stripe_price_id: stripeSchoolPlan.plan.stripe_price_id
    }

    requestPost(path, data, body => { window.location.replace(body.redirect_url) })
  }

  function goToStripeWithSelectedSchool() { goToStripe([selectedSchool.value]) }

  function selectSchool(idOrType) {
    requestPut(`${process.env.DEFAULT_URL}/select_school`, {
      school_id_or_type: idOrType,
    }, (body) => {
      if (idOrType === NOT_LISTED) {
        handleNotListedSelection()
      } else if (body.subscription) {
        handleAlreadyPremiumSchoolSelection()
      } else {
        goToStripe([idOrType])
      }
    });
  }

  if (loading) {
    return (
      <div className="modal-container school-and-district-premium-modal-container">
        <div className="modal-background" />
        <div className="school-and-district-premium-modal stage-two quill-modal modal-body">
          <Spinner />
        </div>
      </div>
    )
  }

  if (stage === SCHOOL_SELECTION_STAGE_NUMBER) {
    return (
      <SchoolSelectionStage
        closeModal={closeModal}
        eligibleSchools={eligibleSchools}
        goToStripeWithSelectedSchool={goToStripeWithSelectedSchool}
        selectedSchool={selectedSchool}
        selectSchool={selectSchool}
        setSelectedSchool={setSelectedSchool}
      />
    )
  }

  if (stage === PLAN_SELECTION_STAGE_NUMBER) {
    const requestSchoolQuoteButton = <a className="quill-button outlined medium secondary focus-on-light" href={requestSchoolQuoteLink}>Request a quote</a>
    const requestDistrictQuoteButton = <a className="quill-button outlined medium secondary focus-on-light" href={requestDistrictQuoteLink}>Request a quote</a>
    let schoolBuyNowButton = <button className="quill-button contained medium primary focus-on-light" onClick={goToSchoolSelectionStage} type="button">Buy now</button>

    if (!userIsSignedIn) {
      schoolBuyNowButton = <a className="quill-button contained medium primary focus-on-light" href={`/session/new?redirect=/premium?${SCHOOL_SELECTION_STAGE}=true`}>Buy now</a>
    }

    return (
      <div className="modal-container school-and-district-premium-modal-container">
        <div className="modal-background" />
        <div className="school-and-district-premium-modal stage-one quill-modal modal-body">
          <button className="interactive-wrapper focus-on-light" onClick={closeModal} type="button"><img alt={closeIcon.alt} src={closeIcon.src} /></button>
          <div className="school-and-district-premium-column pricing-info">
            <h2>Buy School Premium Now</h2>
            <div className="premium-rates">
              <h3>${stripeSchoolPlan.plan.price_in_dollars}</h3>
              <p>Per school, per year</p>
              <p>Purchase a school subscription now with a credit card.</p>
            </div>
            {schoolBuyNowButton}
          </div>
          <div className="school-and-district-premium-column pricing-info">
            <h2>Request a School Premium Quote</h2>
            <div className="premium-rates">
              <h3>${stripeSchoolPlan.plan.price_in_dollars}</h3>
              <p>Per school, per year</p>
              <p>Complete the quote request form to receive a quote via email.</p>
            </div>
            {requestSchoolQuoteButton}
          </div>
          <div className="school-and-district-premium-column pricing-info">
            <h2>Contact Us for District Premium</h2>
            <div className="premium-rates">
              <h3>Custom</h3>
              <p>Per school, per year</p>
              <p>Quill provides discounts for multi-school subscriptions.</p>
            </div>
            {requestDistrictQuoteButton}
          </div>
        </div>
      </div>
    )
  }
}

export default SchoolAndDistrictPremiumModal
