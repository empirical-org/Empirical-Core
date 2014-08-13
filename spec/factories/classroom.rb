FactoryGirl.define do

  factory :classroom do
    sequence(:name) { |i| "classroom #{i}" }
    teacher
    after(:create) {|c| c.units.create_next }
  end

end
