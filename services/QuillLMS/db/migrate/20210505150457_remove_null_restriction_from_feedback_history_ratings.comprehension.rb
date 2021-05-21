# This migration comes from comprehension (originally 20210505150340)
class RemoveNullRestrictionFromFeedbackHistoryRatings < ActiveRecord::Migration
  def change
    change_column_null :feedback_history_ratings, :rating, true
  end
end
