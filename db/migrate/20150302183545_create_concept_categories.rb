class CreateConceptCategories < ActiveRecord::Migration
  def change
    create_table :concept_categories do |t|
      t.string :name
      t.belongs_to :concept_class
      t.timestamps
    end

    add_index :concept_categories, :name
  end
end
