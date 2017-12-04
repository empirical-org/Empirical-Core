FactoryBot.define do
  factory :invitation do
    sequence(:id) { |n| n } # not sure why this would be necessary; something in our configuration is likely broken
    invitee_email { Faker::Internet.safe_email }
    inviter_id { create(:teacher).id }

    factory :pending_coteacher_invitation do
      invitation_type Invitation::TYPES[:coteacher]
      status Invitation::STATUSES[:pending]
    end
  end
end
