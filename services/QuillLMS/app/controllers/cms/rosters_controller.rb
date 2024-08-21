# frozen_string_literal: true

class Cms::RostersController < Cms::CmsController
  before_action :signed_in!

  def index; end

  # rubocop:disable Metrics/CyclomaticComplexity
  def upload_teachers_and_students
    school = School.find_by(id: params[:school_id])
    raise 'School not found. Check that the ID is correct and try again.' if school.blank?

    ActiveRecord::Base.transaction do
      params[:teachers]&.each do |t|
        email = t[:email]&.downcase
        next unless email
        raise "Teacher with email #{email} already exists." if User.find_by(email: email).present?
        raise "Please provide a last name or password for teacher #{t[:name]}, otherwise this account will have no password." if t[:password].blank? && t[:name].split[1].blank?

        password = t[:password].present? ? t[:password] : t[:name].split[1]
        teacher = User.create!(name: t[:name], email: email, password: password, password_confirmation: password, role: User::TEACHER)
        SchoolsUsers.create!(school: school, user: teacher)
      end

      params[:students]&.each do |s|
        teacher_email = s[:teacher_email]&.downcase
        student_email = s[:email]&.downcase
        next unless student_email
        raise "Teacher with email #{teacher_email} does not exist." if User.find_by(email: teacher_email).blank?
        raise "Please provide a last name or password for student #{s[:name]}, otherwise this account will have no password." if s[:password].blank? && s[:name].split[1].blank?

        password = s[:password].present? ? s[:password] : s[:name].split[1]
        student = User.find_by(email: student_email)
        if student.present? && params[:overwritePasswords]
          student.update!(password: password)
        end
        student ||= User.create!(name: s[:name], email: student_email, password: password, password_confirmation: password, role: 'student')

        teacher = User.find_by(email: teacher_email)
        classroom = Classroom.joins(:classrooms_teachers).where('classrooms_teachers.user_id = ?', teacher.id).where(name: s[:classroom]).first

        if !classroom
          classroom = Classroom.create!(name: s[:classroom])
          ClassroomsTeacher.create!(user: teacher, classroom: classroom, role: 'owner')
        end

        StudentsClassrooms.create!(student: student, classroom: classroom) if StudentsClassrooms.find_by(student: student, classroom: classroom).nil?
      end
    end

    render json: {}
  rescue => e
    render json: { errors: e.message }, status: 422
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
