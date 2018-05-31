class CoteacherClassroomInvitations < ActiveRecord::Migration
  def change
    create_table :coteacher_classroom_invitations do |t|
      t.integer :pending_invitation_id, null: false, index: true, foreign_key: true
      t.integer :classroom_id, null: false, index: true, foreign_key: true
      t.timestamps
    end
    add_index :coteacher_classroom_invitations, [:pending_invitation_id, :classroom_id], name: :classroom_invitee_index, unique: true
  end
end
