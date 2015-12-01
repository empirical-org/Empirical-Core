class Profile::ActivitySessionSerializer < ActiveModel::Serializer
  attributes :percentage, :link
  has_one :activity, serializer: Profile::ActivitySerializer

  def link
    play_activity_session_path(object)
  end

end