class AddActivityTypeToConceptFeedback < ActiveRecord::Migration
  def up
    add_column :concept_feedbacks, :activity_type, :string
    ConceptFeedback.update_all(activity_type: 'connect')
    remove_index :concept_feedbacks, :uid
    add_index :concept_feedbacks, [:uid, :activity_type], unique: true
    add_index :concept_feedbacks, :activity_type
    change_column_null :concept_feedbacks, :activity_type, false
  end
  def down
    remove_column :concept_feedbacks, :activity_type
  end
end
