class AddQuestionCountToActivities < ActiveRecord::Migration[7.0]
  def change
    add_column :activities, :question_count, :integer, limit: 2, null: false, default: 0
  end
end
