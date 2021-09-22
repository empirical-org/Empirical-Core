class RenamePendingInvitations < ActiveRecord::Migration[4.2]
  def change
    rename_table :pending_invitations, :invitations
  end
end
