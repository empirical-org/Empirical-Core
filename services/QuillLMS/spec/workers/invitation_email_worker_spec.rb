# frozen_string_literal: true

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
        # The mocked invitation has 9-digit millisecond precision when it is generated,
        # but when it is "retrieved from the db", it has 6-digit precision.  Since the
        # perform call below is going to retrieve the item from the db, it needs to be
        # compared to the value as "retrieved" from the db
        db_invitation = Invitation.find_by(id: invitation.id)
        expect_any_instance_of(User).to receive(:send_invitation_to_existing_user).with(db_invitation.attributes.merge({
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
      let(:user) { create(:user) }
      let!(:invitation1) { create(:invitation, inviter: user, invitee_email: "test@email.com") }

      before do
        allow_any_instance_of(Invitation).to receive(:coteacher_classroom_invitations) { [double(:invitation, classroom: double(:classroom, name: "classroom"), id: "id")] }
      end

      it 'should send the invitation to non existing user' do
        # The mocked invitation has 9-digit millisecond precision when it is generated,
        # but when it is "retrieved from the db", it has 6-digit precision.  Since the
        # perform call below is going to retrieve the item from the db, it needs to be
        # compared to the value as "retrieved" from the db
        db_invitation1 = Invitation.find_by(id: invitation1.id)
        expect_any_instance_of(User).to receive(:send_invitation_to_non_existing_user).with(db_invitation1.attributes.merge({
          inviter_name: user.name,
          inviter_email: user.email,
          classroom_names: ["classroom"],
          coteacher_classroom_invitation_ids: ["id"],
          referral_code: invitation1.inviter.referral_code
        }))
        subject.perform(invitation1.id)
      end
    end
  end
end
