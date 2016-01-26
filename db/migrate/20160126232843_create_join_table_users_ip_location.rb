class CreateJoinTableUsersIpLocation < ActiveRecord::Migration
  def change


    create_table :ip_locations_users, id: false do |t|
      t.integer :ip_locations_id, :null => true
      t.integer :user_id
    end

    add_index :ip_locations_users, :user_id
    add_index :ip_locations_users, :ip_locations_id
    add_index :ip_locations_users, [:ip_locations_id, :user_id]

  end
end
