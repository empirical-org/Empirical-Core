# frozen_string_literal: true

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

    render json: {
      user: current_user,
      text: "Hi",
      has_refresh_token: has_refresh_token,
      refresh_token_expires_at: refresh_token_expires_at
    }
  end

  def current_user_and_coteachers
    render json: {
      user: current_user,
      coteachers: coteachers
    }
  end

  def current_user_role
    render json: { role: current_user&.role }
  end

  private def coteachers
    return [] unless current_user

    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          users.id,
          users.name
        FROM users
        JOIN classrooms_teachers AS a
          ON a.user_id = users.id
        JOIN classrooms_teachers AS b
          ON a.classroom_id = b.classroom_id
        WHERE b.user_id = #{current_user.id}
          AND NOT a.user_id = #{current_user.id}
      SQL
    ).to_a
  end
end