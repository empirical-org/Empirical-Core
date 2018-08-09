FactoryBot.define do
  factory :school do
    nces_id { Faker::Number.unique.number(12).to_s }
    lea_id { Faker::Number.unique.number(7).to_s }
    mail_street { Faker::Address.street_name }
    mail_city { Faker::Address.city }
    mail_state { Faker::Address.state_abbr }
    mail_zipcode { Faker::Address.zip }
    street { mail_street }
    city { mail_city }
    state { mail_state }
    zipcode { mail_zipcode }
    leanm { "#{mail_city} School District" }
    name { "#{mail_city} School" }
    phone { Faker::PhoneNumber.phone_number }
    longitude { Faker::Address.longitude }
    latitude { Faker::Address.latitude }
    free_lunches { Faker::Number.between(0, 100) }
    nces_status_code { Faker::Number.between(0, 5) }
    nces_type_code { Faker::Number.between(0, 8) }
    lower_grade { Faker::Number.between(0, 12) }
    upper_grade { [lower_grade.to_i + Faker::Number.between(0, 12), 12].min }

    trait :private_school do
      nces_id { nil }
      lea_id { nil }
      leanm { nil }
      nces_type_code { nil }
      nces_status_code { nil }
      free_lunches { nil }
      total_students { Faker::Number.number(1500) }
      fte_classroom_teacher { Faker::Number.number(100) }
      ppin { "A#{Faker::Number.unique.number(7)}" }
    end

    factory :school_with_three_teachers do
      after(:create) do |school|
        activities = create_list(:schools_users, 3, school: school)
      end
    end
  end

  factory :simple_school, class: 'School' do; end
end
