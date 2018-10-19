class AuthorizedTeacherForActivity

  def initialize(current_user, activity_session)
    @current_user = current_user
    @activity_session = activity_session
  end

  def call
    authorized_teacher?
  end

  private

  attr_reader :current_user, :activity_session

  def authorized_teacher?
    activity_session.classroom_unit.classroom.owner == current_user
  end
end
