# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :school do
    sequence(:nces_id) { |n| "UniqNCES#{n}" }
    lea_id "MyString"
    leanm "MyString"
    name "MyString"
    phone "MyString"
    mail_street "MyString"
    mail_city "MyString"
  end
end
