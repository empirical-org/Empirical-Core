class SessionsController < ApplicationController
  before_filter :signed_in!, only: [:destroy]
  before_filter :set_cache_buster, only: [:new]

  def create
    params[:user][:email].downcase! unless params[:user][:email].nil?
    @user =  User.find_by_username_or_email(params[:user][:email])

    if @user.nil?
      login_failure_message
    elsif @user.signed_up_with_google
      login_failure 'You signed up with google, please log in with google using the link above.'
    elsif @user.password_digest.nil?
      login_failure 'Login failed. Did you sign up with google? If so, please log in with google using the link above.'
    elsif @user.authenticate(params[:user][:password])
      sign_in(@user)
      if params[:redirect].present?
        redirect_to params[:redirect]
      else
        redirect_to profile_path
      end
    else
      login_failure_message
    end
  end

  def google
    @auth = request.env['omniauth.auth']['credentials']
    ga = GoogleAuthenticate.new(@auth)
    if session[:role].present?
      google_sign_up(ga)
    else
      google_login(ga)
    end
  end

  # Theres an issue here - if a student belongs to multiple clever classrooms, then the student
  # will get moved to the quill classroom of her clever teacher that most recently signed in
  # (since right now a student on quill can only belong to one classroom)
  # TODO: refactor code so that a student can belong to more than one classroom
  def clever
    @auth_hash = request.env['omniauth.auth']

    if @auth_hash[:info][:user_type] == "district"
      import_clever_schools
    else
      create_clever_user
    end
  rescue OAuth2::Error => e
    login_failure e.message
  end

  def destroy
    admin_id = session.delete(:admin_id)

    if user = User.find_by_id(admin_id)
      sign_out
      sign_in user
      redirect_to profile_path
    else
      staff_id = session.delete(:staff_id)
      if user = User.find_by_id(staff_id)
        sign_out
        sign_in user
        redirect_to profile_path
      else
        sign_out
        redirect_to signed_out_path, notice: 'Logged Out'
      end
    end
  end

  def new
    @user = User.new
    session[:role] = nil
  end

  def failure
    login_failure "You could not be logged in! Check to make sure your user is authorized and your username and password are correct."
  end

  private

  def google_sign_up ga
    user = ga.find_or_create_user(session[:role])
    if user.errors.any?
      redirect_to new_account_path
    else
      sign_in user
      AccountCreationCallbacks.new(user).trigger
      user.subscribe_to_newsletter
      if user.role == 'teacher'
        @teacherFromGoogleSignUp = true
        render 'accounts/new'
      else
        redirect_to profile_path
      end
    end
  end

  def google_login ga
    user = ga.find_user
    if user.present?
      sign_in user
      redirect_to profile_path
    else
      redirect_to new_account_path
    end
  end

  def login_failure_message
    login_failure 'Incorrect username/email or password'
  end

  def import_clever_schools
    if @auth_hash[:info][:id] && @auth_hash[:credentials][:token]
      # This request is initiated automatically by Clever, not a user.
      # Import the schools and leave it at that.
      District.setup_from_clever(@auth_hash)

      # Don't bother rendering anything.
      render status: 200, nothing: true
    else
      render status: 500, nothing: true
    end
  end

  def create_clever_user
    if @auth_hash[:info][:id] && @auth_hash[:credentials][:token]
      # If this is a teacher, import them and their classrooms, but not the classroom rosters.
      # If this is a student, connect them to an existing teacher through a classroom.
      @user = User.setup_from_clever(@auth_hash)
      @user.update_attributes(ip_address: request.remote_ip)

      sign_in @user
      redirect_to profile_url(protocol: 'http') # TODO Change this to use SSL when grammar supports SSL
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
