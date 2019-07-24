class AddIpAddressToUsers < ActiveRecord::Migration
  def change
    add_column :users, :ip_address, :inet
  end
end
