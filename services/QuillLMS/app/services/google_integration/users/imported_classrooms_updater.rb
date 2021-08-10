module GoogleIntegration
  module Users
    class ImportedClassroomsUpdater
      attr_reader :user_id

      def initialize(user_id)
        @user_id = user_id
      end

      def run
        update_classrooms
      end

      private def cached_data
        ClassroomsCache.get(user_id)
      end

      private def classrooms_data
        ClassroomsData.new(user, cached_data)
      end

      private def imported_classrooms_data
        classrooms_data.select do |classroom_data|
          ::Classroom.unscoped.exists?(
            google_classroom_id: classroom_data[:google_classroom_id],
            teacher_id: user_id
          )
        end
      end

      private def update_classrooms
        imported_classrooms_data.each { |data| GoogleIntegration::Classrooms::Updater.new(data).run }
      end

      private def user
        ::User.find(user_id)
      end
    end
  end
end
