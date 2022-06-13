# frozen_string_literal: true

class Cms::DistrictAdminsController < Cms::CmsController
  before_action :set_district, only: [:create]
  before_action :set_district_admin, only: [:destroy]

  def create
    @district_admin = @district.district_admins.build(user_id: User.find_by(email: district_admin_params)&.id)

    begin
      @district_admin.save!
      flash[:success] = "Yay! It worked! 🎉"
    rescue ActiveRecord::RecordInvalid
      flash[:error] = "It didn't work! 😭😭😭"
    end

    redirect_back(fallback_location: cms_district_path(@district))
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
end
