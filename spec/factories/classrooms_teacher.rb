FactoryBot.define do
  factory :classrooms_teacher do
    user {teacher}
    classroom {classroom}
    role 'owner'
  end
end
