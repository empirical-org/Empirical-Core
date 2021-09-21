class AddAvatarToAuthors < ActiveRecord::Migration[4.2]
  def change
    add_column :authors, :avatar, :text
  end
end
