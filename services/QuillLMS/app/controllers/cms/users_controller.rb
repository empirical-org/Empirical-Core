# frozen_string_literal: true

class Cms::UsersController < Cms::CmsController
  around_action :force_writer_db_role, only: [:index, :edit, :show, :sign_in]

  before_action :signed_in!
  before_action :set_flags
  before_action :set_user, only: [:show, :edit, :show_json, :update, :destroy, :new_subscription, :edit_subscription, :complete_sales_stage]
  before_action :set_search_inputs, only: [:index, :search]
  before_action :subscription_data, only: [:new_subscription, :edit_subscription]
  before_action :filter_zeroes_from_checkboxes, only: [:update, :create, :create_with_school]
  before_action :log_non_user_action, only: [:index]
  before_action :log_user_action, only: [:show, :edit, :sign_in]
  before_action :log_search, only: [:search]
  before_action :log_attribute_change, only: [:update]

  USERS_PER_PAGE = 30.0

  def index
    @user_search_query = {sort: 'last_sign_in', sort_direction: 'desc'}
    @user_search_query_results = []
    @user_flags = User::VALID_FLAGS
    @number_of_pages = 0
  end

  def search
    user_search_query = user_query_params
    user_search_query_results = user_query(user_query_params)
    user_search_query_results ||= []
    number_of_pages = (user_search_query_results.size / USERS_PER_PAGE).ceil
    render json: {numberOfPages: number_of_pages, userSearchQueryResults: user_search_query_results, userSearchQuery: user_search_query}
  end

  def new
    @user = User.new
  end

  def new_with_school
    @user = User.new
    @with_school = true
    @school = School.find(school_id_param)
  end

  def create_with_school
    @user = User.new(user_params)
    if @user.save! && !!SchoolsUsers.create(school_id: school_id_param, user: @user)
      redirect_to cms_school_path(school_id_param)
    else
      flash[:error] = 'Did not save.'
      redirect_back(fallback_location: cms_school_path(school_id_param))
    end
  end

  def show
    # everything is set as props from @user in the view
  end

  def show_json
    render json: @user.generate_teacher_account_info
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to cms_users_path
    else
      flash[:error] = 'Did not save.'
      redirect_back(fallback_location: cms_users_path)
    end
  end

  def sign_in
    session[:staff_id] = current_user.id
    super(User.find(params[:id]))
    redirect_to profile_path
  end

  def make_admin
    admin = SchoolsAdmins.new
    admin.school_id = params[:school_id]
    admin.user_id = params[:user_id]
    flash[:error] = 'Something went wrong.' unless admin.save
    redirect_back(fallback_location: cms_users_path)
  end

  def create_admin_user
    user = User.find_by(email: params[:email])
    if user
      create_admin_user_for_existing_user(user)
    else
      create_new_account_for_admin_user
    end
  end

  def remove_admin
    admin = SchoolsAdmins.find_by(user_id: params[:user_id], school_id: params[:school_id])
    flash[:error] = 'Something went wrong.' unless admin.destroy
    flash[:success] = 'Success! 🎉'
    redirect_back(fallback_location: cms_users_path)
  end

  def edit
  end

  def edit_subscription
    @subscription = @user.subscription
  end

  def new_subscription
    @subscription = Subscription.new(start_date: Subscription.redemption_start_date(@user), expiration: Subscription.default_expiration_date(@user))
  end

  def update
    if @user.update(user_params)
      redirect_to cms_users_path, notice: 'User was successfully updated.'
    else
      flash[:error] = 'Did not save.'
      render action: 'edit'
    end
  end

  def clear_data
    User.find(params[:id]).clear_data
    redirect_to cms_users_path
  end

  def destroy
    @user.destroy
  end

  def complete_sales_stage
    success = UpdateSalesContact
      .new(@user.id, params[:stage_number], current_user).call

    if success == true
      flash[:success] = 'Stage marked completed'
    else
      flash[:error] = 'Something went wrong'
    end
    redirect_to cms_user_path(@user.id)
  end

  protected def set_flags
    @valid_flags = User::VALID_FLAGS
  end

  protected def set_user
    @user = User
      .includes(sales_contact: { stages: [:user, :sales_stage_type] })
      .order('sales_stage_types.order ASC')
      .find(params[:id])
  end

  protected def school_id_param
    params[:school_id].to_i
  end

  protected def user_params
    params.require(:user).permit([:name, :email, :flagset, :username, :title, :role, :classcode, :password, :password_confirmation, :flags =>[]] + default_params
    )
  end

  protected def user_query_params
    params.permit(@text_search_inputs.map(&:to_sym) + default_params + [:flagset, :page, :user_role, :user_flag, :sort, :sort_direction, :user_premium_status, :class_code])
  end

  protected def user_query(params)
    # This should return an array of hashes that look like this:
    # [
    #   {
    #     name: 'first last',
    #     email: 'example@example.com',
    #     role: 'staff',
    #     premium: 'N/A',
    #     last_sign_in: 'Sep 19, 2017',
    #     school: 'not listed',
    #     school_id: 9,
    #     id: 19,
    #   }
    # ]

    # NOTE: IF YOU CHANGE THIS QUERY'S CONDITIONS, PLEASE BE SURE TO
    # ADJUST THE PAGINATION QUERY STRING AS WELL.
    #
    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          users.name AS name,
          users.email AS email,
          users.role AS role,
          users.last_sign_in AS last_sign_in,
          subscriptions.account_type AS subscription,
          TO_CHAR(users.last_sign_in, 'Mon DD, YYYY') AS last_sign_in_text,
          schools.name AS school,
          schools.id AS school_id,
          users.id AS id
        FROM users
        LEFT JOIN schools_users
          ON users.id = schools_users.user_id
        LEFT JOIN schools
          ON schools_users.school_id = schools.id
        LEFT JOIN user_subscriptions
          ON users.id = user_subscriptions.user_id
          AND user_subscriptions.created_at = (
            SELECT MAX(user_subscriptions.created_at)
            FROM user_subscriptions
            WHERE user_subscriptions.user_id = users.id
          )
        LEFT JOIN subscriptions
          ON user_subscriptions.subscription_id = subscriptions.id
        #{where_query_string_builder}
        #{class_code_string_builder}
        #{order_by_query_string}
        #{pagination_query_string}
      SQL
    ).to_a
  end

  protected def where_query_string_builder
    not_temporary = "users.role != 'temporary'"
    conditions = [not_temporary]
    @all_search_inputs.each do |param|
      param_value = user_query_params[param]
      if param_value && !param_value.empty?
        conditions << where_query_string_clause_for(param, param_value)
      end
    end
    "WHERE #{conditions.reject(&:nil?).join(' AND ')}"
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  protected def where_query_string_clause_for(param, param_value)
    # Potential params by which to search:
    # User name: users.name
    # User role: users.role
    # User username: users.username
    # User email: users.email
    # User IP: users.ip_address
    # School name: schools.name
    # User flagset: user.flagset
    # Premium status: subscriptions.account_type
    sanitized_fuzzy_param_value = ActiveRecord::Base.connection.quote("%#{param_value}%")
    sanitized_param_value = ActiveRecord::Base.connection.quote(param_value)

    case param
    when 'user_name'
      "users.name ILIKE #{(sanitized_fuzzy_param_value)}"
    when 'user_role'
      "users.role = #{(sanitized_param_value)}"
    when 'user_username'
      "users.username ILIKE #{(sanitized_fuzzy_param_value)}"
    when 'user_email_exact'
      "users.email = LOWER(TRIM(#{(sanitized_param_value)}))"
    when 'user_email'
      "users.email ILIKE #{(sanitized_fuzzy_param_value)}"
    when 'flagset'
      "users.flagset = #{(sanitized_param_value)}"
    when 'user_ip'
      "users.ip_address = #{(sanitized_param_value)}"
    when 'school_name'
      "schools.name ILIKE #{(sanitized_fuzzy_param_value)}"
    when 'user_premium_status'
      "subscriptions.account_type IN (#{sanitized_param_value})"
    else
      nil
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  protected def class_code_string_builder
    class_code = user_query_params["class_code"]
    return unless class_code.present?

    sanitized_class_code = ActiveRecord::Base.connection.quote(class_code)
    query = "AND users.id IN
      (( SELECT user_id FROM classrooms_teachers
      JOIN classrooms ON classrooms.id = classrooms_teachers.classroom_id
      WHERE classrooms.code = #{sanitized_class_code}) UNION
      ( SELECT student_id FROM students_classrooms
      JOIN classrooms ON classrooms.id = students_classrooms.classroom_id
      WHERE classrooms.code = #{sanitized_class_code}))"
  end

  protected def pagination_query_string
    page = [user_query_params[:page].to_i - 1, 0].max
    "LIMIT #{USERS_PER_PAGE} OFFSET #{USERS_PER_PAGE * page}"
  end

  protected def order_by_query_string
    sort = user_query_params[:sort]
    sort_direction = user_query_params[:sort_direction]
    if sort && sort_direction && sort != 'undefined' && sort_direction != 'undefined'
      "ORDER BY #{sort} #{sort_direction} NULLS LAST"
    else
      "ORDER BY last_sign_in DESC NULLS LAST"
    end
  end

  protected def set_search_inputs
    @text_search_inputs = ['user_name', 'user_username', 'user_email', 'user_email_exact', 'user_ip', 'school_name', 'class_code']
    @school_premium_types = Subscription.account_types
    @user_role_types = User::ROLES
    @all_search_inputs = @text_search_inputs + ['user_premium_status', 'user_role', 'page', 'flagset']
  end

  protected def filter_zeroes_from_checkboxes
    return unless params.dig(:user, :flags)

    # checkboxes pass back '0' when unchecked -- we only want the attributes that are checked
    params[:user][:flags] = user_params[:flags] - ["0"]
  end

  protected def subscription_params
    params.permit([:id, :payment_method, :payment_amount, :purchaser_email, :premium_status, :start_date => [:day, :month, :year], :expiration_date => [:day, :month, :year]] + default_params)
  end

  private def log_user_action
    log_change(params[:action].to_sym, @user&.id.to_s.presence || params[:id])
  end

  private def log_non_user_action
    log_change(params[:action].to_sym, nil)
  end

  private def log_search
    log_change(params[:action].to_sym, nil, "Search term: #{user_query_params}")
  end

  private def log_attribute_change
    previous_user_params = User.where(:id => @user.id).select(:name, :email, :username, :title, :role, :classcode, :flags).first.as_json

    #omit password field if password not filled in
    if user_params[:password].blank?
      new_user_params = user_params.except("password", "password_confirmation")
    else
      new_user_params = user_params.except("password_confirmation")
    end

    difference = (new_user_params.to_h.to_a - previous_user_params.to_h.to_a).to_h
    difference.each_key do |field|
      new_value = field == 'password' ? nil : difference[field]
      log_change(params[:action].to_sym, @user.id.to_s, nil, field, previous_user_params[field], new_value)
    end
  end

  private def log_change(action, changed_user, explanation = nil, changed_attribute = nil, previous_value = nil, new_value = nil)
    change_log = {
      user_id: current_user.id.to_s,
      action: ChangeLog::USER_ACTIONS[action],
      changed_record_type: 'User',
      changed_record_id: changed_user,
      explanation: explanation,
      changed_attribute: changed_attribute,
      previous_value: previous_value,
      new_value: new_value
    }
    ChangeLog.create(change_log)
  end

  private def subscription_data
    @premium_types = Subscription::OFFICIAL_TEACHER_TYPES
    @subscription_payment_methods = Subscription::CMS_PAYMENT_METHODS
  end

  private def create_admin_user_for_existing_user(user, new_user=false)
    school_id = params[:school_id]
    if user.admin?
      school_name = SchoolsAdmins.find_by(school_id: school_id).school.name
      render json: { message: "This account already exists and is an admin of #{school_name}." }
    else
      admin = SchoolsAdmins.new
      admin.school_id = school_id
      admin.user_id = user.id

      begin
        admin.save!
      rescue => e
        return render json: { error: e.message }
      end

      user.mailer_user.determine_email_and_send(school_id: school_id, new_user: new_user)
      returned_message = new_user ? "School admin added. They were notified by email." : "This account already exists. They were made an admin and notified by email."
      render json: { message: returned_message }, status: 200
    end
  end

  private def create_new_account_for_admin_user
    user_params.merge!(role: "teacher", password: SecureRandom.uuid)
    user = User.new(user_params)

    begin
      user.save!
    rescue => e
      return render json: { error: e.message }
    end

    create_admin_user_for_existing_user(user, new_user: true)
  end
end
