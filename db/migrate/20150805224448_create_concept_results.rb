class CreateConceptResults < ActiveRecord::Migration
  def change
    create_table :concept_results do |t|
      t.integer "activity_session_id"
      t.integer "concept_id",      null: false
      t.json    "metadata"
    end
  end
end
