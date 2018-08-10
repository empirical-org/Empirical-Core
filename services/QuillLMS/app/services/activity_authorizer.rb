class ActivityAuthorizer

  def initialize(current_user, activity_session)
    @current_user = current_user
    @activity_session = activity_session
  end

  def authorize
    return true if @current_user.try(:staff?)
    if @activity_session.blank? || @activity_session.user != @current_user
      return false
    end
    true
  end

  def authorize_teacher
    @activity_session&.classroom_unit&.classroom&.owner == @current_user
  end

end
