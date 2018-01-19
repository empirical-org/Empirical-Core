FactoryBot.define do
  factory :classrooms_teacher do
    sequence(:id)
    user          { create(:teacher) }
    classroom     { create(:classroom) }
    role          ClassroomsTeacher::ROLE_TYPES[:owner]

    factory :coteacher_classrooms_teacher do
      role ClassroomsTeacher::ROLE_TYPES[:coteacher]
    end
  end
end
