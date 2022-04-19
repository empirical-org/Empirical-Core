# frozen_string_literal: true

class SalesFormSubmission < ApplicationRecord
  COLLECTION_TYPES = [
    SCHOOL_COLLECTION_TYPE = 'school',
    DISTRICT_COLLECTION_TYPE = 'district'
  ]
  SUBMISSION_TYPES = [
    QUOTE_REQUEST_TYPE = 'quote request',
    RENEWAL_REQUEST_TYPE = 'renewal request'
  ]

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates_email_format_of :email, message: :invalid
  validates :phone_number, presence: true
  validates :zipcode, presence: true
  validates :school_name, presence: true
  validates :district_name, presence: true
  validates :school_premium_count_estimate, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :teacher_premium_count_estimate, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :student_premium_count_estimate, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :collection_type, presence: true, inclusion: { in: COLLECTION_TYPES }
  validates :submission_type, presence: true, inclusion: { in: SUBMISSION_TYPES }
end
