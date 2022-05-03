# frozen_string_literal: true

class SalesFormSubmissionController < ApplicationController
  skip_before_action :verify_authenticity_token

  RENEWAL_REQUEST = 'renewal request'
  QUOTE_REQUEST = 'quote request'
  SCHOOL = 'school'
  DISTRICT = 'district'

  def request_renewal
    @type = RENEWAL_REQUEST
  end

  def request_quote
    @type = QUOTE_REQUEST
  end

  def create
    sales_form_submission = SalesFormSubmission.new(sales_form_submission_params)
    if  sales_form_submission.save!
      head :no_content, status: 200
    else
      render json: sales_form_submission.errors, status: :unprocessable_entity
    end
  end

  def get_options_for_sales_form()
    type = params[:type]
    schools_or_districts = type == SCHOOL ? School.all : District.all
    options = schools_or_districts.map do |school_or_district|
      {
        name: school_or_district.name,
        value: school_or_district.name
      }
    end
    render json: { options: options }
  end

  private def sales_form_submission_params
    params.require(:sales_form_submission).permit(:first_name, :last_name, :email, :phone_number,:zipcode, :collection_type, :school_name, :district_name,
                   :school_premium_count_estimate, :teacher_premium_count_estimate, :student_premium_count_estimate, :submission_type, :comment)
  end
end
