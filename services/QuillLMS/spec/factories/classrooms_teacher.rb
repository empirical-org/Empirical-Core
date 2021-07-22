FactoryBot.define do
  factory :classrooms_teacher do
    user          { create(:teacher) }
    classroom     { create(:classroom) }
    role          ClassroomsTeacher::ROLE_TYPES[:owner]
    order { nil }

    factory :coteacher_classrooms_teacher do
      role ClassroomsTeacher::ROLE_TYPES[:coteacher]
    end
  end
end
