# frozen_string_literal: true

module Auth
  class LearnWorldsController < ApplicationController
    before_action :teacher!

    delegate :learn_worlds_access?, to: :current_user

    def courses
      if learn_worlds_access? && sso_success?
        create_learn_worlds_user
        update_last_login
        redirect_to learn_worlds_courses_endpoint
      else
        redirect_to root_path
      end
    end

    private def create_learn_worlds_user
      return if current_user.learn_worlds_account

      current_user.create_learn_worlds_account(external_id: learn_worlds_external_id)
    end

    private def learn_worlds_courses_endpoint
      sso_response["url"]
    end

    private def learn_worlds_external_id
      sso_response["user_id"]
    end

    private def sso_response
      @sso_response ||= LearnWorlds::SSORequest.run(current_user)
    end

    private def sso_success?
      sso_response["success"] == true
    end

    private def update_last_login
      current_user.learn_worlds_account.update(last_login: DateTime.current)
    end
  end
end
