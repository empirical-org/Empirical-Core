class TeacherInfosController < ApplicationController

  def create
    teacher_info = TeacherInfo.create!(
      user: current_user,
      minimum_grade_level: minimum_grade_level,
      maximum_grade_level: maximum_grade_level
    )

    subject_areas = SubjectArea.where(id: subject_area_ids)
    teacher_info.subject_areas.push(subject_areas)

    render json: {}, status: 200
  end

  def update
    teacher_info = TeacherInfo.find_or_create_by!(user: current_user)

    if minimum_grade_level && maximum_grade_level
      teacher_info.update!(minimum_grade_level: minimum_grade_level, maximum_grade_level: maximum_grade_level)
    end

    if subject_area_ids
      teacher_info.teacher_info_subject_areas.destroy_all
      subject_areas = SubjectArea.where(id: subject_area_ids)
      teacher_info.subject_areas.push(subject_areas)
    end

    render json: {}, status: 200
  end

  private def teacher_info_params
    params.permit(:minimum_grade_level, :maximum_grade_level, subject_area_ids: [])
  end

  private def minimum_grade_level
    teacher_info_params[:minimum_grade_level]
  end

  private def maximum_grade_level
    teacher_info_params[:maximum_grade_level]
  end

  private def subject_area_ids
    teacher_info_params[:subject_area_ids]
  end


end
