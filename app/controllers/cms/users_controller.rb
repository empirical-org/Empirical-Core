class Cms::UsersController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!
  before_action :set_user, only: [:show, :show_json, :edit, :update, :destroy]
  before_action :set_search_inputs, only: [:index, :search]

  def index
    @user_search_query = {}
    @user_search_query_results = []
  end

  def search
    @user_search_query = user_query_params
    @user_search_query_results = user_query(user_query_params)
    @user_search_query_results = @user_search_query_results ? @user_search_query_results : []
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
      render :new
    end
  end

  def sign_in
    session[:staff_id] = current_user.id
    super(User.find(params[:id]))
    redirect_to profile_path
  end

  def make_admin
    User.find(params[:id]).update(role: 'admin')
    redirect_to :back
  end

  def edit
  end

  def update
    if @user.teacher?
      response = @user.update_teacher params
      render json: response
    else
      if @user.update_attributes(user_params)
        redirect_to cms_users_path, notice: 'User was successfully updated.'
      else
        render action: 'edit'
      end
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
  def set_user
    @user = User.find params[:id]
  end

  def user_params
    params.require(:user).permit!
  end

  def user_query_params
    params.permit!
  end

  def user_query(params)
    # This should return an array of hashes with the following order.
    # (Order matters because of the order in which these are being
    # displayed in the table on the front end.)
    # [
    #   {
    #     name: 'first last',
    #     email: 'example@example.com',
    #     role: 'staff',
    #     school: 'not listed',
    #     premium: 'N/A',
    #     last_sign_in: 'Sep 19, 2017',
    #     id: 19,
    #   }
    # ]

    ActiveRecord::Base.connection.execute("
      SELECT
      	users.name AS name,
      	users.email AS email,
      	users.role AS role,
      	schools.name AS school,
      	subscriptions.account_type AS subscription,
      	TO_CHAR(users.last_sign_in, 'Mon DD, YYYY') AS last_sign_in,
      	users.id AS id
      FROM users
      LEFT JOIN schools_users ON users.id = schools_users.user_id
      LEFT JOIN schools ON schools_users.school_id = schools.id
      LEFT JOIN user_subscriptions ON users.id = user_subscriptions.user_id
      LEFT JOIN subscriptions ON user_subscriptions.subscription_id = subscriptions.id
      #{where_query_string_builder}
      LIMIT 50
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

  def set_search_inputs
    @text_search_inputs = ['user_name', 'user_username', 'user_email', 'user_ip', 'school_name']
    @school_premium_types = Subscription.account_types
    @user_role_types = User.select('DISTINCT role').map { |r| r.role }
    @all_search_inputs = @text_search_inputs + ['user_premium_status', 'user_role']
  end
end
