# frozen_string_literal: true

class CreateLockers < ActiveRecord::Migration[5.1]
  def change
    create_table :lockers do |t|
      t.integer :user_id, unique: true
      t.string :label
      t.jsonb :preferences, default: {}

      t.timestamps
    end
  end
end
