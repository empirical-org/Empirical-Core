class DropIpLocationsUsersTable < ActiveRecord::Migration[4.2]
  def change
    drop_table :ip_locations_users
  end
end
