class AddDescriptionToConcepts < ActiveRecord::Migration[4.2]
  def change
    add_column :concepts, :description, :text
  end
end
