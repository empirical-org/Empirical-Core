require 'rails_helper'

RSpec.describe CoteacherClassroomInvitation, type: :model do
  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:invite_one) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.first.id) }
  let!(:pending_invitation) { invite_one.invitation }
  let!(:invite_two) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.second.id, invitation_id: pending_invitation.id) }

  describe '#update_parent_invitation' do
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
end
