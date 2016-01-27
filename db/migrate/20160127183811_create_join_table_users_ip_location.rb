class CreateJoinTableUsersIpLocation < ActiveRecord::Migration
  def change
    create_join_table :users, :ip_locations do |t|
      t.index [:user_id, :ip_location_id]
      t.index [:ip_location_id, :user_id]
    end
  end
end
