# frozen_string_literal: true

class AdminAccessController < ApplicationController
  def index
    @has_verified_email = current_user.email_verified? || current_user.google_id || current_user.clever_id
    @school = current_user.school
    @has_school_premium = @school ? @school.subscription.present? : false
    school_admin_user_ids = SchoolsAdmins.where(school: @school).pluck(:user_id)
    @school_admins = User.where(id: school_admin_user_ids)
  end

  def upgrade_to_admin
    current_user.update(role: User::ADMIN)
    admin_info = AdminInfo.find_or_create_by!(user: current_user)
    admin_info.update(approval_status: AdminInfo::SKIPPED, approver_role: User::STAFF, sub_role: AdminInfo::TEACHER_ADMIN)
    render json: {}, status: 200
  end

  def request_upgrade_to_admin_from_existing_admins
    admin_ids = request_upgrade_to_admin_from_existing_admins_params[:admin_ids]
    reason = request_upgrade_to_admin_from_existing_admins_params[:reason]
    admin_info = AdminInfo.find_or_create_by!(user: current_user)
    admin_info.update(approval_status: AdminInfo::PENDING, approver_role: User::ADMIN)
    admin_ids.each do |admin_id|
      AdminApprovalRequest.find_or_create_by!(admin_info: admin_info, requestee_id: admin_id)
      AdminReceivedAdminUpgradeRequestFromTeacherAnalyticsWorker.perform_async(admin_id, current_user.id, reason)
    end
    TeacherRequestedToBecomeAdminAnalyticsWorker.perform_async(current_user.id)
  end

  private def request_upgrade_to_admin_from_existing_admins_params
    params.permit(:reason, admin_ids: [])
  end

end
