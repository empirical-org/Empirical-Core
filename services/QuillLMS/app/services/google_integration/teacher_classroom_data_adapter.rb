# frozen_string_literal: true

module GoogleIntegration
  class TeacherClassroomDataAdapter < ApplicationService
    attr_reader :user, :data

    def initialize(user, data)
      @user = user
      @data = data
    end

    def run
      clean_data
    end

    private def clean_data
      data.tap do |cleaned_data|
        cleaned_data[:google_classroom_id] = data.fetch(:id)
        cleaned_data[user_role_id_key] = user.id
      end
    end

    private def user_role_id_key
      "#{user.role}_id".to_sym
    end
  end
end

