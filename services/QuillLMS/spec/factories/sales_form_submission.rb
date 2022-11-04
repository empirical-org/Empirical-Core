# frozen_string_literal: true

require 'rails_helper'

FactoryBot.define do
  factory :sales_form_submission do
    first_name { 'Haruki' }
    last_name { 'Murakami' }
    email { 'test@email.com'}
    title { 'Title' }
    phone_number { '5554443333' }
    collection_type { 'school' }
    school_name { 'Test School' }
    district_name { 'Test District' }
    teacher_premium_count_estimate { 5 }
    submission_type { 'quote request' }
  end
end
