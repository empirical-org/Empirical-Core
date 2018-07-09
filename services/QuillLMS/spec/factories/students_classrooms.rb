FactoryBot.define do
  factory :students_classrooms, class: StudentsClassrooms do
    student { create(:student) }
    classroom { create(:classroom) }
  end
end
