FactoryBot.define do
  factory :pending_invitation do
    sequence(:id) { |n| n } # not sure why this would be necessary; something in our configuration is likely broken
    invitee_email { Faker::Internet.safe_email }
    inviter_id { create(:teacher).id }

    factory :pending_coteacher_invitation do
      invitation_type PendingInvitation::TYPES[:coteacher]
    end
  end
end
