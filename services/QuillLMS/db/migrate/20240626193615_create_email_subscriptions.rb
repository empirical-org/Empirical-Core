# frozen_string_literal: true

class CreateEmailSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :email_subscriptions do |t|
      t.integer :user_id, null: false
      t.string :frequency, null: false
      t.string :subscription_type, null: false
      t.string :cancel_token, null: false, default: -> { 'md5(random()::text)' }
      t.jsonb :params

      t.timestamps
    end
  end
end
