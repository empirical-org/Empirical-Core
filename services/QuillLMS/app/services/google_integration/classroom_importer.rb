module GoogleIntegration
  class ClassroomImporter
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def run
      importer_class.new(data).run
    end

    private def classroom
      ::Classroom.unscoped.find_by(google_classroom_id: google_classroom_id, teacher_id: teacher_id)
    end

    private def google_classroom_id
      data[:google_classroom_id]
    end

    private def importer_class
      classroom.present? ? ClassroomUpdater : ClassroomCreator
    end

    private def teacher_id
      data[:teacher_id]
    end
  end
end
