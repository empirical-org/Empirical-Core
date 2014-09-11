class SessionsController < ApplicationController
  before_filter :signed_in!, only: [:destroy]

  def create
    if @user = User.authenticate(params[:user])
      @user.update_attributes(ip_address: request.remote_ip)
      sign_in(@user)
      redirect_to profile_path
    else
      login_failure 'Incorrect username/email or password'
    end
  end

  def clever
    @auth_hash = request.env['omniauth.auth']

    if @auth_hash[:info][:user_type] == "district"
      create_clever_district
    else
      create_clever_user
    end
  rescue OAuth2::Error => e
    login_failure e.message
  end

  def destroy
    admin_id = session.delete(:admin_id)
    sign_out

    if user = User.find_by_id(admin_id)
      sign_in user
      redirect_to profile_path
    else
      redirect_to signed_out_path, notice: 'Logged Out'
    end
  end

  def new
    @user = User.new
    @district_id = params[:district_id]
  end

  private

  def create_clever_district
    if @auth_hash[:info][:id] && @auth_hash[:credentials][:token]
      District.setup_from_clever(@auth_hash)

      # This request is initialized automatically by Clever, not a user.
      # So don't bother rendering anything.
      render status: 200, nothing: true
    else
      render status: 500, nothing: true
    end
  end

  def create_clever_user
    if @auth_hash[:info][:id] && @auth_hash[:credentials][:token]
      @user = User.setup_from_clever(@auth_hash)
      @user.update_attributes(ip_address: request.remote_ip)
      District.create_from_clever(@user.clever_district_id)

      sign_in @user
      redirect_to profile_path
    else
      login_failure 'Invalid response received from Clever.'
    end
  end

  def login_failure(error)
    @user = User.new
    flash[:error] = error
    render :new
  end

end
