# frozen_string_literal: true

class UpdateFeedbackHistoryDefaultVersion < ActiveRecord::Migration[6.1]
  def change
    change_column_default :feedback_histories, :activity_version, 1
  end
end
