module Student
  extend ActiveSupport::Concern

  included do
    #TODO: move these relationships into the users model

    has_many :students_classrooms, foreign_key: 'student_id', dependent: :destroy, class_name: "StudentsClassrooms"

    has_many :classrooms, through: :students_classrooms, source: :classroom, inverse_of: :students, class_name: "Classroom"
    has_many :activity_sessions, dependent: :destroy
    has_many :assigned_activities, through: :classrooms, source: :activities
    has_many :started_activities, through: :activity_sessions, source: :activity

    def finished_activities(classroom)
      classroom_unit_score_join(classroom).where('activity_sessions.completed_at is not null')
    end

    def classroom_unit_score_join(classroom)
      started_activities
      .joins('join unit_activities ON unit_activities.activity_id = activities.id')
      .joins('join classroom_units ON classroom_units.unit_id = unit_activities.unit_id')
      .where(classroom_units: { classroom_id: classroom.id })
    end
    protected :classroom_unit_score_join

    def student_average_score
      avg_str = ActiveRecord::Base.connection.execute(
       "select avg(percentage) from activity_sessions
        join users on activity_sessions.user_id = users.id
        join activities on activity_sessions.activity_id = activities.id
        where activities.activity_classification_id != 6
        and activities.activity_classification_id != 4
        and users.id = #{id}").to_a[0]['avg']
      (avg_str.to_f * 100).to_i
    end

    def move_student_from_one_class_to_another(old_classroom, new_classroom)
      StudentsClassrooms.unscoped.find_or_create_by(student_id: id, classroom_id: new_classroom.id).update(visible: true)
      move_activity_sessions(old_classroom, new_classroom)
      old_classroom_students_classrooms = StudentsClassrooms.find_by(student_id: id, classroom_id: old_classroom.id)
      # a callback on the students classroom model will remove the student from any associated classroom units
      old_classroom_students_classrooms&.update(visible: false)
    end

    def move_activity_sessions(old_classroom, new_classroom)
      old_classroom_id = old_classroom.id
      new_classroom_id = new_classroom.id
      user_id = id

      classroom_units = ClassroomUnit
      .joins("JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id")
      .joins("JOIN users ON activity_sessions.user_id = users.id")
      .where("users.id = ?", user_id)
      .where("classroom_units.classroom_id = ?", old_classroom_id)
      .group("classroom_units.id")

      if old_classroom.owner.id == new_classroom.owner.id
        classroom_units.each do |cu|
          sibling_cu = ClassroomUnit.find_or_create_by(unit_id: cu.unit_id, classroom_id: new_classroom_id)
          sibling_cu.assigned_student_ids.push(user_id)
          sibling_cu.save

          ActivitySession
            .where(classroom_unit_id: cu.id, user_id: user_id)
            .update_all(classroom_unit_id: sibling_cu.id)

          hide_extra_activity_sessions(cu.id)
        end
      else

        new_unit_name = "#{name}'s Activities from #{old_classroom.name}"
        unit = Unit.create(user_id: new_classroom.owner.id, name: new_unit_name)
        new_cu = ClassroomUnit.find_or_create_by(unit_id: unit.id, classroom_id: new_classroom_id, assigned_student_ids: [user_id])

        classroom_units.each do |cu|
          activity_sessions = ActivitySession.where(classroom_unit_id: cu.id, user_id: user_id)
          activity_sessions.update_all(classroom_unit_id: new_cu.id)

          activity_ids = activity_sessions.pluck(:activity_id) - unit.unit_activities.pluck(:activity_id)
          activity_ids.each { |activity_id| UnitActivity.create(unit_id: unit.id, activity_id: activity_id) }

          hide_extra_activity_sessions(cu.id)
        end
      end
    end
  end

  def hide_extra_activity_sessions(classroom_unit_id)
    ActivitySession.joins("JOIN users ON activity_sessions.user_id = users.id")
    .joins("JOIN classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id")
    .where("users.id = ?", id)
    .where("classroom_units.id = ?", classroom_unit_id)
    .where("activity_sessions.visible = true")
    .order("activity_sessions.is_final_score DESC, activity_sessions.percentage ASC, activity_sessions.started_at")
    .offset(1)
    .update_all(visible: false)
  end

  def merge_student_account(secondary_account, teacher_id=nil)
    if same_classrooms_as_other_student(secondary_account.id, teacher_id)
      merge_activity_sessions(secondary_account, teacher_id)
      secondary_account.remove_student_classrooms(teacher_id)
    elsif teacher_id
      teachers_classroom_ids = ClassroomsTeacher.where(user_id: teacher_id, role: 'owner').map(&:classroom_id)
      StudentsClassrooms.where(student_id: secondary_account.id, classroom_id: teachers_classroom_ids).each do |sc|
        StudentsClassrooms.find_or_create_by(student_id: id, classroom_id: sc.classroom_id)
      end
      merge_activity_sessions(secondary_account, teacher_id)
      secondary_account.remove_student_classrooms(teacher_id)
    else
      false
    end
  end

  def merge_activity_sessions(secondary_account, teacher_id=nil)
    primary_account_activity_sessions = activity_sessions
    secondary_account_activity_sessions = secondary_account.activity_sessions

    if teacher_id
      primary_account_activity_sessions = primary_account_activity_sessions.select { |as| as&.classroom_unit&.unit&.user_id == teacher_id }
      secondary_account_activity_sessions = secondary_account_activity_sessions.select { |as| as&.classroom_unit&.unit&.user_id == teacher_id }
    end

    primary_account_grouped_activity_sessions = primary_account_activity_sessions.group_by { |as| as.classroom_unit_id }
    secondary_account_grouped_activity_sessions = secondary_account_activity_sessions.group_by { |as| as.classroom_unit_id }

    secondary_account_grouped_activity_sessions.each do |cu_id, activity_sessions|
      if cu_id
        activity_sessions.each {|as| as.update_columns(user_id: id) }
        if primary_account_grouped_activity_sessions[cu_id]
          hide_extra_activity_sessions(cu_id)
        else
          cu = ClassroomUnit.find_by(id: cu_id)
          cu.update(assigned_student_ids: cu.assigned_student_ids.push(id))
        end
      end
    end
  end

  def remove_student_classrooms(teacher_id=nil)
    students_classrooms = StudentsClassrooms.where(student_id: id)
    if teacher_id
      students_classrooms = students_classrooms.select { |sc| sc&.classroom&.owner&.id == teacher_id }
    end
    students_classrooms.each { |sc| sc.update(visible: false) }
  end

  def same_classrooms_as_other_student(other_student_id, teacher_id=nil)
    shared_classroom_length = classrooms_shared_with_other_student(other_student_id, teacher_id).length
    other_students_classrooms = StudentsClassrooms.where(student_id: other_student_id)
    if teacher_id
      other_students_classrooms = other_students_classrooms.select { |sc| sc&.classroom&.owner&.id == teacher_id }
    end
    shared_classroom_length == other_students_classrooms.length
  end

  def classrooms_shared_with_other_student(other_student_id, teacher_id=nil)
    classroom_ids = ActiveRecord::Base.connection.execute("SELECT A.classroom_id
      FROM students_classrooms A, students_classrooms B
      WHERE A.student_id = #{ActiveRecord::Base.sanitize(id)}
      AND B.student_id = #{ActiveRecord::Base.sanitize(other_student_id)}
      AND A.classroom_id = B.classroom_id").to_a
    if teacher_id
      classroom_ids = classroom_ids.select { |classroom_id_hash| Classroom.find(classroom_id_hash['classroom_id']).owner.id == teacher_id}
    end
    classroom_ids
  end

end
