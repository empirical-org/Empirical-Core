FactoryGirl.define do
  trait :basic_user do
    name
    email
    username
    password 'password'
    password_confirmation 'password'
    role
  end

  factory :admin, traits: [:basic_user] do
    name 'Admin User'
    sequence(:email) { |n| "admin_email#{n}@quill.org" }
    sequence(:username) { |n| "admin_username#{n}" }
    role 'admin'
  end

  factory :teacher, traits: [:basic_user] do
    name 'Teacher User'
    sequence(:email) { |n| "teacher_email#{n}@quill.org" }
    sequence(:username) { |n| "teacher_username#{n}" }
    role 'teacher'
  end

  factory :student, traits: [:basic_user] do
    name 'Student User'
    sequence(:email) { |n| "student_email#{n}@quill.org" }
    sequence(:username) { |n| "student_username#{n}" }
    role 'student'
  end
end