# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::ChargeDisputeClosedHandler do
  include_context 'Stripe Charge Dispute Closed Event'

  it_behaves_like 'an event notification handler'
end
