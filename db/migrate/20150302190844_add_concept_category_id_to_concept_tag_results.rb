class AddConceptCategoryIdToConceptTagResults < ActiveRecord::Migration
  def change
    add_column :concept_tag_results, :concept_category_id, :integer
  end
end
