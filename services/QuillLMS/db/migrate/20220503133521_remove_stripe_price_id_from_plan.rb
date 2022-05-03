# frozen_string_literal: true

class RemoveStripePriceIdFromPlan < ActiveRecord::Migration[5.1]
  def change
    remove_column :plans, :stripe_price_id, :string
  end
end
