class AddQuestionTypeToQuestions < ActiveRecord::Migration
  def up
    add_reference :questions, :question_type, :foreign_key => true, :null => false, :default => 1
  end
  def down
    remove_column :questions, :question_type
  end
end
