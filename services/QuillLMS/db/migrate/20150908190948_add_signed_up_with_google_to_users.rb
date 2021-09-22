class AddSignedUpWithGoogleToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :signed_up_with_google, :boolean, default: false
  end
end
