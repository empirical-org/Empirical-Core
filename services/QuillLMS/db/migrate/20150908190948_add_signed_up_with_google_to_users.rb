class AddSignedUpWithGoogleToUsers < ActiveRecord::Migration
  def change
    add_column :users, :signed_up_with_google, :boolean, default: false
  end
end
