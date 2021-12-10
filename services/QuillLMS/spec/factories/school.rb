# frozen_string_literal: true

FactoryBot.define do
  factory :school do
    sequence(:nces_id, 100000000000)
    lea_id { "1234567" }
    mail_street { "123 Broadway" }
    mail_city { "New York City" }
    mail_state { "NY" }
    mail_zipcode { "10003" }
    street { mail_street }
    city { mail_city }
    state { mail_state }
    zipcode { mail_zipcode }
    leanm { "#{mail_city} School District" }
    name { "#{mail_city} School" }
    phone { "1-800-555-1234" }
    longitude { "-74.044500" }
    latitude { "40.689249" }
    free_lunches { 50 }
    nces_status_code { 3 }
    nces_type_code { 6 }
    lower_grade { 5 }
    upper_grade { 8 }

    trait :private_school do
      nces_id { nil }
      lea_id { nil }
      leanm { nil }
      nces_type_code { nil }
      nces_status_code { nil }
      free_lunches { nil }
      total_students { 1500 }
      fte_classroom_teacher { 100 }
      ppin { "A1234567" }
    end

    factory :school_with_three_teachers do
      after(:create) do |school|
        activities = create_list(:schools_users, 2, school: school)
      end
    end
  end

  factory :simple_school, class: 'School' do; end
end
