FactoryBot.define do
  factory :teacher_saved_activity do
    activity { Activity.last || create(:activity) }
    teacher  { Teacher.last || create(:teacher) }
  end
end
