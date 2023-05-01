# frozen_string_literal: true

class TeacherInfosController < ApplicationController

  before_action :set_teacher_info, only: [:update]

  def create
    role = User::TEACHER_INFO_ROLES.include?(session[:role]) ? session[:role] : ''
    @teacher_info = TeacherInfo.create!(
      user: current_user,
      minimum_grade_level: minimum_grade_level,
      maximum_grade_level: maximum_grade_level,
      role_selected_at_signup: role,
      notification_email_frequency: notification_email_frequency
    )

    subject_areas = SubjectArea.where(id: subject_area_ids)
    @teacher_info.subject_areas.push(subject_areas)

    render json: {}, status: 200
  rescue ActiveRecord::RecordInvalid => e
    render json: {errors: e}, status: 400
  end

  def update

    if minimum_grade_level && maximum_grade_level
      @teacher_info.update!(minimum_grade_level: minimum_grade_level, maximum_grade_level: maximum_grade_level)
    end

    if subject_area_ids
      @teacher_info.teacher_info_subject_areas.destroy_all
      subject_area_ids.each do |subject_area_id|
        @teacher_info.teacher_info_subject_areas.create!(subject_area_id: subject_area_id)
      end
    end

    if notification_email_frequency
      @teacher_info.update!(notification_email_frequency: notification_email_frequency)
    end

    render json: {
      minimum_grade_level: @teacher_info.minimum_grade_level,
      maximum_grade_level: @teacher_info.maximum_grade_level,
      subject_area_ids: @teacher_info.subject_area_ids,
      notification_email_frequency: @teacher_info.notification_email_frequency
    }, status: 200
  end

  private def set_teacher_info
    @teacher_info = TeacherInfo.find_or_create_by!(user: current_user)
  end

  private def teacher_info_params
    params.permit(:minimum_grade_level, :maximum_grade_level, :notification_email_frequency, subject_area_ids: [])
  end

  private def minimum_grade_level
    teacher_info_params[:minimum_grade_level]
  end

  private def maximum_grade_level
    teacher_info_params[:maximum_grade_level]
  end

  private def notification_email_frequency
    teacher_info_params[:notification_email_frequency]
  end

  private def subject_area_ids
    teacher_info_params[:subject_area_ids]
  end


end
