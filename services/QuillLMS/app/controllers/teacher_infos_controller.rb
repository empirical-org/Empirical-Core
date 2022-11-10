class TeacherInfosController < ApplicationController

  def create
    teacher_info = TeacherInfo.create(
      teacher: current_user,
      minimum_grade_level: teacher_info_params[:minimum_grade_level],
      maximum_grade_level: teacher_info_params[:maximum_grade_level]
    )

    subject_areas = SubjectArea.where(id: teacher_info_params[:subject_areas])
    teacher_info.subject_areas.push(subject_areas)

    render json: {}, status: 200
  end

  def update
    teacher_info = TeacherInfo.find_or_create_by(teacher: current_user)

    if teacher_info_params[:minimum_grade_level] && teacher_info_params[:maximum_grade_level]
      teacher_info.update(minimum_grade_level: teacher_info_params[:minimum_grade_level], maximum_grade_level: teacher_info_params[:maximum_grade_level])
    end

    if teacher_info_params[:subject_areas]
      teacher_info.teacher_info_subject_areas.destroy_all
      subject_areas = SubjectArea.where(id: teacher_info_params[:subject_areas])
      teacher_info.subject_areas.push(subject_areas)
    end

    render json: {}, status: 200
  end

  private def teacher_info_params
    params.permit(:minimum_grade_level, :maximum_grade_level, subject_areas: [])
  end

end
