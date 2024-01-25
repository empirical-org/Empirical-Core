# frozen_string_literal: true

class AddTokenToPdfSubscriptions < ActiveRecord::Migration[7.0]
  def change
    add_column :pdf_subscriptions, :token, :string, null: false
  end
end
