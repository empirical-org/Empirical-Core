class CreateIpLocations < ActiveRecord::Migration
  def change
    create_table :ip_locations do |t|
      t.string :country
      t.string :city
      t.string :state
      t.integer :zip
      t.integer :user_id

      t.timestamps
    end
  end
end
