class AuthorizedUserForActivity

  def initialize(current_user, activity_session)
    @current_user = current_user
    @activity_session = activity_session
  end

  def call
    authorized_user?
  end

  attr_reader :activity_session, :current_user
  private :activity_session
  private :current_user

  private def authorized_user?
    if current_user.present? && current_user.staff?
      return true
    end

    activity_session.present? &&
    activity_session.user == current_user
  end
end
