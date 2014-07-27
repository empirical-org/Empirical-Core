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

  factory :classroom do
    sequence(:name) { |i| "classroom #{i}" }
    teacher
    after(:create) {|c| c.units.create_next }
  end

  factory :section do
    sequence(:name) { |i| "section #{i}" }
    position 1
  end

  factory :topic do
    sequence(:name) { |i| "topic #{i}" }
    section
  end

  factory :activity_classification, aliases: [:classification] do
    sequence(:name) { |i| "activity cls #{i}" }
    key
  end

  factory :activity do
    sequence(:name) { |i| "activity #{i}" }
    classification
    description
    topic { Topic.first || create(:topic) }
  end
end
