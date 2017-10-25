class RemoveAvatarFromAuthors < ActiveRecord::Migration
  def change
    remove_attachment :authors, :avatar
  end
end
