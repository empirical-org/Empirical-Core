# frozen_string_literal: true

module Auth
  class CleverController < ApplicationController
    around_action :force_writer_db_role, only: [:clever]

    class CleverAccountConflictError < StandardError; end

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

    # rubocop:disable Metrics/CyclomaticComplexity
    private def update_current_user_email
      return unless route_redirects_to_my_account?(session[ApplicationController::CLEVER_REDIRECT])

      current_user_id = current_user&.id
      new_email = auth_hash['info']['email']
      old_email = current_user&.email

      if current_user.update(email: auth_hash['info']['email'])
        session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET] = true
      else
        ErrorNotifier.report(
          CleverAccountConflictError.new, {
            clever_redirect: session[ApplicationController::CLEVER_REDIRECT],
            current_user_id: current_user_id,
            new_email: new_email,
            old_email: old_email,
            user_id: session[:user_id],
            validation_errors: current_user&.errors&.full_messages&.join('|')
          }
        )
        flash[:error] = t('clever.account_conflict')
        flash.keep(:error)
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    private def user_success(user, redirect=nil)
      CompleteAccountCreation.new(user, request.remote_ip).call if user.previous_changes["id"]
      user.update(ip_address: request.remote_ip)

      verify_email_if_necessary(user)

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
        elsif current_user.admin? && user.previous_changes["id"]
          return redirect_to '/sign-up/select-sub-role'
        elsif current_user&.is_new_teacher_without_school?
          # then the user does not have a school and needs one
          return redirect_to '/sign-up/add-k12'
        end
        redirect_to profile_url
      end
    end

    private def verify_email_if_necessary(user)
      user.verify_email(UserEmailVerification::CLEVER_VERIFICATION) if user.email_verification_pending?
    end

    private def user_failure(data, redirect)
      flash[:notice] = data || "error"
      redirect_to redirect || '/clever/no_classroom'
    end
  end
end
