# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::AccountUpdatedEventHandler do
  include_context 'Stripe Account Updated Event'

  it_behaves_like 'an event notification handler'
end
