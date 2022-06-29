# frozen_string_literal: true

class AddSchoolIdsToStripeCheckoutSession < ActiveRecord::Migration[5.1]
  def change
    add_column :stripe_checkout_sessions, :school_ids, :integer, array: true, default: []
  end
end
