require 'rails_helper'

describe InvitationsController, type: :controller do
  it { should use_before_action :verify_current_user_owns_classrooms }
  it { should use_before_action :set_classroom_ids_and_inviteee_email }

  let(:classroom) { create(:classroom) }
  let(:user) { classroom.owner }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#create_coteacher_invitation' do
    it 'should set the classroom ids' do
      post :create_coteacher_invitation, classroom_ids: [classroom.id], invitee_email: "test@test.com"
      expect(assigns(:classroom_ids)).to eq([classroom.id.to_s])
    end

    it 'should give error for invalid email format' do
      post :create_coteacher_invitation, classroom_ids: [classroom.id], invitee_email: "test@testcom"
      expect(response.body).to eq({error: "Please make sure you've entered a valid email."}.to_json)
    end

    it 'should give error for empty email' do
      post :create_coteacher_invitation, classroom_ids: [classroom.id], invitee_email: ""
      expect(response.body).to eq({error: "Please make sure you've entered a valid email and selected at least one classroom."}.to_json)
    end

    it 'should give error for empty classroom ids' do
      post :create_coteacher_invitation, classroom_ids: [], invitee_email: "test@test.com"
      expect(response.body).to eq({error: "Please make sure you've entered a valid email and selected at least one classroom."}.to_json)
    end

    it 'should kick off the invitation email worker' do
      # only when environment is production or invite contains quill
      expect(InvitationEmailWorker).to receive(:perform_async)
      post :create_coteacher_invitation, classroom_ids: [classroom.id], invitee_email: "test@quill.org"
    end

    it 'should render the correct json' do
      post :create_coteacher_invitation, classroom_ids: [classroom.id], invitee_email: "test@test.com"
      expect(response.body).to eq ({invite_id: Invitation.last.id}.to_json)
      expect(Invitation.last.inviter).to eq user
      expect(Invitation.last.invitee_email).to eq "test@test.com"
      expect(Invitation.last.invitation_type).to eq Invitation::TYPES[:coteacher]
    end
  end

  describe '#destroy_pending_invitations_to_specific_invitee' do
    context 'when invitation exists' do
      let!(:invitation) { create(:invitation,
        invitation_type: "some type",
        invitee_email: "test@test.com",
        archived: false,
        inviter: user
      )}

      it 'should destroy the given invitation' do
        delete :destroy_pending_invitations_to_specific_invitee, invitation_type: "some type", invitee_email: "test@test.com"
        expect{ Invitation.find(invitation.id) }.to raise_exception ActiveRecord::RecordNotFound
      end
    end

    context 'when invitation does not exists' do
      it 'should respond with the error' do
        delete :destroy_pending_invitations_to_specific_invitee, invitation_type: "anything", invitee_email: "some@test.com"
        expect(response.body).to eq({error: "undefined method `destroy' for nil:NilClass"}.to_json)
      end
    end
  end

  describe '#destroy_pending_invitations_from_specific_inviter' do
    context 'when invitation exists' do
      let(:another_user) { create(:user) }
      let!(:invitation) { create(:invitation,
                                 invitation_type: "some type",
                                 invitee_email: user.email,
                                 archived: false,
                                 inviter: another_user
      )}

      it 'should destroy the given invitation' do
        delete :destroy_pending_invitations_from_specific_inviter, invitation_type: "some type", inviter_id: another_user.id
        expect{ Invitation.find(invitation.id) }.to raise_exception ActiveRecord::RecordNotFound
      end
    end

    context 'when invitation does not exists' do
      it 'should respond with the error' do
        delete :destroy_pending_invitations_from_specific_inviter,invitation_type: "some type", inviter_id: 1829
        expect(response.body).to eq({error: "undefined method `destroy' for nil:NilClass"}.to_json)
      end
    end
  end
end
