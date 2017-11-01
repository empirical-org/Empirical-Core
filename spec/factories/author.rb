FactoryBot.define do

  factory :author do
    sequence(:name) {|i| "author #{i}"}
  end

end