module CleverIntegration::Associators::ClassroomsToTeacher

  def self.run(classrooms, teacher)
    classrooms.map do |classroom|
      role = get_role(classroom, teacher)
      ClassroomsTeacher.find_or_create_by!(classroom: classroom, user: teacher, role: role)
    rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid => e
      NewRelic::Agent.add_custom_attributes(classroom_id: classroom.id, teacher_id: teacher.id, role: role)
      NewRelic::Agent.notice_error(e)
    ensure
      classroom.reload
    end
  end

  def self.get_role(classroom, teacher)
    owner_ids = ClassroomsTeacher.where(classroom: classroom, role: 'owner').pluck(:user_id)

    return 'owner' if owner_ids.empty?

    owner_ids.include?(teacher.id) ? 'owner' : 'coteacher'
  end
end
