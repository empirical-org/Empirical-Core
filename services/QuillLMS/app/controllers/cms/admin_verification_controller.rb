# frozen_string_literal: true

class Cms::AdminVerificationController < Cms::CmsController
  before_action :signed_in!
  before_action :set_admin_info, only: [:set_approved, :set_denied, :set_pending]

  def index
    @js_file = 'staff'
    @style_file = 'staff'
    respond_to do |format|
      format.html
      format.json {
        pending = admin_records_by_approval_status(AdminInfo::PENDING)
        completed = admin_records_by_approval_status([AdminInfo::APPROVED, AdminInfo::DENIED])
        render json: { pending: pending, completed: completed }, status: 200
      }
    end
  end

  def set_approved
    @admin_info.update(approval_status: AdminInfo::APPROVED)
    school = @admin_info.user.school
    SchoolsAdmins.create(user: @admin_info.user, school: school)
    ApprovedAdminVerificationEmailWorker.perform_async(@admin_info.user_id, school.id)
    render json: {}
  end

  def set_denied
    @admin_info.update(approval_status: AdminInfo::DENIED)
    school = @admin_info.user.school
    DeniedAdminVerificationEmailWorker.perform_async(@admin_info.user_id, school.id)
    render json: {}
  end

  def set_pending
    @admin_info.update(approval_status: AdminInfo::PENDING)
    school = @admin_info.user.school
    SchoolsAdmins.destroy_by(user: @admin_info.user, school: school)
    render json: {}
  end

  private def admin_records_by_approval_status(approval_status)
    AdminInfo.where(approval_status: approval_status).order('created_at DESC').map { |record| format_admin_info_record(record) }
  end

  private def format_admin_info_record(admin_info_record)
    geocoder_result = Geocoder.search(admin_info_record.user.ip_address&.to_string).first

    {
      admin_info_id: admin_info_record.id,
      date: admin_info_record.created_at,
      name: admin_info_record.user.name,
      school: admin_info_record.user.school&.name,
      email: admin_info_record.user.email,
      verification_url: admin_info_record.verification_url,
      verification_reason: admin_info_record.verification_reason,
      location: geocoder_result ? [geocoder_result.city, geocoder_result.state, geocoder_result.country].filter { |str| str && str.present? }.join(', ') : '',
      approval_status: admin_info_record.approval_status
    }
  end

  private def set_admin_info
    @admin_info = AdminInfo.find_by(id: params[:admin_info_id])
  end
end
