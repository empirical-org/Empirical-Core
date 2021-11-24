# frozen_string_literal: true

class AddContactEmailAndStartDateToSubscriptions < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :contact_email, :string
    add_column :subscriptions, :start_date, :datetime
    add_index :subscriptions, :contact_email, unique: true
    add_index :subscriptions, :start_date, unique: false
  end
end
