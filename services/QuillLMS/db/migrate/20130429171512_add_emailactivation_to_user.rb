# frozen_string_literal: true

class AddEmailactivationToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :email_activation_token, :string
    add_column :users, :active, :boolean, default: false
    add_column :users, :confirmable_set_at, :datetime
  end
end
