class AddParentIndexesToResponse < ActiveRecord::Migration[5.1]
  def change
    add_index :responses, :parent_id
    add_index :responses, :parent_uid
  end
end
