# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::ChargeDisputeCreatedHandler do
  include_context 'Stripe Charge Dispute Created Event'

  it_behaves_like 'an event notification handler'
end
