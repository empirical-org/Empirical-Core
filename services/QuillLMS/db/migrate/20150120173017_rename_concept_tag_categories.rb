class RenameConceptTagCategories < ActiveRecord::Migration
  def change
    rename_table :concept_tag_categories, :concept_classes
    rename_column :concept_tags, :concept_tag_category_id, :concept_class_id
  end
end
