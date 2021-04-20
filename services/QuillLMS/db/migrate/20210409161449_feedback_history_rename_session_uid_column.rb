class FeedbackHistoryRenameSessionUidColumn < ActiveRecord::Migration
  def change
    rename_column :feedback_histories, :activity_session_uid, :feedback_session_uid
  end
end
