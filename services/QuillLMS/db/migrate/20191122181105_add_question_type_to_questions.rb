class AddQuestionTypeToQuestions < ActiveRecord::Migration[4.2]
  def up
    add_column :questions, :question_type, :string
    add_index :questions, :question_type
    Question.update_all(question_type: 'connect_sentence_combining')
    change_column_null :questions, :question_type, false
  end
  def down
    remove_column :questions, :question_type
  end
end
