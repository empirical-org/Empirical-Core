# frozen_string_literal: true

# == Schema Information
#
# Table name: stripe_checkout_sessions
#
#  id                           :bigint           not null, primary key
#  expiration                   :datetime         not null
#  url                          :string           not null
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  external_checkout_session_id :string           not null
#  stripe_price_id              :string           not null
#  user_id                      :bigint
#
# Indexes
#
#  index_stripe_checkout_sessions_on_external_checkout_session_id  (external_checkout_session_id)
#  index_stripe_checkout_sessions_on_user_id                       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe StripeCheckoutSession, type: :model do

  describe '.not_expired' do
    let!(:stripe_checkout_session) { create(:stripe_checkout_session) }
    let!(:expired_stripe_checkout_session) { create(:stripe_checkout_session, expiration: DateTime.now.utc) }

    it { expect(described_class.not_expired).to eq [stripe_checkout_session] }
  end

  describe '.custom_find_or_create_by!' do
    let(:external_checkout_session_args) { {} }

    subject { described_class.custom_find_or_create_by!(external_checkout_session_args, stripe_price_id, user_id) }

    context 'stripe_checkout_session exists' do
      let!(:stripe_checkout_session) { create(:stripe_checkout_session) }

      let(:stripe_price_id) { stripe_checkout_session.stripe_price_id }
      let(:user_id) { stripe_checkout_session.user_id }

      it { expect(subject).to eq stripe_checkout_session }
      it { expect { subject }.not_to change(StripeCheckoutSession, :count) }
    end

    context 'stripe_checkout_session does not exist' do
      let(:external_checkout_session_id) { "cs_#{SecureRandom.hex}" }
      let(:stripe_price_id) { "price_#{SecureRandom.hex}" }
      let(:user_id) { create(:user).id }
      let(:url) { 'https;//example.com' }

      let(:external_checkout_session) { double(id: external_checkout_session_id, url: url, expires_at: DateTime.now.utc) }

      before { allow(Stripe::Checkout::Session).to receive(:create).and_return(external_checkout_session) }

      it { expect { subject }.to change(StripeCheckoutSession, :count).from(0).to(1) }
    end
  end
end
