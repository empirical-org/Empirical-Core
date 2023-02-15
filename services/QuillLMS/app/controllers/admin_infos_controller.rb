# frozen_string_literal: true

class AdminInfosController < ApplicationController

  def update
    admin_info = AdminInfo.find_or_create_by!(user: current_user)

    admin_info.update(admin_info_params)

    if admin_info.approval_status == AdminInfo::SKIPPED && admin_info.verification_url && admin_info.verification_reason
      admin_info.update(approval_status: AdminInfo::PENDING)
    end

    render json: {}, status: 200
  end

  private def admin_info_params
    params.permit(:sub_role, :verification_reason, :verification_url)
  end

end
