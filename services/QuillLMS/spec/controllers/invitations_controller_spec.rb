require 'rails_helper'

describe InvitationsController, type: :controller do
  let(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:pending_coteacher_invitation) {create(:pending_coteacher_invitation, inviter_id: teacher.id)}
  let(:invited_teacher) { User.find_by_email(pending_coteacher_invitation.invitee_email) }

  describe '#destroy_pending_invitations_to_specific_invitee' do
    context 'user is signed in' do
      before do
        session[:user_id] = teacher.id
      end

      context 'delete' do
        it 'should delete the pending invitations from current user to the invitee' do
          expect(pending_coteacher_invitation).to be
          delete :destroy_pending_invitations_to_specific_invitee, invitation_type: Invitation::TYPES[:coteacher], invitee_email: pending_coteacher_invitation.invitee_email
          expect(Invitation.find_by_id(pending_coteacher_invitation.id)).not_to be
        end
      end
    end
  end

  describe '#destroy_pending_invitations_from_specific_inviter' do
    context 'user is signed in' do
      before do
        session[:user_id] = invited_teacher.id
      end

      context 'delete' do
        it 'should delete the pending invitations from current user to the invitee' do
          expect(pending_coteacher_invitation).to be
          delete :destroy_pending_invitations_from_specific_inviter, invitation_type: Invitation::TYPES[:coteacher], invitee_email: pending_coteacher_invitation.invitee_email, inviter_id: teacher.id
          expect(Invitation.find_by_id(pending_coteacher_invitation.id)).not_to be
        end
      end
    end
  end
end
