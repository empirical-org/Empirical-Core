# frozen_string_literal: true

class CreateDistrictSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :district_subscriptions do |t|
      t.references :district, foreign_key: true
      t.references :subscription, foreign_key: true

      t.timestamps
    end
  end
end
