class AddIndexAndDefaultCountValuesToResponses < ActiveRecord::Migration[5.1]
  def change
    add_index :responses, [:text, :question_uid], unique: true
    change_column_default(:responses, :count, 1)
    change_column_default(:responses, :first_attempt_count, 0)
    change_column_default(:responses, :child_count, 0)
  end
end
