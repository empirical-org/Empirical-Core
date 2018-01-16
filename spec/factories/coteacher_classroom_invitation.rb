FactoryBot.define do
  factory :coteacher_classroom_invitation do
    sequence(:id)
    classroom_id { create(:classroom).id }

    invitation_id {
      create(:pending_coteacher_invitation,
        inviter_id: Classroom.find(classroom_id).owner.id
      ).id }
  end
end
