class FixBadActivityIdOnSession < ActiveRecord::Migration
  def change

   broken_sessions = ActivitySession.unscoped.joins(:classroom_activity).includes(:classroom_activity).where("activity_sessions.activity_id is null AND classroom_activity_id is NOT NULL")

   broken_sessions.each do |as|
     as.update_columns(activity_id: as.classroom_activity.activity_id)
   end


  end
end
