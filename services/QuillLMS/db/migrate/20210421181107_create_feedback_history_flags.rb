class CreateFeedbackHistoryFlags < ActiveRecord::Migration[4.2]
  def change
    create_table :feedback_history_flags do |t|
      t.references :feedback_history, null: false
      t.string :flag, null: false
      t.timestamps null: false
    end
  end
end
