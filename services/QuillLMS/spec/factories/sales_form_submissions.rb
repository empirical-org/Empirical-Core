# frozen_string_literal: true

# == Schema Information
#
# Table name: sales_form_submissions
#
#  id                             :bigint           not null, primary key
#  collection_type                :string           not null
#  comment                        :text             default("")
#  district_name                  :string
#  email                          :string           not null
#  first_name                     :string           not null
#  last_name                      :string           not null
#  phone_number                   :string
#  school_name                    :string
#  school_premium_count_estimate  :integer          default(0), not null
#  student_premium_count_estimate :integer          default(0), not null
#  submission_type                :string           not null
#  teacher_premium_count_estimate :integer          default(0), not null
#  zipcode                        :string
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#
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
