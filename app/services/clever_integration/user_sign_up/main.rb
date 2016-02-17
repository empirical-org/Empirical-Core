module CleverIntegration::UserSignUp::Main

  def self.run(auth_hash)
    if auth_hash[:info][:id] && auth_hash[:credentials][:token]
      # If this is a teacher, import them and their classrooms, but not the classroom rosters.
      # If this is a student, connect them to an existing teacher through a classroom.
      user = self.setup_user(auth_hash)
      result = {type: 'user_success', data: user}
    else
      result = {type: 'user_failure', data: nil}
    end
    result
  end

  private

  def self.setup_user(auth_hash)
    User.setup_from_clever(auth_hash)
  end
end