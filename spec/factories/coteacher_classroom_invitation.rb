FactoryBot.define do
  factory :coteacher_classroom_invitation do
    pending_invitation_id { create(:pending_coteacher_invitation).id }
    classroom_id { create(:classroom).id }
  end
end
