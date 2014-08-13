# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  sequence(:name) { |i| "Name #{i}" }
  sequence(:username) { |i| "Username#{i}" }
  sequence(:key) { |i| "key-#{i}" }
  sequence(:description) { |i| "Description #{i}" }
  sequence(:email) { |n| "user#{n}@example.com" }

  factory :user do
    first_name 'Test'
    last_name  'User'
    role 'user'
    password '123456'
    password_confirmation '123456'
    email

    factory :admin do
      role 'admin'
    end

    factory :teacher do
      role 'teacher'
    end

    factory :student do
      role 'student'
      username
      classroom
    end
  end
end
