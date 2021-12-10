# frozen_string_literal: true

class SchoolSubscriptions < ActiveRecord::Migration[4.2]
  def change
    create_table :school_subscriptions do |t|
      t.integer :school_id
      t.integer :subscription_id
      t.timestamps null: false
    end
    add_index :school_subscriptions, :school_id, unique: true
    add_index :school_subscriptions, :subscription_id
  end
end
