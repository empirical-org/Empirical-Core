class RemoveNullRestrictionFromFeedbackHistoryRatings < ActiveRecord::Migration
  def change
    change_column_null :feedback_history_ratings, :rating, true
  end
end
