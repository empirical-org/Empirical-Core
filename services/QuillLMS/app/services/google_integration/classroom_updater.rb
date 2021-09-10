module GoogleIntegration
  class ClassroomUpdater
    attr_reader :data, :google_classroom_id, :teacher_id

    def initialize(data)
      @data = data
      @google_classroom_id = data[:google_classroom_id]
      @teacher_id = data[:teacher_id]
    end

    def run
      update
      classroom
    end

    private def classroom
      @classroom ||= ::Classroom.unscoped.find_by!(google_classroom_id: google_classroom_id, teacher_id: teacher_id)
    end

    private def custom_name?
      classroom.name != classroom.synced_name
    end

    private def grade
      data.fetch(:grade, classroom.grade)
    end

    private def name
      custom_name? ? classroom.name : valid_name
    end

    private def other_owned_classroom_names
      @other_owned_classroom_names ||= teacher.classrooms_i_own.reject { |c| c.id == classroom.id }.pluck(:name)
    end

    private def synced_name
      data[:name]
    end

    private def teacher
      ::User.find(teacher_id)
    end

    private def update
      classroom.update!(
        name: name,
        synced_name: synced_name,
        grade: grade,
        visible: visible
      )
    end

    private def valid_name
      temp_name = data[:name]

      loop do
        return temp_name unless other_owned_classroom_names.include?(temp_name)
        temp_name += '_1'
      end
    end

    private def visible
      true
    end
  end
end
