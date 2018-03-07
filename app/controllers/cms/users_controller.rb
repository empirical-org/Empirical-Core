class Cms::UsersController < Cms::CmsController
  before_filter :signed_in!
  before_action :set_user, only: [:show, :show_json, :update, :destroy]
  before_action :set_search_inputs, only: [:index, :search]

  USERS_PER_PAGE = 10.0

  def index
    @user_search_query = {}
    @user_search_query_results = user_query(user_query_params)
    @number_of_pages = 0
  end

  def search
    @user_search_query = user_query_params
    @user_search_query_results = user_query(user_query_params)
    @user_search_query_results = @user_search_query_results ? @user_search_query_results : []
    @number_of_pages = (number_of_users_matched / USERS_PER_PAGE).ceil
    render :index
  end

  def new
    @user = User.new
  end

  def show
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
      redirect_to :back
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
    redirect_to :back
  end

  def remove_admin
    admin = SchoolsAdmins.find_by(user_id: params[:user_id], school_id: params[:school_id])
    flash[:error] = 'Something went wrong.' unless admin.destroy
    flash[:success] = 'Success! 🎉'
    redirect_to :back
  end

  def edit
    @user = User.find(params[:id])
  end

  def edit_subscription
    @user = User.includes(:subscription).find(params[:id])
    @subscription = @user.subscription
    @user_premium_types = Subscription::ALL_OFFICIAL_TYPES
    @subscription_payment_methods = Subscription::PAYMENT_METHODS
    @promo_expiration_date = Subscription.promotional_dates[:expiration]
    if @user.school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(@user.school.name)
      @schools_users = @user.school.users.map{|u| {id: u.id, name: u.name, email: u.email}}
    end
  end

  def create_subscription
    @user = User.includes(:subscription).find(params[:id])
    @subscription = Subscription.new
    @user_premium_types = Subscription::ALL_OFFICIAL_TYPES
    @subscription_payment_methods = Subscription::PAYMENT_METHODS
    @promo_expiration_date = Subscription.promotional_dates[:expiration]
    if @user.school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(@user.school.name)
      @schools_users = @user.school.users.map{|u| {id: u.id, name: u.name, email: u.email}}
    end
  end


  def update
    if @user.update_attributes(user_params)
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

protected

  def set_subscription_from_params subscription
    subscription.expiration = Date.parse("#{subscription_params[:expiration_date]['day']}-#{subscription_params[:expiration_date]['month']}-#{subscription_params[:expiration_date]['year']}")
    subscription.start_date = Date.parse("#{subscription_params[:start_date]['day']}-#{subscription_params[:start_date]['month']}-#{subscription_params[:start_date]['year']}")
    subscription.account_type = subscription_params[:premium_status]
    subscription.payment_method = subscription_params[:payment_method]
    subscription.payment_amount = subscription_params[:payment_amount]
    subscription.purchaser_email = subscription_params[:purchaser_email]
    subscription.account_limit = 1000 # This is a default value and should be deprecated.
    subscription.save
  end

  # def get_data_for_new_sub
  #   if @user.subscription
  #     @new_sub = @user.subscription.dup
  #     # @new_sub.start_date =
  #     @new_sub.expiration = @new_sub.expiration + 365
  #   end
  # end

  def set_user
    @user = User.find params[:id]
  end

  def user_params
    params[:user][:flag] = nil unless ['alpha', 'beta'].include? params[:user][:flag]
    params.require(:user).permit([:name, :email, :username, :role,
      :flag, :classcode, :password, :password_confirmation] + default_params
    )
  end

  def user_query_params
    params.permit(@text_search_inputs.map(&:to_sym) + default_params + [:page, :user_role, :user_premium_status => []])
  end

  def user_query(params)
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
    ActiveRecord::Base.connection.execute("
      SELECT
      	users.name AS name,
      	users.email AS email,
      	users.role AS role,
      	subscriptions.account_type AS subscription,
      	TO_CHAR(users.last_sign_in, 'Mon DD, YYYY') AS last_sign_in,
        schools.name AS school,
        schools.id AS school_id,
      	users.id AS id
      FROM users
      LEFT JOIN schools_users ON users.id = schools_users.user_id
      LEFT JOIN schools ON schools_users.school_id = schools.id
      LEFT JOIN user_subscriptions ON users.id = user_subscriptions.user_id
      LEFT JOIN subscriptions ON user_subscriptions.subscription_id = subscriptions.id
      #{where_query_string_builder}
      #{pagination_query_string}
    ").to_a
  end

  def where_query_string_builder
    conditions = ["users.role != 'temporary'"]
    @all_search_inputs.each do |param|
      param_value = user_query_params[param]
      if param_value && !param_value.empty?
        conditions << where_query_string_clause_for(param, param_value)
      end
    end
    "WHERE #{conditions.reject(&:nil?).join(' AND ')}"
  end

  def where_query_string_clause_for(param, param_value)
    # Potential params by which to search:
    # User name: users.name
    # User role: users.role
    # User username: users.username
    # User email: users.email
    # User IP: users.ip_address
    # School name: schools.name
    # Premium status: subscriptions.account_type
    case param
    when 'user_name'
      "users.name ILIKE '%#{(param_value)}%'"
    when 'user_role'
      "users.role = '#{(param_value)}'"
    when 'user_username'
      "users.username ILIKE '%#{(param_value)}%'"
    when 'user_email'
      "users.email ILIKE '%#{(param_value)}%'"
    when 'user_ip'
      "users.ip_address = '#{(param_value)}'"
    when 'school_name'
      "schools.name ILIKE '%#{(param_value)}%'"
    when 'user_premium_status'
      "subscriptions.account_type IN ('#{param_value.join('\',\'')}')"
    else
      nil
    end
  end

  def pagination_query_string
    page = [user_query_params[:page].to_i - 1, 0].max
    "LIMIT #{USERS_PER_PAGE} OFFSET #{USERS_PER_PAGE * page}"
  end

  def number_of_users_matched
    ActiveRecord::Base.connection.execute("
      SELECT
      	COUNT(users.id) AS count
      FROM users
      LEFT JOIN schools_users ON users.id = schools_users.user_id
      LEFT JOIN schools ON schools_users.school_id = schools.id
      LEFT JOIN user_subscriptions ON users.id = user_subscriptions.user_id
      LEFT JOIN subscriptions ON user_subscriptions.subscription_id = subscriptions.id
      #{where_query_string_builder}
    ").to_a[0]['count'].to_i
  end

  def set_search_inputs
    @text_search_inputs = ['user_name', 'user_username', 'user_email', 'user_ip', 'school_name']
    @school_premium_types = Subscription.account_types
    @user_role_types = User.select('DISTINCT role').map { |r| r.role }
    @all_search_inputs = @text_search_inputs + ['user_premium_status', 'user_role', 'page']
  end

  def subscription_params
    params.permit([:id, :payment_method, :payment_amount, :purchaser_email, :premium_status, :start_date => [:day, :month, :year], :expiration_date => [:day, :month, :year]] + default_params)
  end
end
