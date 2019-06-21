class Auth::CleverController < ApplicationController

  # Theres an issue here - if a student belongs to multiple clever classrooms, then the student
  # will get moved to the quill classroom of her clever teacher that most recently signed in
  # (since right now a student on quill can only belong to one classroom)
  # TODO: refactor code so that a student can belong to more than one classroom

  # Note that we import everything not just on sign up, but on login as well
  # since a teacher may have created more clever classrooms /students betwixt logins
  def clever
    auth_hash = request.env['omniauth.auth']
    if route_redirects_to_my_account?(session[ApplicationController::CLEVER_REDIRECT])
      user = current_user.update(email: auth_hash['info']['email'])
      if user
        session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET] = true
      else
        flash[:error] = "This Clever account is already associated with another Quill account. Contact support@quill.org for further assistance."
        flash.keep(:error)
      end
    end
    result = CleverIntegration::SignUp::Main.run(auth_hash)
    send(result[:type], result[:data])
  end

  private

  def district_success(data)
    render status: 200, nothing: true # Don't bother rendering anything.
  end

  def user_success(data) # data is a User record
    data.update_attributes(ip_address: request.remote_ip)
    if session[ApplicationController::CLEVER_REDIRECT]
      redirect_route = session[ApplicationController::CLEVER_REDIRECT]
      session[ApplicationController::CLEVER_REDIRECT] = nil
      return redirect_to redirect_route
    else
      sign_in(data)
      if current_user.is_new_teacher_without_school?
        # then the user does not have a school and needs one
        return redirect_to '/sign-up/add-k12'
      end
      return redirect_to profile_url
    end
  end

  def user_failure(data)
    flash[:notice] = data || "error"
    redirect_to '/clever/no_classroom'
  end
end
