class AddQuestionTypeToConceptResults < ActiveRecord::Migration
  def change
    add_column :concept_results, :question_type, :string, :null => true
    add_index :concept_results, :question_type
  end
end
