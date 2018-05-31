class AddAvatarColumnToAuthors < ActiveRecord::Migration
  def up
    add_attachment :authors, :avatar
  end
end
