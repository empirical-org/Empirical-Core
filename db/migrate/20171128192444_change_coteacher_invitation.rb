class ChangeCoteacherInvitation < ActiveRecord::Migration
  def change
    add_column :coteacher_invitations, :invitation_type, :string
    add_index :coteacher_invitations, [:invitee_email, :inviter_id, :invitation_type], unique: true
    remove_index :index_coteacher_invitations_on_invitee_email_and_inviter_id
    rename_table :coteacher_invitations, :pending_invitations
  end
end
