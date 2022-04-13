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
class StripeWebhookEvent < ApplicationRecord
  STATUS_TYPES = [
    FAILED = 'failed',
    IGNORED = 'ignored',
    PENDING = 'pending',
    PROCESSED = 'processed'
  ]

  validates :external_id, stripe_uid: { prefix: :evt }

  def failed!
    update(status: FAILED)
  end

  def ignored!
    update(status: IGNORED)
  end

  def log_error(error)
    failed!
    update(processing_errors: error.message)
    ErrorNotifier.report(error, stripe_webhook_event: id)
  end

  def processed!
    update(status: PROCESSED)
  end
end
