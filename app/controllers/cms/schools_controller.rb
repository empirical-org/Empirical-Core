class Cms::SchoolsController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!

  before_action :text_search_inputs, only: [:index, :search]

  SCHOOLS_PER_PAGE = 10.0

  # This allows staff members to view and search through schools.
  def index
    @school_search_query = {}
    @school_search_query_results = school_query(school_query_params)
    @number_of_pages = 0
  end

  def search
    @school_search_query = school_query_params
    @school_search_query_results = school_query(school_query_params)
    @school_search_query_results = @school_search_query_results ? @school_search_query_results : []
    @number_of_pages = (number_of_schools_matched / SCHOOLS_PER_PAGE).ceil
    render :index
  end

  # This allows staff members to drill down on a specific school, including
  # viewing an index of teachers at this school.
  def show
    @school_info = School.includes(:subscription).find(params[:id])
    @school_subscription_info = {
      'School Premium Type' => @school_info.subscription&.account_type,
      'Expiration' => @school_info.subscription&.expiration&.strftime('%b %d, %Y')
    }
    @school_info = {
      'Name' => @school_info.name,
      'City' => @school_info.city || @school_info.mail_city,
      'State' => @school_info.state || @school_info.mail_state,
      'ZIP' => @school_info.zipcode || @school_info.mail_zipcode,
      'District' => @school_info.leanm,
      'Free and Reduced Price Lunch' => "#{@school_info.free_lunches}%",
      'NCES ID' => @school_info.nces_id,
      'PPIN' => @school_info.ppin
    }
    @teacher_data = teacher_search_query_for_school(params[:id])
  end

  # This allows staff members to edit certain details about a school.
  def edit
    @school = School.find(params[:id])
    @editable_attributes = editable_school_attributes
  end

  def update
    if School.find(edit_or_add_school_params[:id]).update(edit_or_add_school_params)
      redirect_to cms_school_path(edit_or_add_school_params[:id])
    else
      render :edit
    end
  end

  def edit_subscription
    @school = School.includes(:subscription).find(params[:id])
    @school_premium_types = Subscription.account_types

    if @school.subscription
      # If this school already has a subscription, we want the expiration date
      # to reflect the expiration date of that subscription.
      @expiration_date = @school.subscription.expiration
      @account_type = @school.subscription.account_type
    else
      # If this school does not already have a subscription, we want the
      # default expiration date to be one year from today.
      @expiration_date = Date.today + 1.years
      @account_type = nil
    end
  end

  def update_subscription
    school = School.find(subscription_params[:id])
    subscription = school.subscription
    unless subscription
      subscription = Subscription.new
      subscription.expiration = Date.parse("#{subscription_params[:expiration_date]['day']}-#{subscription_params[:expiration_date]['month']}-#{subscription_params[:expiration_date]['year']}")
      subscription.account_type = subscription_params[:premium_status]
      subscription.account_limit = 1000 # This is a default value and should be deprecated.
      success = (subscription.save && school.subscription = subscription)
    else
      subscription.expiration = Date.parse("#{subscription_params[:expiration_date]['day']}-#{subscription_params[:expiration_date]['month']}-#{subscription_params[:expiration_date]['year']}")
      subscription.account_type = subscription_params[:premium_status]
      success = subscription.save
    end
    return redirect_to cms_school_path(subscription_params[:id]) if success
    render :edit_subscription
  end

  # This allows staff members to create a new school.
  def new
    @school = School.new
    @editable_attributes = editable_school_attributes
  end

  def create
    new_school = School.new(edit_or_add_school_params)
    if new_school.save
      redirect_to cms_school_path(new_school.id)
    else
      render :new
    end
  end

  private
  def text_search_inputs
    # These are the text input fields, but they are not all of the fields in the form.
    @text_search_inputs = ['school_name', 'school_city', 'school_state', 'school_zip', 'district_name']
    @school_premium_types = Subscription.account_types
  end

  def all_search_inputs
    @text_search_inputs.map(&:to_sym) + [:page, :search_schools_with_zero_teachers, :premium_status => []]
  end

  def school_query_params
    params.permit(default_params + all_search_inputs)
  end

  def school_query(params)
    # This should return an array of hashes that look like this:
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

    # NOTE: IF YOU CHANGE THIS QUERY'S CONDITIONS, PLEASE BE SURE TO
    # ADJUST THE PAGINATION QUERY STRING AS WELL.
    ActiveRecord::Base.connection.execute("
      SELECT
        schools.name AS school_name,
        schools.leanm AS district_name,
        COALESCE(schools.city, schools.mail_city) AS school_city,
        COALESCE(schools.state, schools.mail_state) AS school_state,
        COALESCE(schools.zipcode, schools.mail_zipcode) AS school_zip,
        schools.free_lunches || '%' AS frl,
        COUNT(DISTINCT schools_users.id) AS number_teachers,
        subscriptions.account_type AS premium_status,
        COUNT(DISTINCT schools_admins.id) AS number_admins,
        schools.id AS id
      FROM schools
      LEFT JOIN schools_users ON schools_users.school_id = schools.id
      LEFT JOIN schools_admins ON schools_admins.school_id = schools.id
      LEFT JOIN school_subscriptions ON school_subscriptions.school_id = schools.id
      LEFT JOIN subscriptions ON subscriptions.id = school_subscriptions.subscription_id
      #{where_query_string_builder}
      GROUP BY schools.name, schools.leanm, schools.city, schools.state, schools.zipcode, schools.free_lunches, subscriptions.account_type, schools.id
      #{having_string}
      #{pagination_query_string}
    ").to_a
  end

  def having_string
    # We have to use HAVING here instead of including this in the WHERE query
    # builder because we're doing an aggregation here. This will merely filter
    # the results at the end.
    'HAVING COUNT(schools_users.*) != 0' unless school_query_params[:search_schools_with_zero_teachers]
  end

  def where_query_string_builder
    conditions = []
    # This converts all of the search inputs into strings so we can iterate
    # over them and grab the value from params. The weird ternary here is in
    # case we have arrays as inputs (e.g. the 'premium_status' field).
    all_search_inputs.map{|i| i.instance_of?(Symbol) ? i.to_s : i.keys[0].to_s}.each do |param|
      param_value = school_query_params[param]
      if param_value && !param_value.empty?
        conditions << where_query_string_clause_for(param, param_value)
      end
    end
    conditions = conditions.reject(&:nil?)
    "WHERE #{conditions.join(' AND ')}" unless conditions.empty?
  end

  def where_query_string_clause_for(param, param_value)
    # Potential params by which to search:
    # School name: schools.name
    # School city: schools.city or schools.mail_city
    # School state: schools.state or schools.mail_state
    # School zip: schools.zipcode or schools.mail_zipcode
    # District name: schools.leanm
    # Premium status: subscriptions.account_type
    case param
    when 'school_name'
      "schools.name ILIKE '%#{(param_value)}%'"
    when 'school_city'
      "(schools.city ILIKE '%#{(param_value)}%' OR schools.mail_city ILIKE '%#{(param_value)}%')"
    when 'school_state'
      "(UPPER(schools.state) = UPPER('#{param_value}') OR UPPER(schools.mail_state) = UPPER('#{param_value}'))"
    when 'school_zip'
      "(schools.zipcode = '#{param_value}' OR schools.mail_zipcode = '#{param_value}')"
    when 'district_name'
      "schools.leanm ILIKE '%#{(param_value)}%'"
    when 'premium_status'
      "subscriptions.account_type IN ('#{param_value.join('\',\'')}')"
    else
      nil
    end
  end

  def pagination_query_string
    page = [school_query_params[:page].to_i - 1, 0].max
    "LIMIT #{SCHOOLS_PER_PAGE} OFFSET #{SCHOOLS_PER_PAGE * page}"
  end

  def number_of_schools_matched
    ActiveRecord::Base.connection.execute("
      SELECT count(*) as count FROM
        (SELECT
        	COUNT(schools.id) AS count
        FROM schools
        LEFT JOIN schools_users ON schools_users.school_id = schools.id
        LEFT JOIN schools_admins ON schools_admins.school_id = schools.id
        LEFT JOIN school_subscriptions ON school_subscriptions.school_id = schools.id
        LEFT JOIN subscriptions ON subscriptions.id = school_subscriptions.subscription_id
        #{where_query_string_builder}
        GROUP BY schools.id
        #{having_string}) as subquery
    ").to_a[0]['count'].to_i
  end

  def edit_or_add_school_params
    params.require(:school).permit(:id, editable_school_attributes.values)
  end

  def editable_school_attributes
    {
      'School Name' => :name,
      'School City' => :city,
      'School State' => :state,
      'School ZIP' => :zipcode,
      'District Name' => :leanm,
      'FRP Lunch' => :free_lunches
    }
  end

  def subscription_params
    params.permit([:id, :premium_status, :expiration_date => [:day, :month, :year]] + default_params)
  end

  def teacher_search_query_for_school(school_id)
    # This query return an array of hashes that look like this:
    # [
    #   {
    #     teacher_name: 'teacher name',
    #     number_classrooms: 3,
    #     number_students: 61,
    #     number_activities_completed: 212,
    #     last_active: 'Sep 19, 2017',
    #     subscription: 'School Paid',
    #     user_id: 42,
    #     admin_id: null
    #   }
    # ]
    ActiveRecord::Base.connection.execute("
      SELECT
        users.name AS teacher_name,
        COUNT(DISTINCT classrooms.id) AS number_classrooms,
        COUNT(DISTINCT students_classrooms.student_id) AS number_students,
        COUNT(DISTINCT activity_sessions) AS number_activities_completed,
        TO_CHAR(GREATEST(users.last_sign_in, MAX(activity_sessions.completed_at)), 'Mon DD, YYYY') AS last_active,
        subscriptions.account_type AS subscription,
        users.id AS user_id,
        schools_admins.id AS admin_id
      FROM schools_users
      LEFT JOIN users ON schools_users.user_id = users.id
      LEFT JOIN classrooms ON schools_users.user_id = classrooms.teacher_id AND classrooms.visible = true
      LEFT JOIN students_classrooms ON classrooms.id =  students_classrooms.classroom_id
      LEFT JOIN activity_sessions ON students_classrooms.student_id = activity_sessions.user_id AND completed_at IS NOT NULL
      LEFT JOIN user_subscriptions ON schools_users.user_id = user_subscriptions.user_id
      LEFT JOIN subscriptions ON subscriptions.id = user_subscriptions.subscription_id
      LEFT JOIN schools_admins ON users.id = schools_admins.user_id
      WHERE schools_users.school_id = #{ActiveRecord::Base.sanitize(school_id)}
      GROUP BY users.name, users.last_sign_in, subscriptions.account_type, users.id, schools_admins.id
    ").to_a
  end
end
