class RemoveUniqueConstrainsFromUserAndSchoolSubscriptions < ActiveRecord::Migration
  def change
    remove_index :user_subscriptions, :user_id
    add_index :user_subscriptions, :user_id, unique: false
    remove_index :school_subscriptions, :school_id
    add_index :school_subscriptions, :school_id, unique: false
  end
end
