module CleverIntegration
  class ClassroomCreator
    attr_reader :clever_id, :grade, :name

    def initialize(data)
      @clever_id = data[:clever_id]
      @grade = data[:grade]
      @name = data[:name]
    end

    def run
      Classroom.create!(
        clever_id: clever_id,
        grade: grade,
        name: name,
        synced_name: synced_name
      )
    end

    private def synced_name
      name
    end
  end
end
