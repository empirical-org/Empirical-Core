class DropResponseParentUidIndex < ActiveRecord::Migration[6.1]
  def up
    remove_index :responses, :parent_uid
  end

  def down
    add_index :responses, :parent_uid
  end
end
