import * as React from 'react';

import SchoolSelector, { NOT_LISTED, } from '../shared/school_selector'
import { requestPost, requestPut, } from '../../../../modules/request';
import { closeIcon, DropdownInput, Spinner, } from '../../../Shared/index'

export const SCHOOL_PURCHASE_STAGE_TWO = 'school_purchase_stage_two'

const SchoolAndDistrictPremiumModal = ({ stripeSchoolPlan, associatedSchools, userIsSignedIn, startAtStageTwo, customerEmail, closeModal, handleNotListedSelection, }) => {
  const [stage, setStage] = React.useState(startAtStageTwo ? 2 : 1)
  const [selectedSchool, setSelectedSchool] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(handleStageTwo, [])
  React.useEffect(handleStageTwo, [stage])

  function goToStage2() {
    setLoading(true)
    setStage(2)
  }

  function handleStageTwo() {
    if (stage !== 2) { return }

    if (associatedSchools.length === 1) {
      const schoolIds = associatedSchools.map(s => s.id)
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
      if (idOrType !== NOT_LISTED) {
        goToStripe([idOrType])
      } else {
        handleNotListedSelection()
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

  if (stage === 2) {
    if (associatedSchools.length) {
      const schoolOptions = associatedSchools.map(school => ({ value: school.id, label: school.name, }))
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
              <button className="quill-button outlined secondary medium" onClick={closeModal} type="button">Cancel</button>
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
            <SchoolSelector selectSchool={selectSchool} />
          </div>
        </div>
      )
    }
  }

  if (stage === 1) {
    const requestAQuoteButton = <a className="quill-button outlined medium secondary focus-on-light" href="https://quillpremium.wufoo.com/forms/quill-premium-quote/">Request a Quote</a>
    let schoolBuyNowButton = <button className="quill-button contained medium primary focus-on-light" onClick={goToStage2} type="button">Buy Now</button>

    if (!userIsSignedIn) {
      schoolBuyNowButton = <a className="quill-button contained medium primary focus-on-light" href={`/session/new?redirect=/premium?${SCHOOL_PURCHASE_STAGE_TWO}=true`}>Buy Now</a>
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
            {requestAQuoteButton}
          </div>
          <div className="school-and-district-premium-column pricing-info">
            <h2>Contact Us for District Premium</h2>
            <div className="premium-rates">
              <h3>Custom</h3>
              <p>Per school, per year</p>
              <p>Quill provides discounts for multi-school subscriptions.</p>
            </div>
            {requestAQuoteButton}
          </div>
        </div>
      </div>
    )
  }
}

export default SchoolAndDistrictPremiumModal
