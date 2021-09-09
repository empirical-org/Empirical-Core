class ChangeCoteacherInvitation < ActiveRecord::Migration[4.2]
  def change
    add_column :coteacher_invitations, :invitation_type, :string
    rename_table :coteacher_invitations, :pending_invitations
  end
end
