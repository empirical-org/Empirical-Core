class RemoveIndexFromInvitations < ActiveRecord::Migration[4.2]
  def change
    remove_index :invitations, name: :index_invitations_on_invitee_email_and_inviter_id
  end
end
