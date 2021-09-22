class AddConceptCategoryIdToConceptTagResults < ActiveRecord::Migration[4.2]
  def change
    add_column :concept_tag_results, :concept_category_id, :integer
  end
end
