# frozen_string_literal: true

class CreateFeedbackHistoryRatings < ActiveRecord::Migration[4.2]
  def change
    create_table :feedback_history_ratings do |t|
      t.boolean :rating,  null: false
      t.references :feedback_history, null: false
      t.references :user, null: false, foreign_key: true
      t.timestamps null: false
    end

    add_index :feedback_history_ratings,
      [:user_id, :feedback_history_id],
      unique: true,
      name: 'feedback_history_ratings_uniqueness'
  end
end
