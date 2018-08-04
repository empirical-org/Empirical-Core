require 'rails_helper'

describe InvitationEmailWorker do
  describe '#perform' do
    context 'when invitee is a quill user' do
      let(:user) { create(:user) }
      let(:friend) { create(:user) }
      let!(:invitation) { create(:invitation, inviter: user, invitee_email: friend.email) }

      before do
        allow_any_instance_of(Invitation).to receive(:coteacher_classroom_invitations) { [double(:invitation, classroom: double(:classroom, name: "classroom"), id: "id")] }
      end

      it 'should send the invitation to existing user' do
        expect_any_instance_of(User).to receive(:send_invitation_to_existing_user).with(invitation.attributes.merge({
           inviter_name: user.name,
           inviter_email: user.email,
           classroom_names: ["classroom"],
           coteacher_classroom_invitation_ids: ["id"],
           invitee_first_name: friend.first_name
        }))
        subject.perform(invitation.id)
      end
    end

    context 'when invitee is not a quill user' do
      it 'should send the invitation to non existing user' do

      end
    end
  end
end