class AddFieldsToConcepts < ActiveRecord::Migration
  def change
    add_column :concepts, :parent_id, :integer
    add_column :concepts, :uid, :string
  end
end
