# frozen_string_literal: true

module Auth
  class CleverController < ApplicationController
    def clever
      update_current_user_email
      result = CleverIntegration::SignUp::Main.run(auth_hash)
      send(result[:type], result[:data], result[:redirect])
    end

    private def auth_hash
      @auth_hash ||= request.env['omniauth.auth']
    end

    private def district_success(data, redirect=nil)
      render status: 200, nothing: true # Don't bother rendering anything.
    end

    private def update_current_user_email
      return unless route_redirects_to_my_account?(session[ApplicationController::CLEVER_REDIRECT])

      if current_user.update(email: auth_hash['info']['email'])
        session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET] = true
      else
        flash[:error] = t('clever.account_conflict')
        flash.keep(:error)
      end
    end

    private def user_success(user, redirect=nil)
      CompleteAccountCreation.new(user, request.remote_ip).call if user.previous_changes["id"]
      user.update_attributes(ip_address: request.remote_ip)
      if session[ApplicationController::CLEVER_REDIRECT]
        redirect_route = session[ApplicationController::CLEVER_REDIRECT]
        session[ApplicationController::CLEVER_REDIRECT] = nil
        redirect_to redirect_route
      else
        sign_in(user)
        if session[ApplicationController::POST_AUTH_REDIRECT].present?
          url = session[ApplicationController::POST_AUTH_REDIRECT]
          session.delete(ApplicationController::POST_AUTH_REDIRECT)
          return redirect_to url
        elsif current_user&.is_new_teacher_without_school?
          # then the user does not have a school and needs one
          return redirect_to '/sign-up/add-k12'
        end
        redirect_to profile_url
      end
    end

    private def user_failure(data, redirect)
      flash[:notice] = data || "error"
      redirect_to redirect || '/clever/no_classroom'
    end
  end
end
