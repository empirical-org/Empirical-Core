class CreateIpLocationsUsers < ActiveRecord::Migration
  def change
    create_table :ip_locations_users, id: false do |t|
      t.references :ip_location, null: false
      t.references :users, null: false
    end
  end

end
