# frozen_string_literal: true

class CreateCategories < ActiveRecord::Migration[4.2]
  def change
    create_table :categories do |t|
      t.text :title

      t.timestamps
    end
  end
end
