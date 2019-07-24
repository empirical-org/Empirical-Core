class RemoveDescriptionFromAuthors < ActiveRecord::Migration
  def change
    remove_column :authors, :description
  end
end
