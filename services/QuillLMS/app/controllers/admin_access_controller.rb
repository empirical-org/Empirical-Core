# frozen_string_literal: true

class AdminAccessController < ApplicationController
  def index
    @has_verified_email = current_user.email_verified?
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
    new_user = request_upgrade_to_admin_from_existing_admins_params[:new_user]
    admin_info = AdminInfo.find_or_create_by!(user: current_user)
    admin_info.update(approval_status: AdminInfo::PENDING, approver_role: User::ADMIN)
    admin_ids.each do |admin_id|
      AdminApprovalRequest.find_or_create_by!(admin_info: admin_info, requestee_id: admin_id, request_made_during_sign_up: !!new_user)
      AdminReceivedAdminUpgradeRequestFromTeacherAnalyticsWorker.perform_async(admin_id, current_user.id, reason, new_user)
    end
    TeacherRequestedToBecomeAdminAnalyticsWorker.perform_async(current_user.id, new_user)
    render json: {}, status: 200
  end

  def invite_admin
    admin_name = invite_admin_params[:admin_name]
    admin_email = invite_admin_params[:admin_email]
    note = invite_admin_params[:note]
    AdminInvitedByTeacherAnalyticsWorker.perform_async(admin_name, admin_email, current_user.id, note)
    TeacherInvitedAdminAnalyticsWorker.perform_async(current_user.id, admin_name, admin_email, note)
    render json: {}, status: 200
  end

  private def request_upgrade_to_admin_from_existing_admins_params
    params.permit(:reason, :new_user, admin_ids: [])
  end

  private def invite_admin_params
    params.permit(:admin_name, :admin_email, :note)
  end

end
