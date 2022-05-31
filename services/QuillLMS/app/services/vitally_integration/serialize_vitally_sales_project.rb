# frozen_string_literal: true

class SerializeVitallySalesProject

  def initialize(sales_form_submission)
    @sales_form_submission = sales_form_submission
  end

  def data
    if @sales_form_submission.collection_type == SalesFormSubmission::SCHOOL_COLLECTION_TYPE
      {
        templateId: template_id,
        customerId: School.find_by(name: @sales_form_submission.school_name).id,
        traits: traits
      }
    else
      {
        templateId: template_id,
        orgnanizationId: District.find_by(name: @sales_form_submission.district_name).id,
        traits: traits
      }
    end
  end

  def template_id
    if @sales_form_submission.collection_type == SalesFormSubmission::SCHOOL_COLLECTION_TYPE && @sales_form_submission.submission_type == SalesFormSubmission::QUOTE_REQUEST_TYPE
      "3faf0814-724d-4bb1-b56b-f854dfd23db8"
    elsif @sales_form_submission.collection_type == SalesFormSubmission::DISTRICT_COLLECTION_TYPE && @sales_form_submission.submission_type == SalesFormSubmission::QUOTE_REQUEST_TYPE
      "a96a963b-c1d4-4b33-94bb-f9a593046927"
    elsif @sales_form_submission.collection_type == SalesFormSubmission::SCHOOL_COLLECTION_TYPE && @sales_form_submission.submission_type == SalesFormSubmission::RENEWAL_REQUEST_TYPE
      "77925a98-2b74-47a6-81fb-c1922278df19"
    else
      "c1b2cd1f-f0aa-4e2c-855d-e3c1bce17a99"
    end
  end

  def traits
    {
      name: "#{@sales_form_submission.first_name} #{@sales_form_submission.last_name}",
      email: @sales_form_submission.email,
      phone_number: @sales_form_submission.phone_number,
      school_name: @sales_form_submission.school_name,
      district_name: @sales_form_submission.district_name,
      zip_code: @sales_form_submission.zipcode,
      number_of_schools: @sales_form_submission.school_premium_count_estimate,
      number_of_teachers: @sales_form_submission.teacher_premium_count_estimate,
      number_of_students: @sales_form_submission.student_premium_count_estimate,
      form_comments: @sales_form_submission.comment,
      source: "form",
      form_link: "https://data.quill.org/question#eyJkYXRhc2V0X3F1ZXJ5Ijp7InF1ZXJ5Ijp7InNvdXJjZS10YWJsZSI6MTEzMCwiZmlsdGVyIjpbImFuZCIsWyI9IixbImZpZWxkIiwxMzMyNixudWxsXSwiMSJdXX0sInR5cGUiOiJxdWVyeSIsImRhdGFiYXNlIjo2fSwiZGlzcGxheSI6InRhYmxlIiwidmlzdWFsaXphdGlvbl9zZXR0aW5ncyI6e319",
      intercom_link: ""
    }
  end
end
