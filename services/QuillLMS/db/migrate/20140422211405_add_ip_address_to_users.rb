class AddIpAddressToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :ip_address, :inet
  end
end
