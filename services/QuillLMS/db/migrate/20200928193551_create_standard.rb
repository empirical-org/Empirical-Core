# frozen_string_literal: true

class CreateStandard < ActiveRecord::Migration[4.2]
  def change
    create_table :standards do |t|
      t.string :name
      t.string :uid
      t.references :standard_level, foreign_key: true
      t.references :standard_category, foreign_key: true
      t.boolean :visible, default: true

      t.timestamps null: false
    end
  end
end
