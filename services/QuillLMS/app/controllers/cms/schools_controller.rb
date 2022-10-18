# frozen_string_literal: true

class Cms::SchoolsController < Cms::CmsController
  before_action :signed_in!
  before_action :text_search_inputs, only: [:index, :search]
  before_action :set_school, only: [:new_subscription, :edit_subscription, :show, :complete_sales_stage]
  before_action :subscription_data, only: [:new_subscription, :edit_subscription]

  SCHOOLS_PER_PAGE = 30.0

  # This allows staff members to view and search through schools.
  def index
    @school_search_query = {
      'search_schools_with_zero_teachers' => true
    }
    @school_search_query_results = []
    @number_of_pages = 0
  end

  def search
    school_search_query = school_query_params
    school_search_query_results = school_query(school_query_params)
    school_search_query_results ||= []
    number_of_pages = (number_of_schools_matched / SCHOOLS_PER_PAGE).ceil
    render json: {numberOfPages: number_of_pages, schoolSearchQueryResults: school_search_query_results}
  end

  # This allows staff members to drill down on a specific school, including
  # viewing an index of teachers at this school.
  # rubocop:disable Metrics/CyclomaticComplexity
  def show
    @subscription = @school&.subscription
    @school_subscription_info = {
      'School Premium Type' => @school&.subscription&.account_type,
      'Expiration' => @school&.subscription&.expiration&.strftime('%b %d, %Y')
    }
    @school = {
      'Name' => @school.name,
      'City' => @school.city || @school.mail_city,
      'State' => @school.state || @school.mail_state,
      'ZIP' => @school.zipcode || @school.mail_zipcode,
      'District' => @school.district&.name,
      'Free and Reduced Price Lunch' => "#{@school.free_lunches}%",
      'NCES ID' => @school.nces_id,
      'PPIN' => @school.ppin,
      'Clever ID' => @school.clever_id
    }
    @teacher_data = teacher_search_query_for_school(params[:id])
    @admins = SchoolsAdmins.includes(:user).where(school_id: params[:id].to_i).map do |admin|
      {
        name: admin.user.name,
        email: admin.user.email,
        school_id: admin.school_id,
        user_id: admin.user_id
      }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # This allows staff members to edit certain details about a school.
  def edit
    @school = School.find(params[:id])
    @editable_text_attributes = editable_school_text_attributes
  end

  def update
    if School.find(edit_or_add_school_params[:id]).update(edit_or_add_school_params)
      redirect_to cms_school_path(edit_or_add_school_params[:id])
    else
      render :edit
    end
  end

  def new_subscription
    @subscription = Subscription.new(
      account_type: Subscription::SCHOOL_PAID,
      start_date: Subscription.redemption_start_date(@school),
      expiration: Subscription.default_expiration_date(@school)
    )
  end

  def edit_subscription
    @subscription = @school&.subscription
  end

  # This allows staff members to create a new school.
  def new
    @school = School.new
    @editable_text_attributes = editable_school_text_attributes
  end

  def create
    new_school = School.new(edit_or_add_school_params)
    if new_school.save
      redirect_to cms_school_path(new_school.id)
    else
      redirect_to new_cms_school_path, flash: { error: new_school.errors }
    end
  end

  def new_admin
    @school = School.find(params[:id])
  end

  def add_existing_user
    @school = School.find(params[:id])
  end

  def add_admin_by_email
    begin
      user = User.find_by(email: params[:email_address])
      school = School.find(params[:id])
      SchoolsAdmins.create(user_id: user.id, school_id: school.id)
      flash[:success] = "Yay! It worked! 🎉"
      redirect_to cms_school_path(params[:id])
    rescue
      flash[:error] = "It didn't work! 😭😭😭"
      redirect_back(fallback_location: fallback_location)
    end
  end

  def add_existing_user_by_email
    begin
      user = User.find_by!(email: params[:email_address])
      raise ArgumentError if user.role != 'teacher'

      school = School.find_by!(id: params[:id])
      SchoolsUsers.where(user: user).destroy_all
      SchoolsUsers.create!(user_id: user.id, school_id: school.id)
      flash[:success] = "Yay! It worked! 🎉"
      redirect_to cms_school_path(params[:id])
    rescue ActiveRecord::RecordNotFound
      flash[:error] = "It didn't work! Make sure the email you typed is correct."
      redirect_back(fallback_location: fallback_location)
    rescue ArgumentError
      flash[:error] = "It didn't work! Make sure the account you entered belogs to a teacher, not staff or student."
      redirect_back(fallback_location: fallback_location)
    rescue
      flash[:error] = "It didn't work. See a developer about this issue."
      redirect_back(fallback_location: fallback_location)
    end
  end

  def unlink
    begin
      teacher = User.find(params[:teacher_id])
      if teacher.unlink
        flash[:success] = "Yay! It worked! 🎉"
      else
        flash[:error] = "It didn't work. See a developer about this issue."
      end
      redirect_back(fallback_location: fallback_location)
    rescue
      flash[:error] = "It didn't work. Make sure the teacher still exists and belongs to this school."
    end
  end

  private def set_school
    @school = School.find params[:id]
  end

  private def text_search_inputs
    # These are the text input fields, but they are not all of the fields in the form.
    @text_search_inputs = ['school_name', 'school_city', 'school_state', 'school_zip', 'district_name']
    @school_premium_types = Subscription.account_types
  end

  private def all_search_inputs
    @text_search_inputs.map(&:to_sym) + [:sort, :sort_direction, :page, :search_schools_with_zero_teachers, :premium_status]
  end

  private def school_query_params
    params.permit(default_params + all_search_inputs)
  end

  private def school_query(params)
    # This should return an array of hashes that look like this:
    # [
    #   {
    #     school_name: 'school name',
    #     district_name: 'district name',
    #     school_city: 'school city',
    #     school_state: 'school state',
    #     school_zip: Number(school zip),
    #     frl: Number(frl),
    #     number_teachers: Number(# of teachers),
    #     premium_status: 'premium status',
    #     number_admins: Number(# of admins),
    #     id: '#',
    #   }
    # ]

    # NOTE: IF YOU CHANGE THIS QUERY'S CONDITIONS, PLEASE BE SURE TO
    # ADJUST THE PAGINATION QUERY STRING AS WELL.
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          schools.name AS school_name,
          districts.name AS district_name,
          COALESCE(schools.city, schools.mail_city) AS school_city,
          COALESCE(schools.state, schools.mail_state) AS school_state,
          COALESCE(schools.zipcode, schools.mail_zipcode) AS school_zip,
          schools.free_lunches AS frl,
          COUNT(DISTINCT schools_users.id) AS number_teachers,
          subscriptions.account_type AS premium_status,
          COUNT(DISTINCT schools_admins.id) AS number_admins,
          schools.id AS id
        FROM schools
        LEFT JOIN schools_users
          ON schools_users.school_id = schools.id
        LEFT JOIN schools_admins
          ON schools_admins.school_id = schools.id
        LEFT JOIN school_subscriptions
          ON school_subscriptions.school_id = schools.id
        LEFT JOIN subscriptions
          ON subscriptions.id = school_subscriptions.subscription_id
        LEFT JOIN districts
          ON districts.id = schools.district_id
        #{where_query_string_builder}
        GROUP BY
          schools.name,
          schools.city,
          schools.state,
          schools.zipcode,
          schools.free_lunches,
          subscriptions.account_type,
          schools.id,
          districts.name
        #{having_string}
        #{order_by_query_string}
        #{pagination_query_string}
      SQL
    ).to_a
  end

  private def having_string
    # We have to use HAVING here instead of including this in the WHERE query
    # builder because we're doing an aggregation here. This will merely filter
    # the results at the end.
    return if school_query_params[:search_schools_with_zero_teachers].present? && school_query_params[:search_schools_with_zero_teachers] != 'false'

    'HAVING COUNT(schools_users.*) != 0'
  end

  private def where_query_string_builder
    conditions = [
      "(subscriptions.expiration IS NULL OR subscriptions.expiration > '#{Date.current}')",
      "subscriptions.de_activated_date IS NULL"
    ]
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
    "WHERE #{conditions.join(' AND ')}"
  end

  private def where_query_string_clause_for(param, param_value)
    # Potential params by which to search:
    # School name: schools.name
    # School city: schools.city or schools.mail_city
    # School state: schools.state or schools.mail_state
    # School zip: schools.zipcode or schools.mail_zipcode
    # District name: districts.name
    # Premium status: subscriptions.account_type
    sanitized_fuzzy_param_value = ActiveRecord::Base.connection.quote("%#{param_value}%")
    sanitized_param_value = ActiveRecord::Base.connection.quote(param_value)

    case param
    when 'school_name'
      "schools.name ILIKE #{sanitized_fuzzy_param_value}"
    when 'school_city'
      "(schools.city ILIKE #{sanitized_fuzzy_param_value} OR schools.mail_city ILIKE #{sanitized_fuzzy_param_value})"
    when 'school_state'
      "(UPPER(schools.state) = UPPER(#{sanitized_param_value}) OR UPPER(schools.mail_state) = UPPER(#{sanitized_param_value}))"
    when 'school_zip'
      "(schools.zipcode = #{sanitized_param_value} OR schools.mail_zipcode = #{sanitized_param_value})"
    when 'district_name'
      "districts.name ILIKE #{sanitized_fuzzy_param_value}"
    when 'premium_status'
      "subscriptions.account_type IN (#{sanitized_param_value})"
    else
      nil
    end
  end

  private def pagination_query_string
    page = [school_query_params[:page].to_i - 1, 0].max
    "LIMIT #{SCHOOLS_PER_PAGE} OFFSET #{SCHOOLS_PER_PAGE * page}"
  end

  private def number_of_schools_matched
    result = RawSqlRunner.execute(
      <<-SQL
        SELECT COUNT(*) as count
        FROM (
          SELECT COUNT(schools.id) AS count
          FROM schools
          LEFT JOIN schools_users
            ON schools_users.school_id = schools.id
          LEFT JOIN schools_admins
            ON schools_admins.school_id = schools.id
          LEFT JOIN school_subscriptions
            ON school_subscriptions.school_id = schools.id
          LEFT JOIN subscriptions
            ON subscriptions.id = school_subscriptions.subscription_id
          LEFT JOIN districts
            ON districts.id = schools.district_id
          #{where_query_string_builder}
          GROUP BY schools.id
          #{having_string}
        ) AS subquery
      SQL
    )

    result.to_a[0]['count'].to_i
  end

  private def order_by_query_string
    sort = school_query_params[:sort]
    sort_direction = school_query_params[:sort_direction]
    if sort && sort_direction && sort != 'undefined' && sort_direction != 'undefined'
      "ORDER BY #{sort} #{sort_direction}"
    else
      "ORDER BY number_teachers DESC"
    end
  end

  private def edit_or_add_school_params
    params.require(:school).permit(:id, editable_school_attributes.values)
  end

  private def editable_school_text_attributes
    {
      'School Name' => :name,
      'School City' => :city,
      'School State' => :state,
      'School ZIP' => :zipcode,
      'FRP Lunch' => :free_lunches,
      'NCES ID' => :nces_id,
      'Clever ID' => :clever_id
    }
  end

  private def editable_school_attributes
    editable_school_text_attributes.merge({
      'District' => :district_id
    })
  end

  private def subscription_params
    params.permit([:id, :premium_status, :expiration_date => [:day, :month, :year]] + default_params)
  end

  private def teacher_search_query_for_school(school_id)
    Cms::TeacherSearchQuery.new(school_id).run
  end

  def fallback_location
    cms_school_path(params[:id].to_i)
  end

  private def subscription_data
    @premium_types = Subscription::OFFICIAL_SCHOOL_TYPES
    @subscription_payment_methods = Subscription::CMS_PAYMENT_METHODS

    return if @school.nil? || @school.alternative?

    @school_users = @school.users.select(:id, :email, :name)
  end
end
