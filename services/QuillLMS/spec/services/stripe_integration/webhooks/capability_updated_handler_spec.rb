# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::CapabilityUpdatedHandler do
  include_context 'Stripe Capability Updated Event'

  it_behaves_like 'an event notification handler'
end
