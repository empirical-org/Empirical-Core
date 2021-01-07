require 'rails_helper'

describe CoteacherClassroomInvitationsController, type: :controller do
  let(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let(:invite_one) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.first.id) }
  let!(:pending_invitation) { invite_one.invitation }
  let(:invite_two) { create(:coteacher_classroom_invitation, classroom_id: teacher.classrooms_i_own.second.id, invitation_id: pending_invitation.id) }
  let(:invited_teacher) { User.find_by_email(pending_invitation.invitee_email) }
  let(:unaffiliated_teacher) { create(:teacher) }
  let(:analyzer) { double(:analyzer, track: true, track_with_attributes: true) }

  describe '#accept_pending_coteacher_invitations' do
    context 'user is signed in' do
      before do
        session[:user_id] = invited_teacher.id
      end

      context 'get' do
        it 'should accept one invitation' do
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
          expect(invited_teacher.classrooms_i_coteach.map(&:id)).to match_array([invite_one.classroom_id])
          expect(response).to redirect_to dashboard_teachers_classrooms_path
        end

        it 'should accept multiple invitations' do
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id, invite_two.id]
          expect(invited_teacher.classrooms_i_coteach.map(&:id)).to match_array([invite_one.classroom_id, invite_two.classroom_id])
          expect(response).to redirect_to dashboard_teachers_classrooms_path
        end
      end

      context 'post' do
        before do
          allow(Analyzer).to receive(:new) { analyzer }
        end

        it 'should accept one invitation' do
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
          expect(invited_teacher.classrooms_i_coteach.map(&:id)).to match_array([invite_one.classroom_id])
        end

        it 'should accept multiple invitations' do
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id, invite_two.id]
          expect(invited_teacher.classrooms_i_coteach.map(&:id)).to match_array([invite_one.classroom_id, invite_two.classroom_id])
        end

        it 'should track event' do
          expect(analyzer).to receive(:track).with(invited_teacher, SegmentIo::BackgroundEvents::COTEACHER_ACCEPTANCE)
          get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id, invite_two.id]
        end
      end
    end

    context 'user is not signed in' do
      it 'should redirect to the login page' do
        get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
        expect(response).to redirect_to new_session_path
      end
    end

    context 'user does not have access' do
      it 'should redirect to the login page' do
        session[:user_id] = unaffiliated_teacher.id
        get :accept_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
        expect(response).to redirect_to new_session_path
      end
    end
  end

  describe '#reject_pending_coteacher_invitations' do
    context 'user is signed in' do
      before do
        session[:user_id] = invited_teacher.id
      end

      context 'get' do
        it 'should reject one invitation' do
          get :reject_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
          expect { invite_one.reload }.to raise_error ActiveRecord::RecordNotFound
          expect(response).to redirect_to dashboard_teachers_classrooms_path
        end

        it 'should reject multiple invitations' do
          get :reject_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id, invite_two.id]
          expect { invite_one.reload }.to raise_error ActiveRecord::RecordNotFound
          expect { invite_two.reload }.to raise_error ActiveRecord::RecordNotFound
          expect(response).to redirect_to dashboard_teachers_classrooms_path
        end
      end

      context 'post' do
        it 'should reject one invitation' do
          get :reject_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
          expect { invite_one.reload }.to raise_error ActiveRecord::RecordNotFound
        end

        it 'should reject multiple invitations' do
          get :reject_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id, invite_two.id]
          expect { invite_one.reload }.to raise_error ActiveRecord::RecordNotFound
          expect { invite_two.reload }.to raise_error ActiveRecord::RecordNotFound
        end
      end
    end

    context 'user is not signed in' do
      it 'should redirect to the login page' do
        get :reject_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
        expect(response).to redirect_to new_session_path
      end
    end

    context 'user does not have access' do
      it 'should redirect to the login page' do
        session[:user_id] = unaffiliated_teacher.id
        get :reject_pending_coteacher_invitations, coteacher_invitation_ids: [invite_one.id]
        expect(response).to redirect_to new_session_path
      end
    end
  end
end
