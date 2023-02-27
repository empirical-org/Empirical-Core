# frozen_string_literal: true

module GoogleIntegration
  class TeacherClassroomsData
    include Enumerable

    attr_reader :user, :serialized_classrooms_data

    def initialize(user, serialized_classrooms_data)
      @user = user
      @serialized_classrooms_data = serialized_classrooms_data
    end

    def each(&block)
      classrooms_data.each(&block)
    end

    private def classrooms_data
      deserialized_classrooms_data.map { |data| data.merge(teacher_id: user.id, google_classroom_id: data.fetch(:id)) }
    end

    private def deserialized_classrooms_data
      JSON
        .parse(serialized_classrooms_data)
        .deep_symbolize_keys
        .fetch(:classrooms)
    end
  end
end
