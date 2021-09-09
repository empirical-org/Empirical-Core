class CreateConceptTags < ActiveRecord::Migration[4.2]
  def change
    create_table :concept_tags do |t|
      t.string :name
      t.timestamps
    end

    add_index :concept_tags, :name
  end
end
