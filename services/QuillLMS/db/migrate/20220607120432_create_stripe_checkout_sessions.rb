# frozen_string_literal: true

class CreateStripeCheckoutSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :stripe_checkout_sessions do |t|
      t.string :external_checkout_session_id, null: false, index: true
      t.string :stripe_price_id, null: false
      t.string :url, null: false
      t.references :user, foreign_key: true

      t.timestamps null: false
    end
  end
end
