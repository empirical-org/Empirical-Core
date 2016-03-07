FactoryGirl.define do
  factory :classroom do
    sequence(:name) { |i| "classroom #{i}" }
    teacher
    grade '8'

    factory :classroom_with_one_student do
      after(:create) do |classroom, evaluator|
        create_list(:user, 1, classrooms: [classroom])
      end
    end

    factory :sweathogs do
      name  'Sweathogs'
      grade '11'
    end
  end
end
