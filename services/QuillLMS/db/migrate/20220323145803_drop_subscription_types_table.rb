# frozen_string_literal: true

class DropSubscriptionTypesTable < ActiveRecord::Migration[5.1]
  def change
    drop_table :subscription_types do |t|
      t.string :name, null: false, index: true
      t.integer :price
      t.string :teacher_alias
      t.timestamps
    end
  end
end
