module GoogleIntegration
  class TeacherClassroomsData
    include Enumerable

    attr_reader :user, :serialized_classrooms_data

    def initialize(user, serialized_classrooms_data)
      @user = user
      @serialized_classrooms_data = serialized_classrooms_data
    end

    def each
      classrooms_data.each { |classroom_data| yield classroom_data }
    end

    private def classrooms_data
      deserialized_classrooms_data.map { |data| TeacherClassroomDataAdapter.new(user, data).run }
    end

    private def deserialized_classrooms_data
      JSON
        .parse(serialized_classrooms_data)
        .deep_symbolize_keys
        .fetch(:classrooms)
    end
  end
end
