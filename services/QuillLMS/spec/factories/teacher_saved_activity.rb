FactoryBot.define do
  factory :teacher_saved_activity do
    activity { Activity.last || create(:activity) }
    teacher  { User.find_by(role: 'teacher') || create(:teacher) }
  end
end
