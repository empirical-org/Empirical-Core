# frozen_string_literal: true

class SalesFormSubmission < ApplicationRecord
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates :phone_number, presence: true
  validates :zipcode, presence: true
  validates :collection_type, presence: true
  validates :school_name, presence: true
  validates :district_name, presence: true
  validates :school_premium_count_estimate, presence: true
  validates :teacher_premium_count_estimate, presence: true
  validates :student_premium_count_estimate, presence: true
  validates :submission_type, presence: true
end
