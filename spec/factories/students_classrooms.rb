FactoryBot.define do
  factory :students_classrooms do
    student { create(:student) }
    classroom { create(:classroom) }
  end
end
