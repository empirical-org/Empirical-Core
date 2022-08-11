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
    # Temporarily redirecting to the old wufoo form to avoid creating SalesFormSubmission
    # records until we resolve how we want to handle 'sales-contact' User roles
    # TODO: re-enable these after we figure that out
    redirect_to "https://quillpremium.wufoo.com/forms/quill-premium-quote/"
    @type = QUOTE_REQUEST
  end

  def create
    sales_form_submission = SalesFormSubmission.new(sales_form_submission_params)
    if sales_form_submission.save
      head :no_content, status: 200
    else
      render json: sales_form_submission.errors, status: :unprocessable_entity
    end
  end

  def options_for_sales_form
    klass = params[:type].classify.constantize
    schools_or_districts = klass.all.where.not(name: [nil, '']).where("name ILIKE ?", "#{search_query_prefix}%").limit(10).pluck(:name)
    render json: { options: schools_or_districts }
  end

  private def search_query_prefix
    search = params[:search]
    return '' if search.blank?

    search.gsub(/\d*/,'').squish
  end

  private def sales_form_submission_params
    params.require(:sales_form_submission).permit(:first_name, :last_name, :email, :phone_number,:zipcode, :collection_type, :school_name, :district_name,
                   :school_premium_count_estimate, :teacher_premium_count_estimate, :student_premium_count_estimate, :submission_type, :comment)
  end
end
