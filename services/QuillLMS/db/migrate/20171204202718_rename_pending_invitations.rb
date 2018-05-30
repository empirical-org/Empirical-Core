class RenamePendingInvitations < ActiveRecord::Migration
  def change
    rename_table :pending_invitations, :invitations
  end
end
