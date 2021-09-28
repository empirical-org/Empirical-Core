module CleverIntegration
  class ClassroomImporter
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def run
      importer_class.new(data).run
    end

    private def classroom
      ::Classroom.unscoped.find_by(clever_id: clever_id)
    end

    private def clever_id
      data[:clever_id]
    end

    private def importer_class
      classroom.present? ? ClassroomUpdater : ClassroomCreator
    end
  end
end
