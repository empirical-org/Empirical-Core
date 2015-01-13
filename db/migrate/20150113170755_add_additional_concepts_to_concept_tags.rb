class AddAdditionalConceptsToConceptTags < ActiveRecord::Migration
  def change
    add_column :concept_tags, :additional_concepts, :string
  end
end
