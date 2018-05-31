class CreateConceptTags < ActiveRecord::Migration
  def change
    create_table :concept_tags do |t|
      t.string :name
      t.timestamps
    end

    add_index :concept_tags, :name
  end
end
