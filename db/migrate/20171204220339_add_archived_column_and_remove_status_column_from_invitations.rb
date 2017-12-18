class AddArchivedColumnAndRemoveStatusColumnFromInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :archived, :boolean, default: false
    remove_column :invitations, :status
  end
end
