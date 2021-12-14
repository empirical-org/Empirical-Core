# frozen_string_literal: true

class CreateSkillGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :skill_groups do |t|
      t.string :name, null: false
      t.text :description
      t.integer :order_number

      t.timestamps null: false
    end
  end
end
