module CleverIntegration
  class ClassroomCreator
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def run
      Classroom.create!(
        clever_id: clever_id,
        grade: grade,
        name: name,
        synced_name: synced_name
      )
    end


    private def clever_id
      data[:clever_id]
    end

    private def grade
      data[:grade]
    end

    private def name
      data[:name]
    end

    private def synced_name
      name
    end
  end
end
