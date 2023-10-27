# frozen_string_literal: true

class Cms::DistrictAdminsController < Cms::CmsController
  before_action :set_district, only: [:create]
  before_action :set_district_admin, only: [:destroy]

  def create
    user = User.find_by(email: params[:email])
    school_ids = params[:school_ids]
    if user && @district.district_admins.exists?(user_id: user.id)
      render json: { message: t('district_admin.already_assigned', district_name: @district.name) }
    elsif user
      create_district_admin_user_for_existing_user(user, school_ids)
      InternalTool::MadeDistrictAdminEmailWorker.perform_async(user.id, @district.id)
      render json: { message: t('district_admin.existing_account') }, status: 200
    else
      user = create_new_account_for_district_admin_user
      InternalTool::DistrictAdminAccountCreatedEmailWorker.perform_async(user.id, @district.id)
      render json: { message: t('district_admin.new_account') }, status: 200
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

  private def create_district_admin_user_for_existing_user(user, school_ids)
    district_admin = @district.district_admins.build(user_id: user.id)
    if district_admin.save!
      district_admin.attach_schools(school_ids)
      attach_as_teacher_to_first_premium_school(user)
      admin_info = AdminInfo.find_or_create_by!(user: user)
      admin_info.update(approver_role: User::STAFF, approval_status: AdminInfo::APPROVED)
    else
      render json: { error: district_admin.errors.messages }
    end
  end

  private def create_new_account_for_district_admin_user
    user = User.new(user_params)
    if user.save!
      user.refresh_token!
      ExpirePasswordTokenWorker.perform_in(30.days, user.id)
      create_district_admin_user_for_existing_user(user, params[:school_ids])
      user
    else
      render json: { error: user.errors.messages }
    end
  end

  private def attach_as_teacher_to_first_premium_school(admin)
    first_premium_school = admin.administered_schools.find { |s| s.subscription.present? }
    return if first_premium_school.blank? || admin.school == first_premium_school

    SchoolsUsers.create!(user: admin, school: first_premium_school)
  end

  private def user_params
    first_name = params[:first_name]
    last_name = params[:last_name]
    { role: User::TEACHER, email: params[:email], name: "#{first_name} #{last_name}", password: last_name }
  end
end
