class AddArchivedColumnAndRemoveStatusColumnFromInvitations < ActiveRecord::Migration[4.2]
  def change
    add_column :invitations, :archived, :boolean, default: false
    remove_column :invitations, :status
  end
end
