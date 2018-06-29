class AddQuestionSetIdToQuestion < ActiveRecord::Migration[5.2]
  def change
    add_reference :questions, :question_set, foreign_key: true
  end
end
