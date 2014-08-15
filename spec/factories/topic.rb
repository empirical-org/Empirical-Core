FactoryGirl.define do

  factory :topic do
    sequence(:name) { |i| "topic #{i}" }

    section { Section.first || FactoryGirl.create(:section) }
  end

end
