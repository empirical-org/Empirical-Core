FactoryBot.define do
  factory :pending_invitation do
    invitee_email { Faker::Internet.safe_email }

    factory :pending_coteacher_invitation do
      inviter_id { create(:teacher).id }
      invitation_type PendingInvitation::TYPES[:coteacher]
    end
  end
end
