# frozen_string_literal: true

FactoryBot.define do
  factory :coteacher_classroom_invitation do
    classroom { create(:classroom) }
    invitation { create(:pending_coteacher_invitation, inviter_id: Classroom.find(classroom_id).owner.id) }
  end
end
