require 'rails_helper'

RSpec.describe CoteacherClassroomInvitation, type: :model do
  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:classroom_one) { teacher.classrooms_i_own.first }

  describe '#update_parent_invitation' do
    let!(:invite_one) { create(:coteacher_classroom_invitation, classroom_id: classroom_one.id) }
    let!(:pending_invitation) { invite_one.invitation }
    let!(:invite_two) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.second.id, invitation_id: pending_invitation.id) }

    it 'should not archive the parent invitation if children still exist' do
      invite_one.destroy
      expect(pending_invitation.reload.archived).not_to be
    end

    it 'should archive the parent if no children still exist' do
      invite_one.destroy
      invite_two.destroy
      expect(pending_invitation.reload.archived).to be
    end
  end

  describe '#prevent_saving_if_classrooms_teacher_association_exists' do
    let!(:coteacher) { create(:coteacher_classrooms_teacher, classroom: classroom_one).user }
    let!(:invitation) { create(:pending_coteacher_invitation, inviter_id: teacher.id, invitee_email: coteacher.email) }

    it 'should not save if teacher is already a coteacher' do
      expect {
        coteacher_classroom_invitation = create(:coteacher_classroom_invitation, classroom_id: classroom_one.id, invitation_id: invitation.id)
      }.to raise_error(ActiveRecord::RecordNotSaved)
    end
  end
end
