class Cms::SchoolsController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!

  before_action :search_attributes, only: [:index, :search]

  # This allows staff members to view and search through schools.
  def index
    @school_search_query = {}
    @school_search_query_results = []
  end

  def search
    @school_search_query = school_query_params
    @school_search_query_results = school_query(school_query_params)
    @school_search_query_results = @school_search_query_results ? @school_search_query_results : []
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
    # These are the text input fields, but they are not all of the fields in the form.
    @search_attributes = ['school_name', 'school_city', 'school_state', 'school_zip', 'district_name']
    @school_premium_types = Subscription.where(id: SchoolSubscription.all.pluck(:subscription_id)).pluck(:account_type).uniq
  end

  def school_query_params
    default_params = [:utf8, :authenticity_token, :commit]
    params.permit(@search_attributes.map(&:to_sym) + default_params + [:search_schools_with_zero_teachers, :premium_status => []])
  end

  def school_query(params)
    # This should return an array of hashes with the following order.
    # [
    #   {
    #     school_name: 'school name',
    #     district_name: 'district name',
    #     school_city: 'school city',
    #     school_state: 'school state',
    #     school_zip: 'school zip',
    #     frl: '% FRL',
    #     number_teachers: '# teachers',
    #     premium_status: 'premium status',
    #     number_admins: '# admins',
    #     id: #,
    #   }
    # ]

    # TODO:
    #   - Account for mail_city versus city
    #   - Account for mail_state versus state
    #   - Add default values where appropriate

    # Welp, this obviously doesn't work yet. But it's getting there!

    ActiveRecord::Base.connection.execute("
      SELECT
        schools.name AS school_name,
        schools.leanm AS district_name,
        schools.city AS school_city,
        schools.state AS school_state,
        schools.zipcode AS school_zip,
        schools.free_lunches AS frl,
        COUNT(schools_users.*) AS number_teachers,
        subscriptions.account_type AS premium_status,
        COUNT(schools_admins.*) AS number_admins,
        schools.id AS id
      FROM schools
      LEFT JOIN schools_users ON schools_users.school_id = schools.id
      LEFT JOIN schools_admins ON schools_admins.school_id = schools.id
      LEFT JOIN school_subscriptions ON school_subscriptions.school_id = schools.id
      LEFT JOIN subscriptions ON subscriptions.id = school_subscriptions.subscription_id
      #{where_query_string}
      GROUP BY schools.name, schools.leanm, schools.city, schools.state, schools.zipcode, schools.free_lunches, subscriptions.account_type, schools.id
    ").to_a
  end

  def where_query_string
    'WHERE schools.id=103341'
  end
end
