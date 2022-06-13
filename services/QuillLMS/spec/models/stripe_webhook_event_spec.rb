# frozen_string_literal: true

# == Schema Information
#
# Table name: stripe_webhook_events
#
#  id                :bigint           not null, primary key
#  event_type        :string           not null
#  processing_errors :string
#  status            :string           default("pending")
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  external_id       :string           not null
#
# Indexes
#
#  index_stripe_webhook_events_on_external_id  (external_id) UNIQUE
#
require 'rails_helper'

RSpec.describe StripeWebhookEvent, type: :model do
  subject { create(:stripe_webhook_event) }

  it { expect(subject).to be_valid }
  it { expect(build(:stripe_webhook_event, external_id: 'invalid_id')).not_to be_valid }

  it { expect { subject.failed! }.to change(subject, :status).to(described_class::FAILED) }
  it { expect { subject.ignored! }.to change(subject, :status).to(described_class::IGNORED) }
  it { expect { subject.processed! }.to change(subject, :status).to(described_class::PROCESSED) }

  context '#log_error' do
    let(:error) { StripeIntegration::Webhooks::UnknownEventHandler::UnknownEventError.new }

    it { expect { subject.log_error(error) }.to change(subject, :status).to(described_class::FAILED) }
    it { expect { subject.log_error(error) }.to change(subject, :processing_errors).to(error.message) }

    it do
      expect(ErrorNotifier).to receive(:report).with(error, stripe_webhook_event: subject.id)
      subject.log_error(error)
    end
  end
end
