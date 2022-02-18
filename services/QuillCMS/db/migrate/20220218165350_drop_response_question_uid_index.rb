class DropResponseQuestionUidIndex < ActiveRecord::Migration[6.1]
  def up 
    remove_index :responses, :question_uid
  end

  def down
    add_index :responses, :question_uid
  end
end
