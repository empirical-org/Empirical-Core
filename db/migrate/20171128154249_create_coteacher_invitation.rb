class CreateCoteacherInvitation < ActiveRecord::Migration
  def change
    create_table :coteacher_invitations do |t|
      t.string :invitee_email, null: false, index: true
      t.integer :inviter_id, null: false, index: true
      t.timestamps
    end
    add_index :coteacher_invitations, [:invitee_email, :inviter_id], unique: true
  end
end
