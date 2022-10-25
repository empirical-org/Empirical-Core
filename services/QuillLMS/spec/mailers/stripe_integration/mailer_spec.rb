# frozen_string_literal: true

require 'rails_helper'

describe StripeIntegration::Mailer, type: :mailer do
  subject { described_class.send(mailer_action, external_id) }

  let(:external_id) { "evt_#{SecureRandom.hex}" }

  describe '#account_updated' do
    let(:to_email) { 'banking_notifications@example.com' }
    let(:mailer_action) { :account_updated }
    let(:email_subject) { 'Account Updated' }

    before { stub_const('StripeIntegration::Mailer::STRIPE_BANKING_NOTIFICATIONS_EMAIL', to_email) }

    it { mails_notification_email }
  end

  describe '#capability_updated' do
    let(:to_email) { 'banking_notifications@example.com' }
    let(:mailer_action) { :capability_updated }
    let(:email_subject) { 'Capability Updated' }

    before { stub_const('StripeIntegration::Mailer::STRIPE_BANKING_NOTIFICATIONS_EMAIL', to_email) }

    it { mails_notification_email }
  end

  describe '#charge_dispute_closed' do
    let(:to_email) { 'payment_notifications@example.com' }
    let(:mailer_action) { :charge_dispute_closed }
    let(:email_subject) { 'Charge Dispute Closed' }

    before { stub_const('StripeIntegration::Mailer::STRIPE_PAYMENT_NOTIFICATIONS_EMAIL', to_email) }

    it { mails_notification_email }
  end

  describe '#charge_dispute_created' do
    let(:to_email) { 'payment_notifications@example.com' }
    let(:mailer_action) { :charge_dispute_created }
    let(:email_subject) { 'Charge Dispute Created' }

    before { stub_const('StripeIntegration::Mailer::STRIPE_PAYMENT_NOTIFICATIONS_EMAIL', to_email) }

    it { mails_notification_email }
  end

  def mails_notification_email
    expect(subject.subject).to eq email_subject
    expect(subject.to).to eq [to_email]
    expect(subject.from).to eq [described_class::QUILL_TEAM_EMAIL_ADDRESS]
  end
end

