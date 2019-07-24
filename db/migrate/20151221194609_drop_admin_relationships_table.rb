class DropAdminRelationshipsTable < ActiveRecord::Migration
  def change
    drop_table :admin_relationships
  end
end
