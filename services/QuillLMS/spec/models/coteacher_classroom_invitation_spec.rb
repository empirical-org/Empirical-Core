# == Schema Information
#
# Table name: coteacher_classroom_invitations
#
#  id            :integer          not null, primary key
#  created_at    :datetime
#  updated_at    :datetime
#  classroom_id  :integer          not null
#  invitation_id :integer          not null
#
# Indexes
#
#  classroom_invitee_index                                 (invitation_id,classroom_id) UNIQUE
#  index_coteacher_classroom_invitations_on_classroom_id   (classroom_id)
#  index_coteacher_classroom_invitations_on_invitation_id  (invitation_id)
#
require 'rails_helper'

RSpec.describe CoteacherClassroomInvitation, type: :model do
  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:classroom_one) { teacher.classrooms_i_own.first }

  describe '#tracking' do
    let!(:invite_one) { build(:coteacher_classroom_invitation, classroom_id: classroom_one.id) }
    let(:analyzer) { double(:analyzer, track_with_attributes: true) }

    before do
      allow(Analyzer).to receive(:new) { analyzer }
    end

    it 'should track coteacher invitation' do
      expect(analyzer).to receive(:track_with_attributes).with(
        invite_one.invitation.inviter,
        SegmentIo::BackgroundEvents::COTEACHER_INVITATION,
        { properties: { invitee_email: invite_one.invitation.invitee_email } }
      )
      invite_one.save
    end
  end

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

  describe '#validate_invitation_limit' do
    let!(:invitation) { create(:invitation) }

    it 'should not save if a classroom has too many existing coteacher invitations already' do
      # Stub the limit to 1 so that we don't have to create 50 test records just to test this
      stub_const("CoteacherClassroomInvitations::MAX_COTEACHER_INVITATIONS_PER_CLASS", 1)
      max_invites = CoteacherClassroomInvitation::MAX_COTEACHER_INVITATIONS_PER_CLASS
      max_invites.times {
        create(:coteacher_classroom_invitation, classroom_id: classroom_one.id)
      }
      over_limit = CoteacherClassroomInvitation.create(classroom_id: classroom_one.id, invitation: invitation)
      expect(over_limit.valid?).to eq(false)
    end

    it 'should save if the invite limit hasn not been reached' do
      stub_const("CoteacherClassroomInvitations::MAX_COTEACHER_INVITATIONS_PER_CLASS", 1)
      under_limit = CoteacherClassroomInvitation.create(classroom_id: classroom_one.id, invitation: invitation)
      expect(under_limit.valid?).to eq(true)
    end
  end
end
