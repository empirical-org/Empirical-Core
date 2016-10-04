class Profile::ActivitySessionSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :percentage, :link, :due_date_or_completed_at_date
  has_one :activity, serializer: Profile::ActivitySerializer

  def link
    play_activity_session_path(object)
  end

  def due_date_or_completed_at_date
    object.display_due_date_or_completed_at_date
  end

end
