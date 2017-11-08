FactoryBot.define do
  factory :classrooms_teacher do
    user {FactoryBot.create(:teacher)}
    classroom {FactoryBot.create(:classroom)}
    role 'owner'
  end
end
