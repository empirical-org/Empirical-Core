class AddAdditionalConceptsToConceptTags < ActiveRecord::Migration[4.2]
  def change
    add_column :concept_tags, :additional_concepts, :string
  end
end
