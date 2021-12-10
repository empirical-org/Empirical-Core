# frozen_string_literal: true

class CreateConceptCategories < ActiveRecord::Migration[4.2]
  def change
    create_table :concept_categories do |t|
      t.string :name
      t.belongs_to :concept_class
      t.timestamps
    end

    add_index :concept_categories, :name
  end
end
