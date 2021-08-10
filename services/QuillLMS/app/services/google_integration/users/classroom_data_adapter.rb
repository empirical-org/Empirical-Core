module GoogleIntegration
  module Users
    class ClassroomDataAdapter
      attr_accessor :user, :data

      def initialize(user, data)
        @user = user
        @data = data
      end

      def run
        add_google_classroom_id
        remove_id
        add_user_role_id
        data
      end

      private def add_user_role_id
        data[user_role_id_key] = user.id
      end

      private def user_role_id_key
        "#{user.role}_id".to_sym
      end

      private def add_google_classroom_id
        data[:google_classroom_id] = data.fetch(:id)
      end

      private def remove_id
        data.delete(:id)
      end
    end
  end
end

