FactoryBot.define do
  factory :classrooms_teacher do
    if ClassroomsTeacher.where(user: User.first, classroom: Classroom.first).none?
      user {User.first || FactoryBot.create(:teacher)}
      classroom {Classroom.first || FactoryBot.create(:classroom)}
    else
      user {FactoryBot.create(:teacher)}
      classroom {FactoryBot.create(:classroom)}
    end
    role 'owner'
  end
end
