class AuthorizedUserForActivity

  def initialize(current_user, activity_session)
    @current_user = current_user
    @activity_session = activity_session
  end

  def call
    authorized_user?
  end

  private

  attr_reader :current_user, :activity_session

  def authorized_user?
    if current_user.present? && current_user.staff?
      return true
    end

    activity_session.present? &&
    activity_session.user == current_user
  end
end
