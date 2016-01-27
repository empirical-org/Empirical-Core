class AddIpLocationRefToUsers < ActiveRecord::Migration
  def change
    add_reference :users, :ip_location, index: true
  end
end
