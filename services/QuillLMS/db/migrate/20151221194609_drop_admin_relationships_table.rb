class DropAdminRelationshipsTable < ActiveRecord::Migration[4.2]
  def change
    drop_table :admin_relationships
  end
end
