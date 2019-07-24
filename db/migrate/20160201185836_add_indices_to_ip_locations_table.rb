class AddIndicesToIpLocationsTable < ActiveRecord::Migration
  def change
    add_index :ip_locations, :user_id
    add_index :ip_locations, :zip
  end
end
