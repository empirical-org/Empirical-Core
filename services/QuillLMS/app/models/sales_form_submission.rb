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
class SalesFormSubmission < ApplicationRecord
  attr_accessor :source, :intercom_link

  COLLECTION_TYPES = [
    SCHOOL_COLLECTION_TYPE = 'school',
    DISTRICT_COLLECTION_TYPE = 'district'
  ]
  SUBMISSION_TYPES = [
    QUOTE_REQUEST_TYPE = 'quote request',
    RENEWAL_REQUEST_TYPE = 'renewal request'
  ]
  FORM_SOURCE = "Form"
  INTERCOM_SOURCE = "Intercom"

  VITALLY_DISTRICTS_TYPE = "organizations"
  VITALLY_SCHOOLS_TYPE = "accounts"
  VITALLY_USERS_TYPE = "users"
  VITALLY_SALES_FORMS_TYPE = "projects"

  FALLBACK_SCHOOL_NAME = "Unknown School"
  FALLBACK_DISTRICT_NAME = "Unknown District"

  SCHOOL_QUOTE_REQUEST_TEMPLATE_ID = ENV['VITALLY_SCHOOL_QUOTE_TEMPLATE_ID']
  DISTRICT_QUOTE_REQUEST_TEMPLATE_ID = ENV['VITALLY_DISTRICT_QUOTE_TEMPLATE_ID']
  SCHOOL_RENEWAL_REQUEST_TEMPLATE_ID = ENV['VITALLY_SCHOOL_RENEWAL_TEMPLATE_ID']
  DISTRICT_RENEWAL_REQUEST_TEMPLATE_ID = ENV['VITALLY_DISTRICT_RENEWAL_TEMPLATE_ID']

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates_email_format_of :email, message: :invalid
  validates :school_premium_count_estimate, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :teacher_premium_count_estimate, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :student_premium_count_estimate, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :collection_type, presence: true, inclusion: { in: COLLECTION_TYPES }
  validates :submission_type, presence: true, inclusion: { in: SUBMISSION_TYPES }

  after_save :vitally_callbacks

  def send_opportunity_to_vitally
    api.create(VITALLY_SALES_FORMS_TYPE, vitally_sales_form_data)
  end

  def create_vitally_records_if_none_exist
    create_school_or_district_if_none_exist
    create_vitally_user_if_none_exists
  end

  def vitally_sales_form_data
    if school_collection?
      {
        templateId: vitally_template_id,
        customerId: api.get(VITALLY_SCHOOLS_TYPE, school.id)["id"],
        traits: vitally_traits
      }
    else
      {
        templateId: vitally_template_id,
        organizationId: api.get(VITALLY_DISTRICTS_TYPE, district.id)["id"],
        traits: vitally_traits
      }
    end
  end

  def vitally_user_create_data
    user_payload = {
      externalId: find_or_create_user.id.to_s,
      name: "#{first_name} #{last_name}",
      email: email,
      traits: {
        phone_number: phone_number,
        zipcode: zipcode,
        "vitally.custom.opportunityOwner": true
      }
    }
    user_payload[:accountIds] = [school_vitally_id] if school_collection?
    user_payload[:organizationIds] = [district_vitally_id] if district_collection?
    user_payload
  end

  def vitally_user_update_data
    user_payload = {
      traits: {
        "vitally.custom.opportunityOwner": true
      }
    }
    if school_collection?
      user_payload[:accountIds] = school_array_for_existing_user
    elsif district_collection?
      user_payload[:organizationIds] = district_array_for_existing_user
    end
    user_payload
  end

  def school_collection?
    collection_type == SCHOOL_COLLECTION_TYPE
  end

  def district_collection?
    collection_type == DISTRICT_COLLECTION_TYPE
  end

  private def api
    @api ||= VitallyRestApi.new
  end

  private def school
    @school ||= School.find_by(name: school_name) || School.find_by(name: FALLBACK_SCHOOL_NAME)
  end

  private def district
    @district ||= District.find_by(name: district_name) || District.find_by(name: FALLBACK_DISTRICT_NAME)
  end

  private def school_vitally_id
    @school_vitally_id ||= api.get(VITALLY_SCHOOLS_TYPE, school.id)["id"]
  end

  private def district_vitally_id
    @district_vitally_id ||= api.get(VITALLY_DISTRICTS_TYPE, district.id)["id"]
  end

  private def vitally_callbacks
    create_vitally_records_if_none_exist
    send_opportunity_to_vitally
  end

  private def find_or_create_user
    @user ||= User.find_by(email: email)
    return @user if @user.present?

    @user ||= User.create!(email: email, role: User::SALES_CONTACT, name: "#{first_name} #{last_name}", password: SecureRandom.uuid)
  end

  private def vitally_template_id
    if collection_type == SCHOOL_COLLECTION_TYPE && submission_type == QUOTE_REQUEST_TYPE
      SCHOOL_QUOTE_REQUEST_TEMPLATE_ID
    elsif collection_type == DISTRICT_COLLECTION_TYPE && submission_type == QUOTE_REQUEST_TYPE
      DISTRICT_QUOTE_REQUEST_TEMPLATE_ID
    elsif collection_type == SCHOOL_COLLECTION_TYPE && submission_type == RENEWAL_REQUEST_TYPE
      SCHOOL_RENEWAL_REQUEST_TEMPLATE_ID
    else
      DISTRICT_RENEWAL_REQUEST_TEMPLATE_ID
    end
  end

  private def create_school_or_district_if_none_exist
    if district_collection? && district.present? && !api.exists?(VITALLY_DISTRICTS_TYPE, district.id)
      api.create(VITALLY_DISTRICTS_TYPE, district.vitally_data)
    elsif school_collection? && school.present? && !api.exists?(VITALLY_SCHOOLS_TYPE, school.id)
      api.create(VITALLY_SCHOOLS_TYPE, school.vitally_data)
    end
  end

  private def create_vitally_user_if_none_exists
    user = find_or_create_user

    if api.exists?(VITALLY_USERS_TYPE, user.id)
      api.update(VITALLY_USERS_TYPE, user.id, vitally_user_update_data)
    else
      api.create(VITALLY_USERS_TYPE, vitally_user_create_data)
    end
  end

  private def school_array_for_existing_user
    previous_school = find_or_create_user&.school
    if previous_school.present? && previous_school != school
      [api.get(VITALLY_SCHOOLS_TYPE, previous_school.id)["id"], school_vitally_id]
    else
      [school_vitally_id]
    end
  end

  private def district_array_for_existing_user
    previous_district = find_or_create_user&.school&.district
    if previous_district.present? && previous_district != district
      user_payload[:organizationIds] = [api.get(VITALLY_DISTRICTS_TYPE, previous_district.id)["id"], district_vitally_id]
    else
      user_payload[:organizationIds] = [district_vitally_id]
    end
  end

  private def vitally_traits
    {
      "vitally.custom.name": "#{first_name} #{last_name}",
      "vitally.custom.email": email,
      "vitally.custom.phoneNumber": phone_number,
      "vitally.custom.schoolName": school_name,
      "vitally.custom.districtName": district_name,
      "vitally.custom.zipCode": zipcode,
      "vitally.custom.numberOfSchools": school_premium_count_estimate,
      "vitally.custom.numberOfTeachers": teacher_premium_count_estimate,
      "vitally.custom.numberOfStudents": student_premium_count_estimate,
      "vitally.custom.formComments": comment,
      "vitally.custom.opportunitySource": source,
      "vitally.custom.intercomLink": intercom_link,
      "vitally.custom.metabaseId": id
    }
  end
end
