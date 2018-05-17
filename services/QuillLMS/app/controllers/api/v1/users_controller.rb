class Api::V1::UsersController < Api::ApiController

  def index
    render json: {user: current_user, text: "Hi"}
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

end
