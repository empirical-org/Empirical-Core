# frozen_string_literal: true

class RenameStripeSubscriptionTypeIdToPlanId < ActiveRecord::Migration[5.1]
  def change
    rename_column :subscriptions, :subscription_type_id, :plan_id
  end
end
