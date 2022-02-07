# frozen_string_literal: true

class CreateTopicCategories < ActiveRecord::Migration[4.2]
  def change
    create_table :topic_categories do |t|
      t.string :name
      t.timestamps
    end

    add_index :topic_categories, :name
  end
end