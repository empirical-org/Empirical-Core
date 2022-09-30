# frozen_string_literal: true

require 'rails_helper'

describe InvitationsController, type: :controller do
  let(:classroom) { create(:classroom) }
  let(:user) { classroom.owner }

  before do
    # It is necessary to load Invitation here explicitly.
    # Otherwise, RSpec will stub Invitation as a Module (rather than an ActiveRecord::Base descendent)
    # when stub_const is called within a spec.
    # Reference:
    # https://stackoverflow.com/questions/32563359/stubing-a-model-constant-for-assosiation-undefined-method-relation-delegate-cl
    # rubocop:disable all
    CoteacherClassroomInvitation
    # rubocop:enable all
    allow(controller).to receive(:current_user) { user }
  end

  it { should use_before_action :verify_current_user_owns_classrooms }
  it { should use_before_action :set_classroom_ids_and_inviteee_email }

  describe '#create_coteacher_invitation' do
    it 'should set the classroom ids' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@test.com" }
      expect(assigns(:classroom_ids)).to eq([classroom.id.to_s])
    end

    it 'should give error for invalid email format' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@testcom" }
      expect(response.body).to eq({error: "Please make sure you've entered a valid email."}.to_json)
    end

    it 'should give error when multiple emails entered' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "email@one.com email@two.com" }
      expect(response.body).to eq({error: "Please make sure you've entered a valid email."}.to_json)
    end

    it 'should give error for empty email' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "" }
      expect(response.body).to eq({error: "Please make sure you've entered a valid email and selected at least one classroom."}.to_json)
    end

    it 'should give error for a nil email' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id] }
      expect(response.body).to eq({error: "Please make sure you've entered a valid email and selected at least one classroom."}.to_json)
    end

    it 'should give error for empty classroom ids' do
      post :create_coteacher_invitation,
        params: {
          classroom_ids: [],
          invitee_email: "test@test.com"
        },
        as: :json

      expect(response.body).to eq({error: "Please make sure you've entered a valid email and selected at least one classroom."}.to_json)
    end

    it 'should give error when single class coteacher limit is exceeded' do
      stub_const("CoteacherClassroomInvitation::MAX_COTEACHER_INVITATIONS_PER_CLASS", 0)
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@test.com" }
      expect(response.body).to eq({error: "The maximum limit of #{CoteacherClassroomInvitation::MAX_COTEACHER_INVITATIONS_PER_CLASS} coteacher invitations have already been issued for class #{classroom.id}"}.to_json)
    end

    it 'should give error when user issues too many invites in a time period' do
      stub_const("Invitation::MAX_COTEACHER_INVITATIONS_PER_TIME", 0)
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@test.com" }
      expect(response.body).to eq({error: "User #{subject.current_user.id} has reached the maximum of #{Invitation::MAX_COTEACHER_INVITATIONS_PER_TIME} coteacher invitations that they can issue in a #{Invitation::MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS} hour period"}.to_json)
    end

    it 'should kick off the invitation email worker' do
      # only when environment is production or invite contains quill
      expect(InvitationEmailWorker).to receive(:perform_async)
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@quill.org" }
    end

    it 'should render the correct json' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@test.com" }
      expect(response.body).to eq ({invite_id: Invitation.last.id}.to_json)
      expect(Invitation.last.inviter).to eq user
      expect(Invitation.last.invitee_email).to eq "test@test.com"
      expect(Invitation.last.invitation_type).to eq Invitation::TYPES[:coteacher]
    end

    it 'should correct an email with spaces' do
      post :create_coteacher_invitation, params: { classroom_ids: [classroom.id], invitee_email: "test@test .com" }

      invite = Invitation.last

      expect(response.body).to eq ({invite_id: invite.id}.to_json)
      expect(invite.inviter).to eq user
      expect(invite.invitee_email).to eq "test@test.com"
      expect(invite.invitation_type).to eq Invitation::TYPES[:coteacher]
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
        delete :destroy_pending_invitations_to_specific_invitee, params: { invitation_type: "some type", invitee_email: "test@test.com" }
        expect{ Invitation.find(invitation.id) }.to raise_exception ActiveRecord::RecordNotFound
      end
    end

    context 'when invitation does not exists' do
      it 'should respond with the error' do
        delete :destroy_pending_invitations_to_specific_invitee, params: { invitation_type: "anything", invitee_email: "some@test.com" }
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
        delete :destroy_pending_invitations_from_specific_inviter, params: { invitation_type: "some type", inviter_id: another_user.id }
        expect{ Invitation.find(invitation.id) }.to raise_exception ActiveRecord::RecordNotFound
      end
    end

    context 'when invitation does not exists' do
      it 'should respond with the error' do
        delete :destroy_pending_invitations_from_specific_inviter, params: { invitation_type: "some type", inviter_id: 1829 }
        expect(response.body).to eq({error: "undefined method `destroy' for nil:NilClass"}.to_json)
      end
    end
  end
end
