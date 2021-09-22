module CleverIntegration
  class ClassroomUpdater
    attr_reader :clever_id, :grade, :synced_name

    def initialize(data)
      @clever_id = data[:clever_id]
      @grade = data[:grade]
      @synced_name = data[:name]
    end

    def run
      update
      classroom
    end

    private def classroom
      @classroom ||= Classroom.unscoped.find_by!(clever_id: clever_id)
    end

    private def custom_name?
      classroom.name != classroom.synced_name
    end

    private def name
      custom_name? ? classroom.name : synced_name
    end

    private def update
      classroom.update!(
        name: name,
        synced_name: synced_name,
        grade: grade
      )
    end
  end
end
