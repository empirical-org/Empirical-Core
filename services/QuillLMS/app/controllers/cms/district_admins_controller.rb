# frozen_string_literal: true

class Cms::DistrictAdminsController < Cms::CmsController
  before_action :set_district, only: [:create]
  before_action :set_district_admin, only: [:destroy]

  def create
    user = User.find_by(email: params[:email])
    if user
      create_district_admin_user_for_existing_user(user)
    else
      create_new_account_for_district_admin_user
    end
  end

  def destroy
    if @district_admin.destroy
      flash[:success] = 'Success! 🎉'
    else
      flash[:error] = 'Something went wrong.'
    end

    redirect_back(fallback_location: cms_district_path)
  end

  def set_district
    @district = District.find(params[:district_id])
  end

  def set_district_admin
    @district_admin = DistrictAdmin.find(params[:id])
  end

  def district_admin_params
    params.require(:email)
  end

  private def create_district_admin_user_for_existing_user(user, new_user: false)

    if @district.district_admins.find_by(user_id: user.id)
      return render json: { message: t('district_admin.already_assigned', district_name: @district.name) }
    end

    district_admin = @district.district_admins.build(user_id: user.id)

    begin
      district_admin.save!
    rescue => e
      return render json: { error: e.message }
    end

    user.mailer_user.determine_email_and_send(district_id: @district.id, new_user: new_user)
    returned_message = new_user ? t('district_admin.new_account') : t('district_admin.existing_account')
    render json: { message: returned_message }, status: 200
  end

  private def create_new_account_for_district_admin_user
    email = params[:email]
    first_name = params[:first_name]
    last_name = params[:last_name]
    user_params = { role: "teacher", email: email, name: "#{first_name} #{last_name}", password: last_name }
    user = User.new(user_params)

    begin
      user.save!
    rescue => e
      return render json: { error: e.message }
    end

    user.refresh_token!
    ExpirePasswordTokenWorker.perform_in(30.days, user.id)
    create_district_admin_user_for_existing_user(user, new_user: true)
  end
end
