# frozen_string_literal: true

FactoryBot.define do
  factory :sales_form_submission do
    first_name { 'Haruki' }
    last_name { 'Murakami' }
    email { 'test@email.com'}
    phone_number { '5554443333' }
    zipcode { '10009' }
    collection_type { 'school' }
    school_name { 'Test School' }
    district_name { 'Test District' }
    school_premium_count_estimate { 1 }
    teacher_premium_count_estimate { 5 }
    student_premium_count_estimate { 100 }
    submission_type { 'quote request' }
  end
end
