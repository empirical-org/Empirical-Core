class CreateIpLocations < ActiveRecord::Migration
  def change
    create_table :ip_locations do |t|
      t.string :city
      t.string :state
      t.integer :zip

      t.timestamps
    end
  end
end
