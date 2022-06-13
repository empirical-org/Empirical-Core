# frozen_string_literal: true

class CreatePlans < ActiveRecord::Migration[5.1]
  def change
    create_table :plans do |t|
      t.string :name, null: false
      t.string :display_name, null: false
      t.integer :price, default: 0
      t.string :audience, null: false
      t.string :interval
      t.integer :interval_count
      t.string :stripe_price_id

      t.timestamps
    end

    add_index :plans, :name, unique: true
  end
end
