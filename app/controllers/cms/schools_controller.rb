class Cms::SchoolsController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!

  before_action :search_attributes, only: [:index, :search]

  # This allows staff members to view and search through schools.
  def index
    @school_search_query = {}
  end

  def search
    @school_search_query = school_query_params
    @school_search_query_results = school_query(school_query_params)
    render :index
  end

  # This allows staff members to drill down on a specific school, including
  # viewing an index of teachers at this school.
  def show

  end

  # This allows staff members to edit certain details about a school.
  def edit

  end

  # This allows staff members to create a new school.
  def new

  end

  # TODO: subscriptions manager?

  private
  def search_attributes
    @search_attributes = ['school_name', 'school_city', 'school_state', 'school_zip', 'district_name']
    @school_premium_types = Subscription.where(id: SchoolSubscription.all.pluck(:subscription_id)).pluck(:account_type).uniq
  end

  def school_query_params
    default_params = [:utf8, :authenticity_token, :commit]
    params.permit(@search_attributes.map(&:to_sym) + default_params + [:search_schools_with_zero_teachers, :premium_status => []])
  end

  def school_query(params)
    
  end
end
