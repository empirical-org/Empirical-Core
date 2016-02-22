class Auth::CleverController < ApplicationController

  # Theres an issue here - if a student belongs to multiple clever classrooms, then the student
  # will get moved to the quill classroom of her clever teacher that most recently signed in
  # (since right now a student on quill can only belong to one classroom)
  # TODO: refactor code so that a student can belong to more than one classroom

  # Note that we import everything not just on sign up, but on login as well
  # since a teacher may have created more clever classrooms /students betwixt logins
  def clever
    auth_hash = request.env['omniauth.auth']
    result = CleverIntegration::Main.run(auth_hash)
    send(result[:type], result[:data])
  end

  private

  def district_success(data)
    render status: 200, nothing: true # Don't bother rendering anything.
  end

  def district_failure(data)
    render status: 500, nothing: true
  end

  def user_success(data) # data is a User record
    data.update_attributes(ip_address: request.remote_ip)
    sign_in(data)
    redirect_to profile_url(protocol: 'http') # TODO Change this to use SSL when grammar supports SSL
  end

  def user_failure(data)
    login_failure('Invalid response received from Clever.')
  end
end