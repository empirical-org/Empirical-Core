module Creators::StudentCreator

  def self.check_names(params)
    name_validator = ValidateFullName.new(params[:user]).call
    if name_validator[:status] == 'failure'
      name_validator[:notice]
    else
      student_attributes = name_validator
      student_attributes
    end
  end

  def self.create_student(user_params, classroom_id)
    @student = User.new(user_params)
    @student.generate_student(classroom_id)
    @student.save!
    build_classroom_relation(classroom_id)
    @student
  end

  def self.build_classroom_relation(classroom_id)
    sc  = StudentsClassrooms.unscoped.find_or_initialize_by(student_id: @student.id, classroom_id: classroom_id)
    if sc.new_record?
      if sc.save!
        StudentJoinedClassroomWorker.perform_async(Classroom.find(classroom_id).owner.id, @student.id)
      end
    end
    sc.update(visible: true)
    sc
  end
end
