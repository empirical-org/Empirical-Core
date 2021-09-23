class AddFieldsToConcepts < ActiveRecord::Migration[4.2]
  def change
    add_column :concepts, :parent_id, :integer
    add_column :concepts, :uid, :string, null: false
  end
end
