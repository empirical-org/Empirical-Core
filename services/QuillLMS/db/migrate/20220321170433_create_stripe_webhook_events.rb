# frozen_string_literal: true

class CreateStripeWebhookEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :stripe_webhook_events do |t|
      t.string :event_type, null: false
      t.string :status, default: 'pending'
      t.string :external_id, null: false, index: { unique: true}
      t.string :processing_errors

      t.timestamps
    end
  end
end
