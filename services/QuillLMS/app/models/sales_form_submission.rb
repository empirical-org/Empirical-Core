# frozen_string_literal: true

# == Schema Information
#
# Table name: sales_form_submissions
#
#  id                             :bigint           not null, primary key
#  collection_type                :string           not null
#  comment                        :text             default("")
#  district_name                  :string           not null
#  email                          :string           not null
#  first_name                     :string           not null
#  last_name                      :string           not null
#  phone_number                   :string           not null
#  school_name                    :string           not null
#  school_premium_count_estimate  :integer          default(0), not null
#  student_premium_count_estimate :integer          default(0), not null
#  submission_type                :string           not null
#  teacher_premium_count_estimate :integer          default(0), not null
#  zipcode                        :string           not null
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#
class SalesFormSubmission < ApplicationRecord
  COLLECTION_TYPES = [
    SCHOOL_COLLECTION_TYPE = 'school',
    DISTRICT_COLLECTION_TYPE = 'district'
  ]
  SUBMISSION_TYPES = [
    QUOTE_REQUEST_TYPE = 'quote request',
    RENEWAL_REQUEST_TYPE = 'renewal request'
  ]
  VITALLY_SOURCE = "form"

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

  def sync_to_vitally
    api = VitallyRestApi.new
    api.create("projects", vitally_data)
  end

  private def vitally_data
    if collection_type == SCHOOL_COLLECTION_TYPE
      {
        templateId: vitally_template_id,
        customerId: School.find_by(name: school_name).id.to_s,
        traits: vitally_traits
      }
    else
      {
        templateId: vitally_template_id,
        organizationId: District.find_by(name: district_name).id.to_s,
        traits: vitally_traits
      }
    end
  end

  private def vitally_template_id
    if collection_type == SCHOOL_COLLECTION_TYPE && submission_type == QUOTE_REQUEST_TYPE
      "3faf0814-724d-4bb1-b56b-f854dfd23db8"
    elsif collection_type == DISTRICT_COLLECTION_TYPE && submission_type == QUOTE_REQUEST_TYPE
      "a96a963b-c1d4-4b33-94bb-f9a593046927"
    elsif collection_type == SCHOOL_COLLECTION_TYPE && submission_type == RENEWAL_REQUEST_TYPE
      "77925a98-2b74-47a6-81fb-c1922278df19"
    else
      "c1b2cd1f-f0aa-4e2c-855d-e3c1bce17a99"
    end
  end

  private def vitally_traits
    {
      name: "#{first_name} #{last_name}",
      email: email,
      phone_number: phone_number,
      school_name: school_name,
      district_name: district_name,
      zip_code: zipcode,
      number_of_schools: school_premium_count_estimate,
      number_of_teachers: teacher_premium_count_estimate,
      number_of_students: student_premium_count_estimate,
      form_comments: comment,
      source: VITALLY_SOURCE,
      intercom_link: "",
      sales_form_submission_id: id.to_s
    }
  end
end
