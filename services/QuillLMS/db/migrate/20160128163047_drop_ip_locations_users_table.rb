class DropIpLocationsUsersTable < ActiveRecord::Migration
  def change
    drop_table :ip_locations_users
  end
end
