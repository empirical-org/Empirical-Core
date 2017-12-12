class AddStatusColumnToInvitations < ActiveRecord::Migration
  def self.up
    add_column :invitations, :status, :string, default: 'pending'
    execute "ALTER TABLE invitations ADD CONSTRAINT check_status_is_valid CHECK (status IN ('pending', 'accepted', 'rejected') AND status IS NOT null)"
    add_index :invitations, :status
  end

  def self.down
    remove_column :invitations, :status
    execute "ALTER TABLE classrooms_teachers DROP CONSTRAINT check_status_is_valid"
    remove_index :invitations, :status
  end
end
