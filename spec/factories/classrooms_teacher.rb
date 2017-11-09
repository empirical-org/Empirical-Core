FactoryBot.define do
  factory :classrooms_teacher do
    user {create(:teacher)}
    classroom {create(:classroom)}
    role 'owner'
  end
end
