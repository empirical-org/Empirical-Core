# frozen_string_literal: true

class SalesFormSubmissionController < ApplicationController
  RENEWAL_REQUEST = 'renewal request'
  QUOTE_REQUEST = 'quote request'
  SCHOOL = 'school'

  def request_renewal
    @type = RENEWAL_REQUEST
  end

  def request_quote
    @type = QUOTE_REQUEST
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
end
