class AddAvatarColumnToAuthors < ActiveRecord::Migration[4.2]
  def up
    add_attachment :authors, :avatar
  end
end
