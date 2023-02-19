import * as React from 'react';
import Pusher from 'pusher-js';
import _ from 'lodash';
import qs from 'qs';

import SubscriptionStatus from '../../Teacher/components/subscriptions/SubscriptionStatus';
import CurrentSubscription from '../../Teacher/components/subscriptions/current_subscription';
import SubscriptionHistory from '../../Teacher/components/subscriptions/subscription_history';
import PremiumConfirmationModal from '../../Teacher/components/subscriptions/PremiumConfirmationModal';
import { ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES, } from '../../Teacher/components/subscriptions/constants'
import { requestGet, requestPut, } from '../../../modules/request'
import { DropdownInput, Spinner, } from '../../Shared/index'
import { FULL, restrictedPage, } from '../shared'

const purchaserNameOrEmail = (subscriptionStatus) => {
  if (!subscriptionStatus) { return }

  return subscriptionStatus.purchaser_name || subscriptionStatus.purchaser_email
}

const subscriptionType = (subscriptionStatus) => {
  if (!subscriptionStatus) { return 'Basic' }

  return ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES[subscriptionStatus.account_type]
}

const SchoolSubscriptionsContainer = ({ location, accessType, }) => {
  const [currentUserEmail, setCurrentUserEmail] = React.useState('')
  const [schools, setSchools] = React.useState([])
  const [selectedSchoolId, setSelectedSchoolId] = React.useState(Number(qs.parse(location.search.replace('?', '')).school_id))
  const [stripeInvoiceId, setStripeInvoiceId] = React.useState(null)
  const [stripePaymentMethodUpdated, setStripePaymentMethodUpdated] = React.useState(null)
  const [showPremiumConfirmationModal, setShowPremiumConfirmationModal] = React.useState(false)

  React.useEffect(() => { getSubscriptionData() }, [])

  const selectedSchool = schools.find(s => s.id === selectedSchoolId)

  function onSelectedSchoolChange(selectedSchoolOption) {
    setSelectedSchoolId(selectedSchoolOption.value)
  }

  function getSubscriptionData(callback=null) {
    requestGet('/subscriptions/school_admin_subscriptions', (body) => {
      setSchools(body.schools)
      setStripeInvoiceId(body.stripe_invoice_id)
      setStripePaymentMethodUpdated(body.stripe_payment_method_updated)
      setCurrentUserEmail(body.current_user_email)

      if (!selectedSchoolId) {
        const userAssociatedSchool = body.schools.find(school => school.id === body.user_associated_school_id) // handles edge case where the user is not an admin for the school they're associated with
        setSelectedSchoolId(userAssociatedSchool ? userAssociatedSchool.id : body.schools[0]?.id)
      }

      callback ? callback() : null
    })
  }

  function updateSubscription(params, subscriptionId, callback) {
    requestPut(
      `${import.meta.env.DEFAULT_URL}/subscriptions/${subscriptionId}`,
      { subscription: params, },
      () => getSubscriptionData(callback),
      () => alert('There was an error updating your subscription. Please try again or contact hello@quill.org.')
    );
  };

  function updateSubscriptionStatus(subscription) {
    getSubscriptionData()
    setShowPremiumConfirmationModal(true)
  }

  function retrieveStripePurchasedConfirmation() {
    if (!stripeInvoiceId) { return }

    requestGet(`/subscriptions/retrieve_stripe_subscription/${stripeInvoiceId}`, (body) => {
      if (body.quill_retrieval_processing) {
        initializePusherForStripePurchaseConfirmation()
      } else {
        updateSubscriptionStatus(body)
      }
    })
  }

  function retrieveStripeSubscriptionPaymentMethodUpdating() {
    if (!stripeInvoiceId || !stripePaymentMethodUpdated) { return }

    requestGet(`/subscriptions/retrieve_stripe_subscription/${stripeInvoiceId}`, (body) => {
      if (body.quill_retrieval_processing) {
        initializePusherForStripeSubscriptionPaymentMethodUpdating()
      } else {
        updateSubscriptionStatus(body)
      }
    })
  }

  function initializePusherForStripePurchaseConfirmation() {
    const pusher = new Pusher(import.meta.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(stripeInvoiceId)
    const channel = pusher.subscribe(channelName);

    channel.bind('stripe-subscription-created', () => {
      retrieveStripePurchasedConfirmation()
      pusher.unsubscribe(channelName)
    })
  }

  function initializePusherForStripeSubscriptionPaymentMethodUpdating() {
    const { stripe_subscription_id } = selectedSchool.subscription_status

    const pusher = new Pusher(import.meta.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(stripe_subscription_id)
    const channel = pusher.subscribe(channelName);

    channel.bind('stripe-subscription-payment-method-updated', () => {
      retrieveStripeSubscriptionPaymentMethodUpdating()
      pusher.unsubscribe(channelName)
    })
  }

  function hidePremiumConfirmationModal() { setShowPremiumConfirmationModal(false) }

  if (accessType !== FULL) {
    return restrictedPage
  }

  if (!selectedSchool) {
    return <Spinner />
  }

  const { subscriptions, subscription_status, } = selectedSchool

  const schoolsAsOptions = schools.map(school => ({ value: school.id, label: school.name }))
  const selectedSchoolOption = schoolsAsOptions.find(o => o.value === selectedSchoolId)

  return (
    <section className="subscriptions school-subscriptions-container">
      <DropdownInput
        className="school-dropdown-container"
        handleChange={onSelectedSchoolChange}
        label="School"
        options={schoolsAsOptions}
        value={selectedSchoolOption}
      />
      <SubscriptionStatus
        customerEmail={currentUserEmail}
        subscriptionStatus={subscription_status}
        subscriptionType={subscriptionType(subscription_status)}
        userIsContact={true}
      />
      <CurrentSubscription
        authorityLevel="purchaser"
        purchaserNameOrEmail={purchaserNameOrEmail(subscription_status)}
        subscriptionStatus={subscription_status}
        subscriptionType={subscriptionType(subscription_status)}
        updateSubscription={updateSubscription}
        userIsContact={true}
      />
      <SubscriptionHistory
        authorityLevel="purchaser"
        subscriptions={subscriptions}
      />
      <PremiumConfirmationModal
        hideModal={hidePremiumConfirmationModal}
        show={showPremiumConfirmationModal}
        subscription={subscription_status}
      />
    </section>
  )
}

export default SchoolSubscriptionsContainer
