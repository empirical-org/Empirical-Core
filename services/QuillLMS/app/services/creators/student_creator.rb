# frozen_string_literal: true

module Creators::StudentCreator

  USERNAME_TAKEN = 'Validation failed: Username That username is taken. Try another.'

  def self.check_names(params)
    name_validator = ValidateFullName.new(params[:user]).call
    if name_validator[:status] == 'failure'
      name_validator[:notice]
    else
      name_validator

    end
  end

  def self.create_student(user_params, classroom_id)
    @student = User.new(user_params)
    @student.generate_student(classroom_id)
    counter = 0
    begin
      counter += 1
      @student.save!
    rescue ActiveRecord::RecordInvalid => e
      if e.message == USERNAME_TAKEN
        @student.generate_username(classroom_id)
        retry if counter <= 3
      end
      raise e
    end
    build_classroom_relation(classroom_id)
    @student
  end

  def self.build_classroom_relation(classroom_id)
    sc  = StudentsClassrooms.unscoped.find_or_initialize_by(student_id: @student.id, classroom_id: classroom_id)
    if sc.new_record? && sc.save!
      StudentJoinedClassroomWorker.perform_async(Classroom.find(classroom_id).owner.id, @student.id)
      end
    sc.update(visible: true)
    sc
  end
end
