class AddDescriptionToAuthor < ActiveRecord::Migration[4.2]
  def change
    add_column :authors, :description, :text
  end
end
