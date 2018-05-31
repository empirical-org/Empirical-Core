class CreateConceptTagResults < ActiveRecord::Migration
  def change
    create_table :concept_tag_results do |t|
      t.belongs_to :activity_session
      t.belongs_to :concept_tag
      t.json :metadata
    end
  end
end
