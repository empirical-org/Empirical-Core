class AddActivityClassificationIdToConceptResults < ActiveRecord::Migration
  def change
    add_reference :concept_results, :activity_classification, index: true, foreign_key: true
  end
end
