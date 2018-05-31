class AddNullFalseToConceptTagResults < ActiveRecord::Migration
  def change
    change_column_null :concept_tag_results, :concept_tag_id, false
  end
end
