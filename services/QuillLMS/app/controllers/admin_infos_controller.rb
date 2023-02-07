# frozen_string_literal: true

class AdminInfosController < ApplicationController

  def update
    admin_info = AdminInfo.find_or_create_by!(user: current_user)

    admin_info.update(admin_info_params)

    render json: {}, status: 200
  end

  private def admin_info_params
    params.permit(:sub_role, :verification_reason, :verification_url)
  end

end
