FactoryBot.define do
  factory :invitation do
    invitee_email { create(:user).email }
    inviter_id { create(:teacher).id }

    factory :pending_coteacher_invitation do
      invitee_email { create(:teacher).email }
      invitation_type Invitation::TYPES[:coteacher]
      archived false
    end
  end
end
