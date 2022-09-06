# frozen_string_literal: true

class SyncSalesFormSubmissionToVitallyWorker
  include Sidekiq::Worker

  attr_accessor :sales_form_submission

  def perform(sales_form_submission_id)
    @sales_form_submission = SalesFormSubmission.find(sales_form_submission_id)

    create_records_in_vitally
  end

  def create_records_in_vitally
    create_school_or_district_if_none_exist
    create_vitally_user_if_none_exists
    send_opportunity_to_vitally
  end

  def create_school_or_district_if_none_exist
    if @sales_form_submission.district_collection? && @sales_form_submission.district.present?
      api.create_unless_exists(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, @sales_form_submission.district.id, @sales_form_submission.district.vitally_data)
    elsif @sales_form_submission.school_collection? && @sales_form_submission.school.present?
      api.create_unless_exists(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, @sales_form_submission.school.id, @sales_form_submission.school.vitally_data)
    end
  end

  # TODO: Reaxamine the logic we use here after we figure out what we want to do
  # regarding 'sales-contact' User roles.
  def create_vitally_user_if_none_exists
    user = @sales_form_submission.find_or_create_user

    if api.exists?(SalesFormSubmission::VITALLY_USERS_TYPE, user.id)
      api.update(SalesFormSubmission::VITALLY_USERS_TYPE, user.id, vitally_user_update_data)
    else
      api.create(SalesFormSubmission::VITALLY_USERS_TYPE, vitally_user_create_data)
    end
  end

  def send_opportunity_to_vitally
    api.create(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, @sales_form_submission.vitally_sales_form_data)

    if @sales_form_submission.district_collection? && @sales_form_submission.district.present?
      api.update(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, @sales_form_submission.district.id, vitallyHasOpportunityTrait)
    elsif @sales_form_submission.school_collection? && @sales_form_submission.school.present?
      api.update(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, @sales_form_submission.school.id, vitallyHasOpportunityTrait)
    end
  end

  private def api
    @api ||= VitallyRestApi.new
  end

  private def vitally_user_create_data
    user_payload = {
      externalId: @sales_form_submission.find_or_create_user.id.to_s,
      name: "#{@sales_form_submission.first_name} #{@sales_form_submission.last_name}",
      email: @sales_form_submission.email,
      traits: {
        phone_number: @sales_form_submission.phone_number,
        zipcode: @sales_form_submission.zipcode,
        "vitally.custom.opportunityOwner": true
      }
    }
    user_payload[:accountIds] = [school_vitally_id] if @sales_form_submission.school_collection?
    user_payload[:organizationIds] = [district_vitally_id] if @sales_form_submission.district_collection?
    user_payload
  end

  private def vitally_user_update_data
    user_payload = {
      traits: {
        "vitally.custom.opportunityOwner": true
      }
    }
    if @sales_form_submission.school_collection?
      user_payload[:accountIds] = school_array_for_existing_user
    elsif @sales_form_submission.district_collection?
      user_payload[:organizationIds] = district_array_for_existing_user
    end
    user_payload
  end

  private def school_vitally_id
    @school_vitally_id ||= api.get(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, @sales_form_submission.school.id)["id"]
  end

  private def district_vitally_id
    @district_vitally_id ||= api.get(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, @sales_form_submission.district.id)["id"]
  end

  private def school_array_for_existing_user
    previous_school = @sales_form_submission.find_or_create_user&.school
    if previous_school.present? && previous_school != school
      [api.get(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, previous_school.id)["id"], school_vitally_id]
    else
      [school_vitally_id]
    end
  end

  private def district_array_for_existing_user
    previous_district = @sales_form_submission.find_or_create_user&.school&.district
    if previous_district.present? && previous_district != district
      [api.get(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, previous_district.id)["id"], district_vitally_id]
    else
      [district_vitally_id]
    end
  end

  private def vitallyHasOpportunityTrait
    {
      traits: {
        "vitally.custom.hasOpportunity": true
      }
    }
  end
end
