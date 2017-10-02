class Cms::SchoolsController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!

  before_action :text_search_inputs, only: [:index, :search]

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
    @school_name = School.find(params[:id]).name
    @teacher_data = ActiveRecord::Base.connection.execute("
      SELECT
        users.name AS teacher_name,
        COUNT(DISTINCT(classrooms.id)) AS number_classrooms,
    		COUNT(DISTINCT(students_classrooms.student_id)) AS number_students,
    		COUNT(activity_sessions) AS number_activities_completed,
    		TO_CHAR(GREATEST(users.last_sign_in, MAX(activity_sessions.completed_at)), 'Mon DD, YYYY') as last_active,
    		subscriptions.account_type as subscription,
    		'TODO' as make_admin,
    		'TODO' as sign_in
      FROM schools_users
      LEFT JOIN users ON schools_users.user_id = users.id
      LEFT JOIN classrooms ON schools_users.user_id = classrooms.teacher_id AND classrooms.visible = true
      LEFT JOIN students_classrooms ON classrooms.id =  students_classrooms.classroom_id
      LEFT JOIN activity_sessions ON students_classrooms.student_id = activity_sessions.user_id AND completed_at IS NOT NULL
      LEFT JOIN subscriptions ON schools_users.user_id = subscriptions.user_id
      WHERE school_id = #{ActiveRecord::Base.sanitize(params[:id])}
      GROUP BY users.name, users.last_sign_in, subscriptions.account_type;
    ")
  end

  # This allows staff members to edit certain details about a school.
  def edit

  end

  # This allows staff members to create a new school.
  def new

  end

  private
  def text_search_inputs
    # These are the text input fields, but they are not all of the fields in the form.
    @text_search_inputs = ['school_name', 'school_city', 'school_state', 'school_zip', 'district_name']
    @school_premium_types = Subscription.where(id: SchoolSubscription.all.pluck(:subscription_id)).pluck(:account_type).uniq
  end

  def all_search_inputs
    @text_search_inputs.map(&:to_sym) + [:search_schools_with_zero_teachers, :premium_status => []]
  end

  def school_query_params
    default_params = [:utf8, :authenticity_token, :commit]
    params.permit(default_params + all_search_inputs)
  end

  def school_query(params)
    # This should return an array of hashes with the following order.
    # (Order matters because of the order in which these are being
    # displayed in the table on the front end.)
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

    ActiveRecord::Base.connection.execute("
      SELECT
        schools.name AS school_name,
        schools.leanm AS district_name,
        schools.city AS school_city,
        schools.state AS school_state,
        schools.zipcode AS school_zip,
        schools.free_lunches || '%' AS frl,
        COUNT(schools_users.*) AS number_teachers,
        subscriptions.account_type AS premium_status,
        COUNT(schools_admins.*) AS number_admins,
        schools.id AS id
      FROM schools
      LEFT JOIN schools_users ON schools_users.school_id = schools.id
      LEFT JOIN schools_admins ON schools_admins.school_id = schools.id
      LEFT JOIN school_subscriptions ON school_subscriptions.school_id = schools.id
      LEFT JOIN subscriptions ON subscriptions.id = school_subscriptions.subscription_id
      #{where_query_string_builder}
      GROUP BY schools.name, schools.leanm, schools.city, schools.state, schools.zipcode, schools.free_lunches, subscriptions.account_type, schools.id
      #{having_string}
      LIMIT 10
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
    "WHERE #{conditions.reject(&:nil?).join(' AND ')}" unless conditions.empty?
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
      "schools.city ILIKE '%#{(param_value)}%'"
    when 'school_state'
      "UPPER(schools.state) = UPPER(#{param_value})"
    when 'school_zip'
      "schools.zipcode = #{param_value}"
    when 'district_name'
      "schools.leanm ILIKE '%#{(param_value)}%'"
    when 'premium_status'
      "subscriptions.account_type IN ('#{param_value.join('\',\'')}')"
    else
      nil
    end
  end
end
