class UsersController < ApplicationController
  before_filter :require_login, only: [:index, :show, :new, :create, :edit, :update, :destroy]
 
  private
 
  def require_login
    unless logged_in?
      redirect_to root_path, notice: "You must be logged in to access this page"
    end
  end
 
  def logged_in?
    !!current_user
  end


  public
  


  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = !params[:id].nil? ? User.find(params[:id]) : current_user
    @roster = Array.new
    User.all.each do |user|
      if user.role == "user" && user.classcode == current_user.classcode
        @roster.push user
      end
    @roster.sort!{|x,y| x.name <=> y.name}
    end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(params[:user])
    @user.role = params[:role]
    @user.after_initialize!
    #set authenticity token, mail user

    respond_to do |format|
      if @user.save
        format.html { redirect_to profile_path, notice: 'User was successfully created.' }
        format.json { render json: @user, status: :created, location: @user }
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

  def activate_email
    user = User.find_by_email_activation_token(params[:token])
    if user && Time.now.to_i - user.confirmable_set_at.to_i < 172800
      user.activate! 
      #TEST IF SESSION ALREADY EXISTS
      redirect_to new_session_path, notice: "User activated, please log in."
    else
      redirect_to root_path, notice: "User not found or token has expired"
    end
  end
end
