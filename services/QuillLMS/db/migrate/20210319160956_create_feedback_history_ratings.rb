class CreateFeedbackHistoryRatings < ActiveRecord::Migration
  def change
    create_table :feedback_history_ratings do |t|
      t.string :rating, null: false
      t.references :feedback_history, null: false
      t.references :user, null: false
      t.timestamps null: false
    end
  end
end
