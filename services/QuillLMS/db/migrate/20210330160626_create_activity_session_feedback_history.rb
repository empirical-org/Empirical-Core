class CreateActivitySessionFeedbackHistory < ActiveRecord::Migration
  def change
    create_table :feedback_sessions do |t|
      t.string :activity_session_uid
      t.index :activity_session_uid, unique: true
      t.string :uid
      t.index :uid, unique: true
    end
  end
end
