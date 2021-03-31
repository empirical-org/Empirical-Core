class CreateActivitySessionFeedbackHistory < ActiveRecord::Migration
  def change
    create_table :activity_session_feedback_histories do |t|
      t.string :activity_session_uid
      t.index :activity_session_uid, unique: true, name: :index_activity_sess_fb_histories_on_activity_session_uid
      t.string :feedback_history_session_uid
      t.index :feedback_history_session_uid, unique: true, name: :index_activity_sess_fb_histories_on_feedback_history_uid
    end
  end
end
