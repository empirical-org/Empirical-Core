FactoryBot.define do
  factory :classrooms_teacher do
    sequence(:id) { |n| n } # not sure why this would be necessary; something in our configuration is likely broken 
    user {create(:teacher)}
    classroom {create(:classroom)}
    role 'owner'
  end
end
