module GoogleIntegration
  module Classrooms
    class Creator
      attr_reader :data, :google_classroom_id, :teacher_id

      def initialize(data)
        @data = data
        @google_classroom_id = data[:google_classroom_id]
        @teacher_id = data[:teacher_id]
      end

      def run
        classroom
      end

      private def classroom
        @classroom ||= ::Classroom.create!(
          google_classroom_id: google_classroom_id,
          name: name,
          synced_name: synced_name,
          teacher_id: teacher_id,
          classrooms_teachers_attributes: [
            {
              user_id: user_id,
              role: role
            }
          ]
        )
      end

      private def name
        data[:name].present? ? data[:name] : "Classroom #{google_classroom_id}"
      end

      private def role
        'owner'
      end

      private def synced_name
        data[:name]
      end

      private def user_id
        teacher_id
      end
    end
  end
end
