class CreateConceptTagCategories < ActiveRecord::Migration
  def change
    create_table :concept_tag_categories do |t|
      t.string :name
    end

    add_column :concept_tags, :concept_tag_category_id, :integer, null: false #Always belongs to a category
  end
end
