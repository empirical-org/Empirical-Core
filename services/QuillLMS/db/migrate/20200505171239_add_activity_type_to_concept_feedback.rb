class AddActivityTypeToConceptFeedback < ActiveRecord::Migration
  def up
    add_column :concept_feedbacks, :activity_type, :string
    add_index :concept_feedbacks, :activity_type
    ConceptFeedback.update_all(activity_type: 'connect')
    change_column_null :concept_feedbacks, :activity_type, false
  end
  def down
    remove_column :concept_feedbacks, :activity_type
  end
end
