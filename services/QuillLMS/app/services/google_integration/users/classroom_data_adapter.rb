module GoogleIntegration
  module Users
    class ClassroomDataAdapter
      attr_reader :user, :data

      def initialize(user, data)
        @user = user
        @data = data
      end

      def run
        cleaned_data
      end

      private def cleaned_data
        {}.tap do |result|
          result[:google_classroom_id] = data.fetch(:id)
          result[:grade] = data[:grade]
          result[:name] = data[:name]
          result[user_role_id_key] = user.id
        end
      end

      private def user_role_id_key
        "#{user.role}_id".to_sym
      end
    end
  end
end

