class Api::V1::UsersController < Api::ApiController

  def index
    has_refresh_token = false
    refresh_token_expires_at = nil
    if current_user
      user_id = current_user.id
      auth_credential = AuthCredential.where(user_id: user_id).first
      if auth_credential.present?
        if auth_credential.refresh_token
          has_refresh_token = true
          refresh_token_expires_at = auth_credential&.expires_at&.in_time_zone&.utc&.to_s&.sub(' ','T')
        end
      end
    end
    render json: {user: current_user, text: "Hi", has_refresh_token: has_refresh_token, refresh_token_expires_at: refresh_token_expires_at}
  end

  def current_user_and_coteachers
    if current_user
      coteachers = ActiveRecord::Base.connection.execute(
        "SELECT DISTINCT users.id, users.name FROM users
        JOIN classrooms_teachers AS A ON a.user_id = users.id
        JOIN classrooms_teachers AS B ON A.classroom_id = B.classroom_id
        WHERE B.user_id = #{current_user.id}
        AND NOT A.user_id = #{current_user.id}").to_a.map do |e|
          e['id'] = e['id'].to_i
          e
        end
      render json: {user: current_user, coteachers: coteachers}
    else
      render json: {user: current_user, coteachers: []}
    end
  end

  def current_user_role
    render json: { role: current_user&.role }
  end

end
