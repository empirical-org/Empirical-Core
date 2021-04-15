class AuthorizedTeacherForActivity
  def initialize(current_user, activity_session)
    @current_user = current_user
    @activity_session = activity_session
  end

  def call
    authorized_teacher?
  end

  attr_reader :activity_session, :current_user
  private :activity_session
  private :current_user

  private def authorized_teacher?
    activity_session.classroom_unit.classroom.owner == current_user
  end
end
