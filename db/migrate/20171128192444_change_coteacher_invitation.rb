class ChangeCoteacherInvitation < ActiveRecord::Migration
  def change
    add_column :coteacher_invitations, :invitation_type, :string
    rename_table :coteacher_invitations, :pending_invitations
  end
end
