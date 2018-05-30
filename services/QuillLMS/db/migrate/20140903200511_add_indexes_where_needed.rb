class AddIndexesWhereNeeded < ActiveRecord::Migration
  def change
    add_index :activity_sessions, :user_id
    add_index :activity_sessions, :activity_id
    add_index :activity_sessions, :classroom_activity_id
    add_index :activity_sessions, :state

    add_index :classrooms, :code

    add_index :classroom_activities, :classroom_id
    add_index :classroom_activities, :activity_id
    add_index :classroom_activities, :unit_id

    add_index :activities, :activity_classification_id
    add_index :activities, :topic_id

    add_index :users, :email
    add_index :users, :active
    add_index :users, :token
    add_index :users, :role
    add_index :users, :username
  end
end
