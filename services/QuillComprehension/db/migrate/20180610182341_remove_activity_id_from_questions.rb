class RemoveActivityIdFromQuestions < ActiveRecord::Migration[5.2]
  def change
    remove_column :questions, :activity_id
  end
end
