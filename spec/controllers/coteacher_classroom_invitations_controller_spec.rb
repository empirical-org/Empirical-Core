require 'rails_helper'

describe CoteacherClassroomInvitationsController, type: :controller do
  let(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let(:invite_one) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.first.id) }
  let(:pending_invitation) { invite_one.pending_invitation }
  let(:invite_two) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.second.id, pending_invitation_id: pending_invitation.id) }
  let(:invited_teacher) { create(:teacher, email: pending_invitation.invitee_email) }

  describe '#accept_pending_coteacher_invitations' do
    context 'user is signed in' do
      before do
        session[:user_id] = invited_teacher.id
      end

      context 'get' do
        it 'should accept one invitation' do
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
          expect(invited_teacher.classrooms_i_coteach.map(&:id)).to eq([invite_one.classroom_id])
          expect(response).to redirect_to dashboard_teachers_classrooms_path
        end

        it 'should accept multiple invitations' do
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id, invite_two.id]
          expect(invited_teacher.classrooms_i_coteach.map(&:id)).to eq([invite_one.classroom_id, invite_two.classroom_id])
          expect(response).to redirect_to dashboard_teachers_classrooms_path
        end
      end
      #
      # context 'post' do
      #
      # end
    end

    # context 'user is not signed in' do
    #   it 'should redirect to the login page' do
    #     get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
    #     expect(response.status
    #   end
    # end
  end
end
