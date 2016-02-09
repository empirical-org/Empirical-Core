class Scorebook::TeacherSerializer < ActiveModel::Serializer
  attributes :premium_state

  def premium_state
    object.premium_state
  end
end
