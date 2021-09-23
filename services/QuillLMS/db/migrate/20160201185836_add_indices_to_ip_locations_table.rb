class AddIndicesToIpLocationsTable < ActiveRecord::Migration[4.2]
  def change
    add_index :ip_locations, :user_id
    add_index :ip_locations, :zip
  end
end
