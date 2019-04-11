class Auth::CleverController < ApplicationController

  # Theres an issue here - if a student belongs to multiple clever classrooms, then the student
  # will get moved to the quill classroom of her clever teacher that most recently signed in
  # (since right now a student on quill can only belong to one classroom)
  # TODO: refactor code so that a student can belong to more than one classroom

  # Note that we import everything not just on sign up, but on login as well
  # since a teacher may have created more clever classrooms /students betwixt logins
  def clever
    auth_hash = request.env['omniauth.auth']
    if session[:clever_redirect].include?('my_account')
      current_user.update(email: auth_hash['info']['email'])
    end
    result = CleverIntegration::SignUp::Main.run(auth_hash)
    send(result[:type], result[:data])
  end

  private

  def district_success(data)
    render status: 200, nothing: true # Don't bother rendering anything.
  end

  def user_success(data) # data is a User record
    new_user = !data.previous_changes["id"].nil?
    data.update_attributes(ip_address: request.remote_ip)
    if session[:clever_redirect]
      session[:google_or_clever_just_set] = true
      redirect_route = session[:clever_redirect]
      session[:clever_redirect] = nil
      return redirect_to redirect_route
    else
      sign_in(data)
      if current_user.role === 'teacher' && !current_user.school && new_user
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
