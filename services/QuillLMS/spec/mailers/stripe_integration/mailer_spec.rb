# frozen_string_literal: true

require 'rails_helper'

describe StripeIntegration::Mailer, type: :mailer do

  describe '#charge_dispute_created' do
    subject { described_class.charge_dispute_created}

    it 'mails a notification email to Quill Team email address' do
      expect(subject.subject).to eq 'Charge Dispute Created'
      expect(subject.to).to eq [described_class::QUILL_TEAM_EMAIL_ADDRESS]
      expect(subject.from).to eq [described_class::QUILL_TEAM_EMAIL_ADDRESS]
    end
  end
end
