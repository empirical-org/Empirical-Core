class AddDescriptionToConcepts < ActiveRecord::Migration
  def change
    add_column :concepts, :description, :text
  end
end
