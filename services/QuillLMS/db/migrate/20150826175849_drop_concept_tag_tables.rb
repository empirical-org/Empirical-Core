# frozen_string_literal: true

class DropConceptTagTables < ActiveRecord::Migration[4.2]
  def change
    drop_table :concept_tags
    drop_table :concept_classes
    drop_table :concept_categories
    drop_table :concept_tag_results
  end
end
