class AddFollowUpActivityToActivities < ActiveRecord::Migration[4.2]
  def change
    add_reference :activities, :follow_up_activity, foreign_key: false
  end
end
