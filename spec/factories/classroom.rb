FactoryGirl.define do

  factory :classroom do
    sequence(:name) { |i| "classroom #{i}" }
    teacher
    after(:create) {|c| c.units.create_next }



    factory :classroom_with_one_student do

      after(:create) do |classroom, evaluator|
        create_list(:student, 1, classroom: classroom)
      end
    end

  end



end
