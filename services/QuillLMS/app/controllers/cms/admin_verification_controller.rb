# frozen_string_literal: true

class Cms::AdminVerificationController < Cms::CmsController
  before_action :signed_in!

  def index
    pending = AdminInfo.where(approval_status: AdminInfo::PENDING).map { |record| format_admin_info_record(record) }
    completed = AdminInfo.where(approval_status: [AdminInfo::APPROVED, AdminInfo::DENIED]).map { |record| format_admin_info_record(record) }
    render json: { pending: pending, completed: completed }
  end

  def set_approved
    admin_info = AdminInfo.find_by(id: params[:admin_info_id])
    admin_info.update(approval_status: AdminInfo::APPROVED)
    school = admin_info.user.school
    SchoolsAdmins.create(user: admin_info.user, school: school)
    ApprovedAdminVerificationEmailWorker.perform_async(admin_info.user_id, school.id)
    render json: {}
  end

  def set_denied
    admin_info = AdminInfo.find_by(id: params[:admin_info_id])
    admin_info.update(approval_status: AdminInfo::DENIED)
    school = admin_info.user.school
    DeniedAdminVerificationEmailWorker.perform_async(admin_info.user_id, school.id)
    render json: {}
  end

  def set_pending
    admin_info = AdminInfo.find_by(id: params[:admin_info_id])
    admin_info.update(approval_status: AdminInfo::PENDING)
    school = admin_info.user.school
    SchoolsAdmins.find_by(user: admin_info.user, school: school)&.destroy
    render json: {}
  end

  private def format_admin_info_record(admin_info_record)
    geocoder_result = Geocoder.search(admin_info_record.user.ip_address.to_string).first

    {
      admin_info_id: admin_info_record.id,
      date: admin_info_record.created_at,
      name: admin_info_record.user.name,
      school: admin_info_record.user.school,
      email: admin_info_record.user.email,
      verification_url: admin_info_record.verification_url,
      verification_reason: admin_info_record.reason,
      location: "#{geocoder_result&.city}, #{geocoder_result&.state}, #{geocoder_result&.country}"
    }
  end
end
